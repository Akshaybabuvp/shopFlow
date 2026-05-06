import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import {
  loadRazorpayScript,
  generateOrderNumber,
  generateTrackingId,
  toRazorpayAmount,
} from '../lib/razorpay';

export function useRazorpay() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const initiatePayment = useCallback(
    async ({
      items,
      subtotal,
      shipping,
      tax,
      total,
      contact,
      shippingAddress,
      paymentMethod,
      userId,
      onSuccess,
      onFailure,
    }) => {
      setProcessing(true);
      setError(null);

      try {
        // ── 1. Create order record in Supabase (status: pending) ──
        const orderNumber = generateOrderNumber();
        const trackingId = generateTrackingId();

        const orderPayload = {
          order_number: orderNumber,
          user_id: userId || null,
          status: 'pending',
          payment_status: 'pending',
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            qty: i.qty,
            image: i.image,
            color: i.color,
            category: i.category,
          })),
          subtotal,
          shipping,
          tax,
          total,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          tracking_id: trackingId,
        };

        const { data: orderData, error: orderErr } = await supabase
          .from('orders')
          .insert(orderPayload)
          .select()
          .single();

        if (orderErr)
          throw new Error(`Order creation failed: ${orderErr.message}`);

        // ── 2. Handle COD separately ──────────────────────────────
        if (paymentMethod === 'cod') {
          await supabase
            .from('orders')
            .update({ status: 'confirmed', payment_status: 'pending' })
            .eq('id', orderData.id);

          setProcessing(false);
          onSuccess({
            orderNumber,
            trackingId,
            orderId: orderData.id,
            paymentId: null,
          });
          return;
        }

        // ── 3. Load Razorpay script ───────────────────────────────
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded)
          throw new Error('Failed to load Razorpay. Check your connection.');

        // ── 4. Open Razorpay checkout ─────────────────────────────
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey)
          throw new Error('Razorpay key not configured in .env');

        const amountInPaise = toRazorpayAmount(total);

        const options = {
          key: razorpayKey,
          amount: amountInPaise,
          currency: 'INR',
          name: 'ShopFlow',
          description: `Order ${orderNumber}`,
          image: 'https://via.placeholder.com/80x80/111111/FFBB33?text=SF',
          order_id: undefined, // For production: generate from Razorpay Orders API on server
          prefill: {
            name: `${contact.firstName} ${contact.lastName}`,
            email: contact.email,
            contact: contact.phone,
          },
          notes: {
            order_number: orderNumber,
            shopflow_id: orderData.id,
          },
          theme: {
            color: '#f59e0b',
          },
          modal: {
            ondismiss: async () => {
              // User closed the payment modal — mark as failed
              await supabase
                .from('orders')
                .update({ status: 'cancelled', payment_status: 'failed' })
                .eq('id', orderData.id);

              setProcessing(false);
              onFailure?.('Payment was cancelled.');
            },
          },

          // ── Payment success handler ─────────────────────────────
          handler: async (response) => {
            try {
              // Update order with payment details
              await supabase
                .from('orders')
                .update({
                  status: 'confirmed',
                  payment_status: 'paid',
                  payment_id: response.razorpay_payment_id,
                })
                .eq('id', orderData.id);

              setProcessing(false);
              onSuccess({
                orderNumber,
                trackingId,
                orderId: orderData.id,
                paymentId: response.razorpay_payment_id,
              });
            } catch (err) {
              setProcessing(false);
              onFailure?.(
                'Payment succeeded but order update failed. Contact support.',
              );
            }
          },
        };

        const rzp = new window.Razorpay(options);

        // Handle payment failure from Razorpay's side
        rzp.on('payment.failed', async (response) => {
          await supabase
            .from('orders')
            .update({ status: 'cancelled', payment_status: 'failed' })
            .eq('id', orderData.id);

          setProcessing(false);
          onFailure?.(
            response.error?.description || 'Payment failed. Please try again.',
          );
        });

        rzp.open();
      } catch (err) {
        console.error('Payment error:', err);
        setError(err.message);
        setProcessing(false);
        onFailure?.(err.message);
      }
    },
    [],
  );

  return { initiatePayment, processing, error };
}
