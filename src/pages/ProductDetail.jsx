// src/pages/ProductDetail.jsx
// Problem 1: Page always starts at top (ScrollToTop in App handles it)
// Problem 2: Add to Cart uses showToast from ToastContext
// Problem 4: No footer blink because ScrollToTop fires before render
import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { ProductDetailSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

const BADGE_STYLES = {
  Sale: 'bg-red-100 text-red-700',
  New: 'bg-emerald-100 text-emerald-700',
  Bestseller: 'bg-amber-100 text-amber-700',
};

function StarRating({ rating, reviews }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg
            key={s}
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
            stroke="#f59e0b"
            strokeWidth="1"
          >
            <polygon points="6,1 7.8,4.6 11.7,5.2 8.9,7.9 9.6,11.8 6,9.9 2.4,11.8 3.1,7.9 0.3,5.2 4.2,4.6" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500">
        {rating} · {reviews} reviews
      </span>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, related, loading, error } = useProduct(Number(id));

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState('features');

  const { addItem } = useCart();
  const { showToast } = useToast();

  // Set initial color when product loads
  if (product && selectedColor === null && product.colors?.length > 0) {
    setSelectedColor(product.colors[0]);
  }

  function handleAddToCart() {
    if (!product) return;
    addItem(product, qty, selectedColor);
    showToast(product.name);
  }

  function handleBuyNow() {
    if (!product) return;
    addItem(product, qty, selectedColor);
    showToast(product.name);
    setTimeout(() => navigate('/cart'), 400);
  }

  if (loading) return <ProductDetailSkeleton />;
  if (error) return <ErrorState message={error} />;
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] gap-4 px-4">
        <h2 className="font-display text-3xl text-[#111]">Product not found</h2>
        <Link to="/products" className="text-amber-600 hover:underline text-sm">
          ← Back to products
        </Link>
      </div>
    );
  }

  const discount = product.original_price
    ? Math.round(
        ((product.original_price - product.price) / product.original_price) *
          100,
      )
    : null;

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-[#111] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#111] transition-colors">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-[#111] transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#111] font-medium truncate max-w-[140px] sm:max-w-[200px]">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 md:pb-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:sticky lg:top-24"
          >
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-white aspect-square shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.badge && (
                <span
                  className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
                >
                  {product.badge}
                </span>
              )}
              {discount && (
                <span className="absolute top-4 right-4 bg-[#111] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  −{discount}%
                </span>
              )}
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-3 mt-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-150 ${
                    i === 1
                      ? 'border-[#111]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={product.image}
                    alt={`View ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Detail ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="pt-1"
          >
            <p className="text-amber-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl text-[#111] leading-tight mb-3">
              {product.name}
            </h1>

            <StarRating rating={product.rating} reviews={product.reviews} />

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4 mb-4">
              <span className="text-2xl sm:text-3xl font-semibold text-[#111]">
                ${product.price.toFixed(2)}
              </span>
              {product.original_price && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base mb-6 border-t border-gray-100 pt-4">
              {product.description}
            </p>

            {/* Color picker */}
            {product.colors && product.colors.length > 1 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-[#111] mb-2.5">
                  Colour
                  <span
                    className="ml-2 inline-block w-3 h-3 rounded-full border border-gray-200 align-middle"
                    style={{ background: selectedColor }}
                  />
                </p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-150 ${
                        selectedColor === color
                          ? 'border-[#111] scale-110'
                          : 'border-transparent hover:border-gray-400'
                      }`}
                      style={{ background: color }}
                      aria-label={`Select colour ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity stepper */}
            <div className="mb-5">
              <p className="text-sm font-medium text-[#111] mb-2.5">Quantity</p>
              <div className="flex items-center gap-0 border border-gray-200 rounded-2xl overflow-hidden w-fit bg-white">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#111] transition-colors text-xl font-light"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold text-[#111]">
                  {qty}
                </span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[#111] transition-colors text-xl font-light"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mb-4">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                className="flex-1 bg-[#111] text-white py-3.5 sm:py-4 rounded-2xl text-sm font-semibold hover:bg-gray-800 active:bg-black transition-colors tracking-wide"
              >
                Add to Cart — ${(product.price * qty).toFixed(2)}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center border border-gray-200 rounded-2xl hover:border-red-300 hover:text-red-400 text-gray-400 transition-colors bg-white"
                aria-label="Add to wishlist"
              >
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </motion.button>
            </div>

            {/* Buy Now */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleBuyNow}
              className="w-full bg-amber-400 text-black py-3.5 sm:py-4 rounded-2xl text-sm font-semibold hover:bg-amber-300 transition-colors tracking-wide mb-6"
            >
              Buy Now →
            </motion.button>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 p-3 sm:p-4 bg-white rounded-2xl border border-gray-100">
              {[
                { icon: '🚚', label: 'Free shipping', sub: 'Orders over ₹999' },
                { icon: '↩', label: 'Free returns', sub: '30-day policy' },
                { icon: '🔒', label: 'Secure pay', sub: '256-bit SSL' },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="text-center">
                  <div className="text-xl sm:text-2xl mb-1">{icon}</div>
                  <div className="text-[10px] sm:text-xs font-medium text-[#111]">
                    {label}
                  </div>
                  <div className="text-[9px] sm:text-[10px] text-gray-400 hidden sm:block">
                    {sub}
                  </div>
                </div>
              ))}
            </div>

            {/* Features / Specs tabs */}
            <div>
              <div className="flex border-b border-gray-200 mb-4">
                {['features', 'specs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 sm:px-5 py-3 text-sm font-medium capitalize transition-colors duration-150 border-b-2 -mb-px ${
                      activeTab === tab
                        ? 'border-[#111] text-[#111]'
                        : 'border-transparent text-gray-400 hover:text-[#111]'
                    }`}
                  >
                    {tab === 'features' ? 'Key Features' : 'Specifications'}
                  </button>
                ))}
              </div>

              {activeTab === 'features' ? (
                <motion.ul
                  key="features"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5"
                >
                  {(product.features || []).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-gray-700"
                    >
                      <span className="text-amber-500 mt-0.5 flex-shrink-0">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  key="specs"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="divide-y divide-gray-100"
                >
                  {(product.specs || []).map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex justify-between items-center py-2.5 text-sm"
                    >
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-[#111]">{value}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Related products */}
      {related && related.length > 0 && (
        <section className="bg-white py-14 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-7">
              <div>
                <p className="text-amber-600 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                  You might also like
                </p>
                <h2 className="font-display text-2xl sm:text-3xl text-[#111]">
                  Related <span className="italic">Products</span>
                </h2>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#111] transition-colors group"
              >
                See all
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  →
                </span>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} view="grid" />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
