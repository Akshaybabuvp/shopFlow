import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useOrders, useOrderByNumber } from '../hooks/useOrders';
import OrderCard from '../components/OrderCard';
import OrderDetailDrawer from '../components/OrderDetailDrawer';
import ErrorState from '../components/ErrorState';

// ── Loading skeleton for order cards ───────────────────
function OrderCardSkeleton({ i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.07 }}
      className="bg-white rounded-3xl p-5 border border-gray-100"
      style={{
        background:
          'linear-gradient(90deg, #f9f9f9 25%, #f0f0f0 50%, #f9f9f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    >
      <div className="h-4 w-40 bg-gray-200 rounded-full mb-2" />
      <div className="h-3 w-24 bg-gray-100 rounded-full mb-4" />
      <div className="flex gap-2 mb-4">
        {[1, 2, 3].map((j) => (
          <div key={j} className="w-10 h-10 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-3 w-full bg-gray-100 rounded-full" />
    </motion.div>
  );
}

// ── Guest order lookup ──────────────────────────────────
function GuestLookup() {
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [selected, setSelected] = useState(null);

  const { order, loading, error } = useOrderByNumber(submitted);

  function handleSearch() {
    if (!query.trim()) return;
    setSubmitted(query.trim().toUpperCase());
    setSelected(null);
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6">
        <h3 className="font-display text-xl text-[#111] mb-2">
          Track Your Order
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          Enter your order number to track your package. Format:{' '}
          <span className="font-mono text-amber-600">SF-YYYYMMDD-XXXXXX</span>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="SF-20240101-ABC123"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
          />
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSearch}
            disabled={loading}
            className="px-5 py-3 bg-[#111] text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
          >
            {loading ? (
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
            ) : (
              'Track →'
            )}
          </motion.button>
        </div>

        {error && submitted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-xs mt-3 pl-1"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Result */}
      <AnimatePresence>
        {order && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <OrderCard
              order={order}
              onClick={() => setSelected(order)}
              index={0}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ── Main Orders page ────────────────────────────────────
export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, error, refetch } = useOrders(user?.id);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const FILTERS = [
    { key: 'all', label: 'All Orders' },
    { key: 'active', label: 'Active' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  const filtered = orders.filter((o) => {
    if (filter === 'all') return true;
    if (filter === 'active')
      return ['pending', 'confirmed', 'processing', 'shipped'].includes(
        o.status,
      );
    if (filter === 'delivered') return o.status === 'delivered';
    if (filter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  const totalSpend = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((s, o) => s + Number(o.total), 0);

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      {/* Page header */}
      <div className="bg-[#111] py-14">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-amber-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Your Account
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-2">
            {user ? 'My Orders' : 'Track Order'}
          </h1>
          {user && !loading && orders.length > 0 && (
            <p className="text-gray-500 text-sm">
              {orders.length} orders · ${totalSpend.toFixed(2)} total spent
            </p>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ── Not logged in: show guest lookup ── */}
        {!authLoading && !user && <GuestLookup />}

        {/* ── Logged in: show order history ── */}
        {!authLoading && user && (
          <div>
            {/* Stats */}
            {orders.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Orders', value: orders.length },
                  { label: 'Total Spent', value: `$${totalSpend.toFixed(2)}` },
                  {
                    label: 'Active',
                    value: orders.filter((o) =>
                      [
                        'pending',
                        'confirmed',
                        'processing',
                        'shipped',
                      ].includes(o.status),
                    ).length,
                  },
                  {
                    label: 'Delivered',
                    value: orders.filter((o) => o.status === 'delivered')
                      .length,
                  },
                ].map(({ label, value }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl p-4 border border-gray-100"
                  >
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
                      {label}
                    </p>
                    <p className="font-display text-2xl text-[#111]">{value}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Filter tabs */}
            {orders.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {FILTERS.map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                      filter === key
                        ? 'bg-[#111] text-white'
                        : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {label}
                    {key === 'all' && (
                      <span className="ml-1.5 opacity-50">
                        ({orders.length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="space-y-4">
                {[0, 1, 2].map((i) => (
                  <OrderCardSkeleton key={i} i={i} />
                ))}
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <ErrorState message={error} onRetry={refetch} />
            )}

            {/* Empty state — no orders */}
            {!loading && !error && orders.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="text-7xl mb-6">📦</div>
                <h2 className="font-display text-3xl text-[#111] mb-3">
                  No orders yet
                </h2>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  When you place your first order, it will appear here for easy
                  tracking.
                </p>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111] text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-colors"
                >
                  Start Shopping →
                </Link>
              </motion.div>
            )}

            {/* Empty state — no filter results */}
            {!loading &&
              !error &&
              orders.length > 0 &&
              filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-gray-500">No {filter} orders found.</p>
                  <button
                    onClick={() => setFilter('all')}
                    className="text-amber-600 text-sm mt-2 hover:underline"
                  >
                    Show all orders
                  </button>
                </div>
              )}

            {/* Order list */}
            {!loading && !error && filtered.length > 0 && (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((order, i) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={i}
                      onClick={() => setSelected(order)}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Order detail drawer */}
      <OrderDetailDrawer order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
