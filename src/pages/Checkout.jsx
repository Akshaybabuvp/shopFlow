import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useRazorpay } from '../hooks/useRazorpay';
import FormField from '../components/FormField';
import PaymentReview from '../components/PaymentReview';

// ── Step indicator ───────────────────────────────────────
const STEPS = ['Contact', 'Shipping', 'Payment', 'Review'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300
                ${
                  done
                    ? 'bg-[#111] border-[#111] text-white'
                    : active
                      ? 'bg-white border-amber-400 text-amber-600'
                      : 'bg-white border-gray-200 text-gray-300'
                }`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span
                className={`text-[10px] font-medium mt-1 tracking-wide transition-colors duration-300
                ${active ? 'text-[#111]' : done ? 'text-gray-500' : 'text-gray-300'}`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`h-[2px] w-12 md:w-16 mx-1 mb-4 rounded-full transition-all duration-500 ${i < current ? 'bg-[#111]' : 'bg-gray-200'}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function slideVariants(dir) {
  return {
    initial: { opacity: 0, x: dir * 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: dir * -40 },
  };
}

function validateContact(f) {
  const e = {};
  if (!f.firstName.trim()) e.firstName = 'First name is required';
  if (!f.lastName.trim()) e.lastName = 'Last name is required';
  if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
    e.email = 'Enter a valid email';
  if (!f.phone.match(/^\+?[\d\s\-]{8,15}$/))
    e.phone = 'Enter a valid phone number';
  return e;
}

function validateShipping(f) {
  const e = {};
  if (!f.address.trim()) e.address = 'Address is required';
  if (!f.city.trim()) e.city = 'City is required';
  if (!f.state.trim()) e.state = 'State is required';
  if (!f.pincode.match(/^\d{4,10}$/)) e.pincode = 'Enter a valid pincode';
  return e;
}

function validatePayment(f) {
  if (f.method !== 'card') return {};
  const e = {};
  if (!f.cardNumber.replace(/\s/g, '').match(/^\d{16}$/))
    e.cardNumber = 'Enter valid 16-digit card number';
  if (!f.cardName.trim()) e.cardName = 'Name on card is required';
  if (!f.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
    e.expiry = 'Use MM/YY format';
  if (!f.cvv.match(/^\d{3,4}$/)) e.cvv = 'Enter valid CVV';
  return e;
}

// ── Confirmation screen ──────────────────────────────────
function ConfirmationScreen({
  contact,
  shippingAddr,
  payment,
  total,
  orderResult,
}) {
  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            type: 'spring',
            stiffness: 300,
            damping: 20,
          }}
          className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <svg
            width="40"
            height="40"
            fill="none"
            stroke="#111"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <motion.path
              d="M5 13l4 4L19 7"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <h1 className="font-display text-4xl text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-400 mb-5">
            Thank you, {contact.firstName}! Your order has been placed and
            payment received.
          </p>

          <div className="inline-block bg-white/10 rounded-xl px-5 py-2.5 mb-6">
            <span className="text-gray-400 text-sm">Order ID: </span>
            <span className="text-amber-400 font-bold tracking-widest">
              {orderResult.orderNumber}
            </span>
          </div>

          {orderResult.paymentId && (
            <div className="inline-block bg-white/10 rounded-xl px-5 py-2.5 mb-6 ml-2">
              <span className="text-gray-400 text-sm">Payment ID: </span>
              <span className="text-green-400 font-mono text-xs">
                {orderResult.paymentId}
              </span>
            </div>
          )}

          <div className="bg-white/5 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivering to</span>
              <span className="text-white font-medium">
                {shippingAddr.city}, {shippingAddr.state}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tracking ID</span>
              <span className="text-amber-400 font-mono text-xs">
                {orderResult.trackingId}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="text-white font-medium">
                {payment.method === 'razorpay'
                  ? '⚡ Razorpay'
                  : payment.method === 'cod'
                    ? '📦 Cash on Delivery'
                    : '💳 Card'}
              </span>
            </div>
            <div className="flex justify-between text-sm border-t border-white/10 pt-3">
              <span className="text-gray-500">Total paid</span>
              <span className="text-amber-400 font-bold">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-amber-400 text-black text-sm font-bold rounded-full hover:bg-amber-300 transition-colors"
            >
              Track Order →
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 border border-white/20 text-white text-sm font-medium rounded-full hover:bg-white/5 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ── Main Checkout ────────────────────────────────────────
export default function Checkout() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { initiatePayment, processing, error: payError } = useRazorpay();

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [paymentError, setPaymentError] = useState('');

  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
  });
  const [shippingAddr, setShippingAddr] = useState({
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [payment, setPayment] = useState({
    method: 'razorpay',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  function field(obj, setObj, key) {
    return {
      value: obj[key],
      onChange: (e) => {
        setObj((p) => ({ ...p, [key]: e.target.value }));
        if (errors[key])
          setErrors((p) => {
            const n = { ...p };
            delete n[key];
            return n;
          });
      },
      error: errors[key],
    };
  }

  function goNext() {
    let errs = {};
    if (step === 0) errs = validateContact(contact);
    if (step === 1) errs = validateShipping(shippingAddr);
    if (step === 2) errs = validatePayment(payment);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setDir(1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setErrors({});
    setPaymentError('');
    setDir(-1);
    setStep((s) => s - 1);
  }

  async function handlePlaceOrder() {
    setPaymentError('');
    await initiatePayment({
      items,
      subtotal,
      shipping,
      tax,
      total,
      contact,
      shippingAddress: shippingAddr,
      paymentMethod: payment.method,
      userId: user?.id || null,
      onSuccess: (result) => {
        clearCart();
        setOrderResult(result);
        setConfirmed(true);
      },
      onFailure: (msg) => {
        setPaymentError(msg || 'Payment failed. Please try again.');
      },
    });
  }

  if (confirmed && orderResult) {
    return (
      <ConfirmationScreen
        contact={contact}
        shippingAddr={shippingAddr}
        payment={payment}
        total={total}
        orderResult={orderResult}
      />
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#faf9f6] gap-4">
        <h2 className="font-display text-3xl text-[#111]">
          Your cart is empty
        </h2>
        <Link to="/products" className="text-amber-600 hover:underline text-sm">
          ← Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="bg-[#111] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
            Almost there
          </p>
          <h1 className="font-display text-4xl text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10 items-start">
          {/* ── Left: Form ── */}
          <div>
            <StepIndicator current={step} />

            {/* Payment error banner */}
            <AnimatePresence>
              {paymentError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-start gap-3"
                >
                  <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                  <div>
                    <p className="text-red-700 text-sm font-medium">
                      Payment Failed
                    </p>
                    <p className="text-red-500 text-xs mt-0.5">
                      {paymentError}
                    </p>
                  </div>
                  <button
                    onClick={() => setPaymentError('')}
                    className="ml-auto text-red-300 hover:text-red-500 text-lg leading-none"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                {/* ── Step 0: Contact ── */}
                {step === 0 && (
                  <motion.div
                    key="contact"
                    variants={slideVariants(dir)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="font-display text-2xl text-[#111] mb-6">
                      Contact Information
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        label="First Name"
                        id="firstName"
                        required
                        autoComplete="given-name"
                        {...field(contact, setContact, 'firstName')}
                      />
                      <FormField
                        label="Last Name"
                        id="lastName"
                        required
                        autoComplete="family-name"
                        {...field(contact, setContact, 'lastName')}
                      />
                      <div className="sm:col-span-2">
                        <FormField
                          label="Email Address"
                          id="email"
                          type="email"
                          required
                          autoComplete="email"
                          {...field(contact, setContact, 'email')}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FormField
                          label="Phone Number"
                          id="phone"
                          type="tel"
                          required
                          autoComplete="tel"
                          placeholder="+91 98765 43210"
                          {...field(contact, setContact, 'phone')}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 1: Shipping ── */}
                {step === 1 && (
                  <motion.div
                    key="shipping"
                    variants={slideVariants(dir)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="font-display text-2xl text-[#111] mb-6">
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <FormField
                          label="Street Address"
                          id="address"
                          required
                          autoComplete="street-address"
                          {...field(shippingAddr, setShippingAddr, 'address')}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <FormField
                          label="Apartment, suite, etc. (optional)"
                          id="apartment"
                          autoComplete="address-line2"
                          {...field(shippingAddr, setShippingAddr, 'apartment')}
                        />
                      </div>
                      <FormField
                        label="City"
                        id="city"
                        required
                        autoComplete="address-level2"
                        {...field(shippingAddr, setShippingAddr, 'city')}
                      />
                      <FormField
                        label="State"
                        id="state"
                        required
                        autoComplete="address-level1"
                        {...field(shippingAddr, setShippingAddr, 'state')}
                      />
                      <FormField
                        label="Pincode"
                        id="pincode"
                        required
                        autoComplete="postal-code"
                        {...field(shippingAddr, setShippingAddr, 'pincode')}
                      />
                      <div className="relative">
                        <select
                          value={shippingAddr.country}
                          onChange={(e) =>
                            setShippingAddr((p) => ({
                              ...p,
                              country: e.target.value,
                            }))
                          }
                          className="w-full border border-gray-200 rounded-xl px-4 pt-5 pb-2 text-sm text-[#111] bg-white outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all appearance-none"
                        >
                          {[
                            'India',
                            'United States',
                            'United Kingdom',
                            'Canada',
                            'Australia',
                          ].map((c) => (
                            <option key={c}>{c}</option>
                          ))}
                        </select>
                        <label className="absolute left-4 top-2 text-xs font-medium text-gray-400 pointer-events-none">
                          Country
                        </label>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">
                          ▾
                        </span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold text-[#111] mb-3">
                        Shipping Method
                      </h3>
                      <div className="space-y-2.5">
                        {[
                          {
                            id: 'standard',
                            label: 'Standard Delivery',
                            sub: '5–7 business days',
                            price: shipping === 0 ? 'Free' : '$9.99',
                          },
                          {
                            id: 'express',
                            label: 'Express Delivery',
                            sub: '2–3 business days',
                            price: '$19.99',
                          },
                        ].map((opt) => (
                          <label
                            key={opt.id}
                            className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3.5 cursor-pointer hover:border-amber-400 transition-colors has-[:checked]:border-amber-400 has-[:checked]:bg-amber-50"
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                defaultChecked={opt.id === 'standard'}
                                className="accent-amber-500"
                              />
                              <div>
                                <div className="text-sm font-medium text-[#111]">
                                  {opt.label}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {opt.sub}
                                </div>
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-[#111]">
                              {opt.price}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── Step 2: Payment ── */}
                {step === 2 && (
                  <motion.div
                    key="payment"
                    variants={slideVariants(dir)}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2 className="font-display text-2xl text-[#111] mb-6">
                      Payment Method
                    </h2>
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { id: 'razorpay', label: 'Razorpay', icon: '⚡' },
                        { id: 'card', label: 'Card', icon: '💳' },
                        { id: 'cod', label: 'Cash on Delivery', icon: '📦' },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() =>
                            setPayment((p) => ({ ...p, method: m.id }))
                          }
                          className={`flex flex-col items-center gap-1.5 py-3.5 px-3 border-2 rounded-2xl text-xs font-medium transition-all duration-200
                            ${
                              payment.method === m.id
                                ? 'border-amber-400 bg-amber-50 text-amber-700'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                        >
                          <span className="text-xl">{m.icon}</span>
                          {m.label}
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {payment.method === 'card' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="space-y-4 pt-2">
                            <FormField
                              label="Card Number"
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              autoComplete="cc-number"
                              {...field(payment, setPayment, 'cardNumber')}
                              onChange={(e) => {
                                const val = e.target.value
                                  .replace(/\D/g, '')
                                  .slice(0, 16);
                                const fmt =
                                  val.match(/.{1,4}/g)?.join(' ') || val;
                                setPayment((p) => ({ ...p, cardNumber: fmt }));
                                if (errors.cardNumber)
                                  setErrors((p) => {
                                    const n = { ...p };
                                    delete n.cardNumber;
                                    return n;
                                  });
                              }}
                            />
                            <FormField
                              label="Name on Card"
                              id="cardName"
                              autoComplete="cc-name"
                              {...field(payment, setPayment, 'cardName')}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                label="Expiry (MM/YY)"
                                id="expiry"
                                placeholder="MM/YY"
                                autoComplete="cc-exp"
                                {...field(payment, setPayment, 'expiry')}
                                onChange={(e) => {
                                  let val = e.target.value
                                    .replace(/\D/g, '')
                                    .slice(0, 4);
                                  if (val.length >= 3)
                                    val = val.slice(0, 2) + '/' + val.slice(2);
                                  setPayment((p) => ({ ...p, expiry: val }));
                                  if (errors.expiry)
                                    setErrors((p) => {
                                      const n = { ...p };
                                      delete n.expiry;
                                      return n;
                                    });
                                }}
                              />
                              <FormField
                                label="CVV"
                                id="cvv"
                                type="password"
                                placeholder="•••"
                                autoComplete="cc-csc"
                                {...field(payment, setPayment, 'cvv')}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {payment.method === 'razorpay' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700"
                      >
                        <span className="text-lg">⚡</span>
                        <div>
                          <div className="font-semibold mb-0.5">
                            Pay via Razorpay
                          </div>
                          <div className="text-xs text-blue-500">
                            UPI, cards, net banking, and wallets accepted.
                            Amount will be charged in INR.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {payment.method === 'cod' && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-2xl p-4 text-sm text-green-700"
                      >
                        <span className="text-lg">📦</span>
                        <div>
                          <div className="font-semibold mb-0.5">
                            Cash on Delivery
                          </div>
                          <div className="text-xs text-green-600">
                            Pay when your order arrives. COD charges of ₹49 may
                            apply.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ── Step 3: Review ── */}
                {step === 3 && (
                  <PaymentReview
                    contact={contact}
                    shippingAddress={shippingAddr}
                    paymentMethod={payment.method}
                    items={items}
                    subtotal={subtotal}
                    shipping={shipping}
                    tax={tax}
                    total={total}
                    onConfirm={handlePlaceOrder}
                    onBack={goBack}
                    processing={processing}
                  />
                )}
              </AnimatePresence>

              {/* Navigation (steps 0–2 only) */}
              {step < 3 && (
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
                  {step > 0 ? (
                    <button
                      onClick={goBack}
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111] transition-colors group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform inline-block">
                        ←
                      </span>
                      Back
                    </button>
                  ) : (
                    <Link
                      to="/cart"
                      className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111] transition-colors group"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform inline-block">
                        ←
                      </span>
                      Back to Cart
                    </Link>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={goNext}
                    className="px-8 py-3.5 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors tracking-wide"
                  >
                    {step === 2 ? 'Review Order →' : 'Continue →'}
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-[#111] rounded-3xl p-6 text-white">
              <h2 className="font-display text-xl mb-5">Order Summary</h2>
              <div className="space-y-4 mb-5 max-h-52 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.color}`}
                    className="flex gap-3 items-center"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl"
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-gray-500 text-[10px]">
                        {item.category}
                      </p>
                    </div>
                    <span className="text-white text-sm font-semibold">
                      ${(item.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2.5 text-sm mb-5">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span
                    className={shipping === 0 ? 'text-green-400' : 'text-white'}
                  >
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between items-baseline mb-4">
                <span className="text-white font-semibold">Total</span>
                <span className="text-amber-400 text-2xl font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
              <p className="text-gray-600 text-[10px] text-center">
                ≈ ₹{(total * 83).toFixed(0)} INR · charged in INR via Razorpay
              </p>
              <div className="mt-4 flex items-center justify-center gap-1.5 text-gray-600 text-xs">
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
                256-bit SSL secured checkout
              </div>
            </div>
            <div className="mt-4 bg-white rounded-2xl p-4 border border-gray-100 text-xs text-gray-500 text-center">
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
