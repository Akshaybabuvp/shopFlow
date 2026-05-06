import { motion } from 'framer-motion';

export default function PaymentReview({
  contact,
  shippingAddress,
  paymentMethod,
  items,
  subtotal,
  shipping,
  tax,
  total,
  onConfirm,
  onBack,
  processing,
}) {
  const methodLabel = {
    razorpay: 'Razorpay (UPI / Card / Wallet)',
    card: 'Credit / Debit Card',
    cod: 'Cash on Delivery',
  };

  return (
    <motion.div
      key="review"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="font-display text-2xl text-[#111] mb-6">
        Review Your Order
      </h2>

      <div className="space-y-4 mb-8">
        {/* Contact */}
        <div className="bg-[#faf9f6] rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Contact
            </h3>
          </div>
          <p className="text-sm font-medium text-[#111]">
            {contact.firstName} {contact.lastName}
          </p>
          <p className="text-sm text-gray-500">{contact.email}</p>
          <p className="text-sm text-gray-500">{contact.phone}</p>
        </div>

        {/* Shipping address */}
        <div className="bg-[#faf9f6] rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Ship To
          </h3>
          <p className="text-sm text-[#111]">
            {shippingAddress.address}
            {shippingAddress.apartment && `, ${shippingAddress.apartment}`}
          </p>
          <p className="text-sm text-gray-500">
            {shippingAddress.city}, {shippingAddress.state} –{' '}
            {shippingAddress.pincode}
          </p>
          <p className="text-sm text-gray-500">{shippingAddress.country}</p>
        </div>

        {/* Payment method */}
        <div className="bg-[#faf9f6] rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Payment
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {paymentMethod === 'razorpay'
                ? '⚡'
                : paymentMethod === 'cod'
                  ? '📦'
                  : '💳'}
            </span>
            <span className="text-sm font-medium text-[#111]">
              {methodLabel[paymentMethod]}
            </span>
          </div>
          {paymentMethod === 'razorpay' && (
            <p className="text-xs text-gray-400 mt-1.5">
              You'll be redirected to Razorpay's secure checkout window.
            </p>
          )}
        </div>

        {/* Items */}
        <div className="bg-[#faf9f6] rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Items ({items.reduce((s, i) => s + i.qty, 0)})
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.color}`}
                className="flex items-center gap-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#111] truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                </div>
                <span className="text-sm font-semibold text-[#111]">
                  ${(item.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-[#faf9f6] rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Shipping</span>
            <span
              className={shipping === 0 ? 'text-green-600 font-medium' : ''}
            >
              {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-[#111] border-t border-gray-200 pt-2 mt-1">
            <span>Total</span>
            <span className="text-amber-600">${total.toFixed(2)}</span>
          </div>
          <p className="text-[10px] text-gray-400 text-center pt-1">
            ≈ ₹{(total * 83).toFixed(0)} INR · charged via Razorpay in INR
          </p>
        </div>
      </div>

      {/* CTAs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          disabled={processing}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111] transition-colors group disabled:opacity-40"
        >
          <span className="group-hover:-translate-x-1 transition-transform inline-block">
            ←
          </span>
          Back
        </button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onConfirm}
          disabled={processing}
          className="px-8 py-3.5 bg-amber-400 text-black text-sm font-bold rounded-full hover:bg-amber-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 tracking-wide"
        >
          {processing ? (
            <>
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              {paymentMethod === 'cod'
                ? '📦 Place Order'
                : paymentMethod === 'razorpay'
                  ? '⚡ Pay with Razorpay'
                  : '💳 Pay Now'}{' '}
              — ${total.toFixed(2)}
            </>
          )}
        </motion.button>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-gray-400 text-xs mt-5">
        <svg
          width="11"
          height="11"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
        Your payment is secured by 256-bit SSL encryption
      </div>
    </motion.div>
  );
}
