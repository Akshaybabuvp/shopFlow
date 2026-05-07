import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES_LIST, SORT_OPTIONS } from '../data/products';

function GridIcon({ active }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke={active ? '#111' : '#aaa'}
      strokeWidth="1.5"
    >
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="11" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  );
}
function ListIcon({ active }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke={active ? '#111' : '#aaa'}
      strokeWidth="1.5"
    >
      <rect x="1" y="2" width="16" height="4" rx="1.5" />
      <rect x="1" y="9" width="16" height="4" rx="1.5" />
      <line x1="1" y1="14" x2="17" y2="14" />
    </svg>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || 'All';

  const [activeCategory, setActiveCategory] = useState(
    CATEGORIES_LIST.includes(initialCat) ? initialCat : 'All',
  );
  const [sortBy, setSortBy] = useState('featured');
  const [view, setView] = useState('grid');
  const [priceRange, setPriceRange] = useState(500);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { products, loading, error, refetch } = useProducts({
    category: activeCategory,
    sortBy,
    priceMax: priceRange,
    onlyOnSale,
  });

  function handleCategoryClick(cat) {
    setActiveCategory(cat);
    if (cat === 'All') searchParams.delete('category');
    else searchParams.set('category', cat);
    setSearchParams(searchParams);
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <div className="bg-[#111] py-14">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Our Collection
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white">
            All <span className="italic">Products</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Category
                </h3>
                <ul className="space-y-1">
                  {CATEGORIES_LIST.map((cat) => (
                    <li key={cat}>
                      <button
                        onClick={() => handleCategoryClick(cat)}
                        className={`w-full text-left text-sm px-3 py-2 rounded-xl transition-all duration-150 ${
                          activeCategory === cat
                            ? 'bg-[#111] text-white font-medium'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-[#111]'
                        }`}
                      >
                        {cat}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Max Price
                </h3>
                <input
                  type="range"
                  min={20}
                  max={500}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>$0</span>
                  <span className="font-semibold text-[#111]">
                    ${priceRange}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Offers
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={onlyOnSale}
                      onChange={(e) => setOnlyOnSale(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-5 rounded-full transition-colors duration-200 ${onlyOnSale ? 'bg-amber-400' : 'bg-gray-200'}`}
                    />
                    <div
                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${onlyOnSale ? 'translate-x-5' : ''}`}
                    />
                  </div>
                  <span className="text-sm text-gray-600">On Sale Only</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setActiveCategory('All');
                  setSortBy('featured');
                  setPriceRange(500);
                  setOnlyOnSale(false);
                  setSearchParams({});
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors underline underline-offset-2"
              >
                Reset all filters
              </button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-gray-400 transition-colors"
              >
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
                Filters
              </button>
              <div className="flex lg:hidden gap-2 overflow-x-auto pb-1 flex-1">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat ? 'bg-[#111] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="hidden lg:block flex-1" />
              <span className="text-sm text-gray-400">
                {loading ? '...' : `${products.length} products`}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1 bg-white">
                <button
                  onClick={() => setView('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  aria-label="Grid view"
                >
                  <GridIcon active={view === 'grid'} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-1.5 rounded-lg transition-colors ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  aria-label="List view"
                >
                  <ListIcon active={view === 'list'} />
                </button>
              </div>
            </div>

            {/* Mobile filter drawer */}
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="lg:hidden overflow-hidden mb-6 bg-white rounded-2xl border border-gray-100 p-5"
                >
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        Max Price
                      </h3>
                      <input
                        type="range"
                        min={20}
                        max={500}
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                      <div className="text-xs text-gray-400 mt-1">
                        Up to <strong>${priceRange}</strong>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
                        Offers
                      </h3>
                      <label className="flex items-center gap-2 cursor-pointer mt-2">
                        <input
                          type="checkbox"
                          checked={onlyOnSale}
                          onChange={(e) => setOnlyOnSale(e.target.checked)}
                          className="accent-amber-400"
                        />
                        <span className="text-sm text-gray-600">
                          Sale items only
                        </span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter chips */}
            {(activeCategory !== 'All' || onlyOnSale || priceRange < 500) && (
              <div className="flex flex-wrap gap-2 mb-5">
                {activeCategory !== 'All' && (
                  <span className="flex items-center gap-1.5 bg-[#111] text-white text-xs px-3 py-1.5 rounded-full">
                    {activeCategory}
                    <button onClick={() => handleCategoryClick('All')}>
                      ×
                    </button>
                  </span>
                )}
                {onlyOnSale && (
                  <span className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs px-3 py-1.5 rounded-full">
                    On Sale{' '}
                    <button onClick={() => setOnlyOnSale(false)}>×</button>
                  </span>
                )}
                {priceRange < 500 && (
                  <span className="flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs px-3 py-1.5 rounded-full">
                    Max ${priceRange}{' '}
                    <button onClick={() => setPriceRange(500)}>×</button>
                  </span>
                )}
              </div>
            )}

            {/* Content */}
            {loading && <ProductGridSkeleton count={6} />}
            {error && <ErrorState message={error} onRetry={refetch} />}
            {!loading && !error && (
              <AnimatePresence mode="wait">
                {products.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-24"
                  >
                    <div className="text-5xl mb-4">🛍️</div>
                    <h3 className="font-display text-2xl text-gray-400 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Try adjusting your filters.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={view}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={
                      view === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5'
                        : 'flex flex-col gap-4'
                    }
                  >
                    {products.map((product, i) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }}
                      >
                        <ProductCard product={product} view={view} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
