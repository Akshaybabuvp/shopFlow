// src/components/ProductCard.jsx
// Problem 1: uses Link (react-router) so ScrollToTop fires on click → scrolls to top
// Problem 2: Quick-add button fires showToast
// Problem 4: No manual scroll needed — ScrollToTop handles it
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const BADGE_STYLES = {
  Sale: 'bg-red-100 text-red-700',
  New: 'bg-emerald-100 text-emerald-700',
  Bestseller: 'bg-amber-100 text-amber-700',
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s}
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill={s <= Math.round(rating) ? '#f59e0b' : 'none'}
          stroke="#f59e0b"
          strokeWidth="1"
        >
          <polygon points="6,1 7.8,4.6 11.7,5.2 8.9,7.9 9.6,11.8 6,9.9 2.4,11.8 3.1,7.9 0.3,5.2 4.2,4.6" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductCard({ product, view = 'grid' }) {
  const { addItem } = useCart();
  const { showToast } = useToast();

  function handleQuickAdd(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, product.colors?.[0] || null);
    showToast(product.name);
  }

  // ── LIST VIEW ────────────────────────────────────────────
  if (view === 'list') {
    return (
      <motion.div layout>
        <Link
          to={`/products/${product.id}`}
          className="group flex gap-3 sm:gap-4 bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 p-3 sm:p-4"
        >
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {product.badge && (
              <span
                className={`absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${BADGE_STYLES[product.badge]}`}
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center flex-1 min-w-0 py-1">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-[#111] text-sm sm:text-base mb-1 group-hover:text-amber-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-2 line-clamp-2 hidden sm:block">
              {product.description}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <StarRating rating={product.rating} />
              <span className="text-xs text-gray-400">({product.reviews})</span>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[#111] font-semibold text-sm">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-gray-400 text-xs line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                <button
                  onClick={handleQuickAdd}
                  className="px-3 py-1.5 bg-[#111] text-white text-xs font-semibold rounded-full hover:bg-amber-500 transition-colors"
                >
                  + Cart
                </button>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // ── GRID VIEW ────────────────────────────────────────────
  return (
    <motion.div layout className="h-full">
      <Link
        to={`/products/${product.id}`}
        className="group flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full"
      >
        {/* Image container */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span
              className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${BADGE_STYLES[product.badge]}`}
            >
              {product.badge}
            </span>
          )}

          {/* Quick Add overlay — shows on hover (desktop) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <button
              onClick={handleQuickAdd}
              className="bg-white text-black text-xs font-bold px-5 py-2.5 rounded-full shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform duration-300 hover:bg-amber-400 active:scale-95"
            >
              + Add to Cart
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4 flex flex-col flex-1">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-[#111] text-sm sm:text-base mb-2 group-hover:text-amber-600 transition-colors line-clamp-1 flex-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-gray-400">({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[#111] font-semibold text-base sm:text-lg">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-gray-400 text-xs sm:text-sm line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {/* Mobile quick-add button (always visible on mobile) */}
            <button
              onClick={handleQuickAdd}
              className="sm:hidden flex-shrink-0 w-8 h-8 bg-[#111] text-white rounded-full flex items-center justify-center text-lg font-light hover:bg-amber-500 transition-colors active:scale-95"
              aria-label="Add to cart"
            >
              +
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
