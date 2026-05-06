import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

function QuantityStepper({ value, onChange }) {
  return (
    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => onChange(value - 1)}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#111] transition-colors text-lg font-light"
        aria-label="Decrease"
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-semibold text-[#111]">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#111] transition-colors text-lg font-light"
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export default function Cart() {
  const {
    items,
    cartCount,
    subtotal,
    shipping,
    tax,
    total,
    removeItem,
    updateQty,
    clearCart,
  } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  function applyPromo() {
    if (promoCode.trim().toUpperCase() === 'SHOPFLOW10') {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try SHOPFLOW10');
      setPromoApplied(false);
    }
  }

  const promoDiscount = promoApplied ? subtotal * 0.1 : 0;
  const finalTotal = total - promoDiscount;

  // ── Empty cart ──────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#faf9f6] px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-7xl mb-6">🛍️</div>
          <h2 className="font-display text-4xl text-[#111] mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm">
            Looks like you haven't added anything yet. Discover our curated
            collection.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
          >
            Browse Products →
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Filled cart ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Header */}
      <div className="bg-[#111] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
            Review your order
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            Your <span className="italic">Cart</span>
            <span className="ml-4 text-2xl font-sans font-normal text-gray-400 align-middle">
              ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">
          {/* ── Left: Cart items ── */}
          <div>
            {/* Clear all */}
            <div className="flex items-center justify-between mb-6">
              <Link
                to="/products"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111] transition-colors group"
              >
                <span className="group-hover:-translate-x-1 transition-transform inline-block">
                  ←
                </span>
                Continue shopping
              </Link>
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Clear all
              </button>
            </div>

            {/* Items list */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.div
                    key={`${item.id}-${item.color}`}
                    layout
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Image */}
                    <Link
                      to={`/products/${item.id}`}
                      className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden group"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
                      />
                    </Link>

                    {/* Detail */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">
                            {item.category}
                          </p>
                          <Link
                            to={`/products/${item.id}`}
                            className="font-semibold text-[#111] text-sm hover:text-amber-600 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          {item.color && (
                            <div className="flex items-center gap-1.5 mt-1">
                              <span
                                className="w-3 h-3 rounded-full border border-gray-200 inline-block"
                                style={{ background: item.color }}
                              />
                              <span className="text-[10px] text-gray-400">
                                Colour selected
                              </span>
                            </div>
                          )}
                        </div>
                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id, item.color)}
                          aria-label="Remove item"
                          className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 p-1"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            viewBox="0 0 24 24"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>

                      {/* Price + stepper */}
                      <div className="flex items-center justify-between mt-3">
                        <QuantityStepper
                          value={item.qty}
                          onChange={(qty) => {
                            if (qty < 1) removeItem(item.id, item.color);
                            else updateQty(item.id, item.color, qty);
                          }}
                        />
                        <div className="text-right">
                          <div className="font-semibold text-[#111] text-base">
                            ${(item.price * item.qty).toFixed(2)}
                          </div>
                          {item.qty > 1 && (
                            <div className="text-[11px] text-gray-400">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-[#111] rounded-3xl p-6 text-white">
              <h2 className="font-display text-2xl mb-6">Order Summary</h2>

              {/* Line items */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span
                    className={
                      shipping === 0
                        ? 'text-green-400 font-medium'
                        : 'text-white'
                    }
                  >
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-between text-green-400"
                  >
                    <span>Promo (SHOPFLOW10)</span>
                    <span>−${promoDiscount.toFixed(2)}</span>
                  </motion.div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-semibold">Total</span>
                  <motion.span
                    key={finalTotal.toFixed(2)}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-amber-400"
                  >
                    ${finalTotal.toFixed(2)}
                  </motion.span>
                </div>
                {shipping > 0 && (
                  <p className="text-[11px] text-gray-500 mt-1">
                    Add ${(999 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              {/* Promo code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPromo()}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400/60 transition-colors"
                  />
                  <button
                    onClick={applyPromo}
                    className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-sm font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
                <AnimatePresence>
                  {promoError && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-2"
                    >
                      {promoError}
                    </motion.p>
                  )}
                  {promoApplied && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-green-400 text-xs mt-2"
                    >
                      ✓ 10% discount applied!
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Checkout CTA */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-amber-400 text-black py-4 rounded-2xl text-sm font-bold hover:bg-amber-300 transition-colors tracking-wide mb-3"
              >
                Proceed to Checkout →
              </motion.button>

              {/* Secure badge */}
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Secure SSL encrypted checkout
              </div>
            </div>

            {/* Payment logos */}
            <div className="mt-4 flex items-center justify-center gap-3 opacity-50">
              {['Visa', 'MC', 'Amex', 'UPI', 'Razorpay'].map((p) => (
                <span
                  key={p}
                  className="text-[10px] font-bold text-gray-400 border border-gray-200 rounded px-2 py-1"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
