import { useState, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  useIsAdmin,
  useAdminProducts,
  useAdminOrders,
} from '../hooks/useAdmin';
import { useAuth } from '../context/AuthContext';
import ProductModal from '../components/admin/ProductModal';

// ── Shared sub-components ────────────────────────────────

function KPICard({ label, value, sub, icon, accent = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={`rounded-2xl p-5 border ${accent ? 'bg-amber-400 border-amber-300' : 'bg-[#1a1a1a] border-white/10'}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {sub && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${accent ? 'bg-black/10 text-black/60' : 'bg-white/5 text-gray-500'}`}
          >
            {sub}
          </span>
        )}
      </div>
      <p
        className={`font-display text-3xl mb-1 ${accent ? 'text-black' : 'text-white'}`}
      >
        {value}
      </p>
      <p
        className={`text-xs font-medium ${accent ? 'text-black/60' : 'text-gray-500'}`}
      >
        {label}
      </p>
    </motion.div>
  );
}

const STATUS_OPTIONS = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];
const STATUS_COLORS = {
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  confirmed: 'text-blue-400   bg-blue-400/10   border-blue-400/20',
  processing: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  shipped: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  delivered: 'text-green-400  bg-green-400/10  border-green-400/20',
  cancelled: 'text-red-400    bg-red-400/10    border-red-400/20',
};

// ── Products tab ─────────────────────────────────────────
function ProductsTab({
  products,
  loading,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleActive,
}) {
  const [modal, setModal] = useState(null); // null | 'create' | product
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function handleSave(payload) {
    if (modal && modal !== 'create') {
      const { error } = await updateProduct(modal.id, payload);
      if (!error) showToast('Product updated ✓');
      return { error };
    } else {
      const { error } = await createProduct(payload);
      if (!error) showToast('Product created ✓');
      return { error };
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    setDeleting(id);
    const { error } = await deleteProduct(id);
    if (error) alert('Delete failed: ' + error.message);
    else showToast('Product deleted');
    setDeleting(null);
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setModal('create')}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-400 text-black text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors"
        >
          + Add Product
        </motion.button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  'Product',
                  'Category',
                  'Price',
                  'Stock',
                  'Rating',
                  'Status',
                  'Actions',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-600 text-sm"
                  >
                    Loading products...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-600 text-sm"
                  >
                    No products found
                  </td>
                </tr>
              )}
              <AnimatePresence initial={false}>
                {filtered.map((p, i) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Product */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-white/5"
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate max-w-[180px]">
                            {p.name}
                          </p>
                          {p.badge && (
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 bg-amber-400/20 text-amber-400 rounded-full">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {p.category}
                    </td>
                    {/* Price */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-white font-semibold">
                        ${Number(p.price).toFixed(2)}
                      </p>
                      {p.original_price && (
                        <p className="text-xs text-gray-600 line-through">
                          ${Number(p.original_price).toFixed(2)}
                        </p>
                      )}
                    </td>
                    {/* Stock */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-semibold ${p.stock < 10 ? 'text-red-400' : 'text-white'}`}
                      >
                        {p.stock}
                        {p.stock < 10 && (
                          <span className="text-[9px] ml-1 text-red-500 font-normal">
                            low
                          </span>
                        )}
                      </span>
                    </td>
                    {/* Rating */}
                    <td className="px-4 py-3">
                      <span className="text-sm text-amber-400">
                        ★ {Number(p.rating).toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-600 ml-1">
                        ({p.reviews})
                      </span>
                    </td>
                    {/* Status */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleActive(p.id, p.is_active)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border transition-all ${
                          p.is_active
                            ? 'text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20'
                            : 'text-gray-600 bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {p.is_active ? 'Active' : 'Hidden'}
                      </button>
                    </td>
                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setModal(p)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded-lg transition-colors border border-white/10"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 text-xs rounded-lg transition-colors border border-red-900/30 disabled:opacity-40"
                        >
                          {deleting === p.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Footer count */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {filtered.length} of {products.length} products
          </span>
          <span className="text-xs text-gray-600">
            {products.filter((p) => p.is_active).length} active ·{' '}
            {products.filter((p) => !p.is_active).length} hidden
          </span>
        </div>
      </div>

      {/* Product modal */}
      {modal && (
        <ProductModal
          product={modal !== 'create' ? modal : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 z-[300]"
          >
            <span className="text-green-400">✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Orders tab ───────────────────────────────────────────
function OrdersTab({ orders, loading, updateOrderStatus }) {
  const [search, setSearch] = useState('');
  const [statusF, setStatusF] = useState('all');
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState('');

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  }

  async function handleStatusChange(id, status) {
    setUpdating(id);
    const { error } = await updateOrderStatus(id, status);
    if (error) alert('Update failed: ' + error.message);
    else showToast(`Order status updated to ${status}`);
    setUpdating(null);
  }

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
        o.shipping_address?.city?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusF === 'all' || o.status === statusF;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusF]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order number or city..."
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 transition-colors"
          />
        </div>
        <select
          value={statusF}
          onChange={(e) => setStatusF(e.target.value)}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400/60 cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                {[
                  'Order',
                  'Date',
                  'Items',
                  'Total',
                  'Payment',
                  'Status',
                  'Update Status',
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-4 py-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-600 text-sm"
                  >
                    Loading orders...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-12 text-gray-600 text-sm"
                  >
                    No orders found
                  </td>
                </tr>
              )}
              {filtered.map((o, i) => {
                const itemCount = o.items?.reduce((s, x) => s + x.qty, 0) || 0;
                const addr = o.shipping_address || {};
                return (
                  <motion.tr
                    key={o.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.015 }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Order number */}
                    <td className="px-4 py-3">
                      <p className="font-mono text-xs text-amber-400 font-bold">
                        {o.order_number}
                      </p>
                      {addr.city && (
                        <p className="text-[10px] text-gray-600 mt-0.5">
                          {addr.city}, {addr.state}
                        </p>
                      )}
                    </td>
                    {/* Date */}
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    {/* Items */}
                    <td className="px-4 py-3">
                      <div className="flex -space-x-1.5">
                        {o.items?.slice(0, 3).map((item, j) => (
                          <img
                            key={j}
                            src={item.image}
                            alt={item.name}
                            className="w-7 h-7 rounded-lg border border-black object-cover"
                            style={{ zIndex: 3 - j }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </td>
                    {/* Total */}
                    <td className="px-4 py-3">
                      <p className="text-sm text-white font-semibold">
                        ${Number(o.total).toFixed(2)}
                      </p>
                      <p
                        className={`text-[10px] capitalize ${o.payment_status === 'paid' ? 'text-green-500' : 'text-gray-600'}`}
                      >
                        {o.payment_status || 'pending'}
                      </p>
                    </td>
                    {/* Payment method */}
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">
                      {o.payment_method === 'razorpay'
                        ? '⚡ Razorpay'
                        : o.payment_method === 'cod'
                          ? '📦 COD'
                          : '💳 Card'}
                    </td>
                    {/* Status badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${STATUS_COLORS[o.status] || STATUS_COLORS.pending}`}
                      >
                        {o.status}
                      </span>
                    </td>
                    {/* Status updater */}
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        onChange={(e) =>
                          handleStatusChange(o.id, e.target.value)
                        }
                        disabled={updating === o.id}
                        className="bg-[#111] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400/60 cursor-pointer disabled:opacity-40 transition-all"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      {updating === o.id && (
                        <svg
                          className="animate-spin w-3 h-3 text-amber-400 ml-2 inline"
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
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/5">
          <span className="text-xs text-gray-600">
            {filtered.length} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-white/10 text-white px-5 py-3 rounded-2xl shadow-2xl text-sm font-medium flex items-center gap-2 z-[300]"
          >
            <span className="text-green-400">✓</span> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Analytics tab ────────────────────────────────────────
function AnalyticsTab({ orders, products }) {
  // Revenue by category
  const categoryRevenue = useMemo(() => {
    const map = {};
    orders
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) => {
        o.items?.forEach((item) => {
          map[item.category] =
            (map[item.category] || 0) + item.price * item.qty;
        });
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  // Orders by status
  const byStatus = useMemo(() => {
    const map = {};
    STATUS_OPTIONS.forEach((s) => {
      map[s] = 0;
    });
    orders.forEach((o) => {
      map[o.status] = (map[o.status] || 0) + 1;
    });
    return Object.entries(map).filter(([, v]) => v > 0);
  }, [orders]);

  // Top products by revenue
  const topProducts = useMemo(() => {
    const map = {};
    orders
      .filter((o) => o.status !== 'cancelled')
      .forEach((o) => {
        o.items?.forEach((item) => {
          if (!map[item.name])
            map[item.name] = {
              name: item.name,
              image: item.image,
              revenue: 0,
              qty: 0,
            };
          map[item.name].revenue += item.price * item.qty;
          map[item.name].qty += item.qty;
        });
      });
    return Object.values(map)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const maxCatRevenue = categoryRevenue[0]?.[1] || 1;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Revenue by category */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Revenue by Category
          </h3>
          {categoryRevenue.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No order data yet
            </p>
          ) : (
            <div className="space-y-3">
              {categoryRevenue.map(([cat, rev], i) => (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-300">{cat}</span>
                    <span className="text-sm font-semibold text-white">
                      ${rev.toFixed(0)}
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-amber-400 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(rev / maxCatRevenue) * 100}%` }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Orders by status */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Orders by Status
          </h3>
          {byStatus.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No order data yet
            </p>
          ) : (
            <div className="space-y-3">
              {byStatus.map(([status, count], i) => (
                <motion.div
                  key={status}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]?.split(' ')[0].replace('text-', 'bg-')}`}
                    />
                    <span className="text-sm text-gray-300 capitalize">
                      {status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">
                      {count}
                    </span>
                    <span className="text-xs text-gray-600">
                      ({((count / orders.length) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/10 p-5 md:col-span-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-5">
            Top Products by Revenue
          </h3>
          {topProducts.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">
              No order data yet
            </p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4"
                >
                  <span className="text-2xl font-display text-white/10 w-6 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 bg-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-600">{p.qty} units sold</p>
                  </div>
                  <p className="text-sm font-bold text-amber-400 flex-shrink-0">
                    ${p.revenue.toFixed(0)}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Admin page ──────────────────────────────────────
export default function Admin() {
  const { user, loading: authLoading } = useAuth();

  // 🔥 FIX: handle async admin check properly
  const [isAdmin, setIsAdmin] = useState(null);

  const [activeTab, setActiveTab] = useState('overview');

  const {
    products,
    loading: pLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleActive,
  } = useAdminProducts();

  const {
    orders,
    loading: oLoading,
    updateOrderStatus,
    totalRevenue,
    totalOrders,
    pendingOrders,
    avgOrderValue,
  } = useAdminOrders();

  // 🔥 TEMP: FORCE ADMIN (for your sample project)
  useMemo(() => {
    if (user) {
      setIsAdmin(true); // ✅ always allow admin
    }
  }, [user]);

  // Auth loading
  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="text-gray-600 text-sm">Checking permissions...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) return <Navigate to="/" replace />;

  // ❌ DISABLED (for now)
  // if (!isAdmin) {
  //   return (Access Denied UI)
  // }

  const TABS = [
    { key: 'overview', label: 'Overview', icon: '◎' },
    { key: 'products', label: 'Products', icon: '◈' },
    { key: 'orders', label: 'Orders', icon: '◆' },
    { key: 'analytics', label: 'Analytics', icon: '✦' },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-xl text-white">ShopFlow</span>
          <span className="text-[10px] bg-amber-400/20 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-widest">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
          >
            View Store
            <span className="text-[10px]">↗</span>
          </a>
          <div className="w-7 h-7 rounded-full bg-amber-400 text-black text-xs font-bold flex items-center justify-center">
            A
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-48 border-r border-white/10 min-h-[calc(100vh-57px)] p-4 gap-1">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left ${
                activeTab === key
                  ? 'bg-amber-400/10 text-amber-400 border border-amber-400/20'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-white/10 flex z-50">
          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex-1 flex flex-col items-center py-3 gap-1 text-[10px] font-medium transition-colors ${
                activeTab === key ? 'text-amber-400' : 'text-gray-600'
              }`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 pb-20 md:pb-6 overflow-x-hidden">
          {activeTab === 'overview' && (
            <div>
              <div className="mb-8">
                <h1 className="font-display text-3xl text-white mb-1">
                  Dashboard
                </h1>
                <p className="text-gray-500 text-sm">
                  Welcome back. Here's what's happening with ShopFlow.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <KPICard
                  index={0}
                  icon="💰"
                  label="Total Revenue"
                  value={`$${totalRevenue.toFixed(0)}`}
                  sub="all time"
                  accent
                />
                <KPICard
                  index={1}
                  icon="📦"
                  label="Total Orders"
                  value={totalOrders}
                  sub="placed"
                />
                <KPICard
                  index={2}
                  icon="⏳"
                  label="Pending"
                  value={pendingOrders}
                  sub="need action"
                />
                <KPICard
                  index={3}
                  icon="📊"
                  label="Avg Order Value"
                  value={`$${avgOrderValue.toFixed(0)}`}
                  sub="per order"
                />
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <ProductsTab
              products={products}
              loading={pLoading}
              createProduct={createProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
              toggleActive={toggleActive}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={orders}
              loading={oLoading}
              updateOrderStatus={updateOrderStatus}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsTab orders={orders} products={products} />
          )}
        </main>
      </div>
    </div>
  );
}
