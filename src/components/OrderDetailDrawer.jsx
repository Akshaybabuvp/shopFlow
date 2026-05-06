import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import TrackingTimeline from './TrackingTimeline';

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-blue-600   bg-blue-50   border-blue-200',
  },
  processing: {
    label: 'Processing',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  },
  delivered: {
    label: 'Delivered',
    color: 'text-green-600  bg-green-50  border-green-200',
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600    bg-red-50    border-red-200',
  },
};

export default function OrderDetailDrawer({ order, onClose }) {
  if (!order) return null;

  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const addr = order.shipping_address || {};
  const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0;

  return (
    <AnimatePresence>
      {order && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#faf9f6] z-[101] overflow-y-auto shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-[#111] px-6 py-5 flex items-center justify-between z-10">
              <div>
                <p className="text-amber-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-0.5">
                  Order Details
                </p>
                <p className="font-mono text-white text-sm font-bold">
                  {order.order_number}
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center text-white text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full border ${cfg.color}`}
                >
                  {cfg.label}
                </span>

                <span className="text-xs text-gray-400">
                  {new Date(order.created_at).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Timeline */}
              <TrackingTimeline
                status={order.status}
                trackingId={order.tracking_id}
                createdAt={order.created_at}
              />

              {/* Items */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Items ({itemCount})
                </h3>

                <div className="space-y-4">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <Link
                        to={`/products/${item.id}`}
                        onClick={onClose}
                        className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-100 group"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.id}`}
                          onClick={onClose}
                          className="text-sm font-medium text-[#111] hover:text-amber-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>

                        <p className="text-xs text-gray-400">{item.category}</p>

                        {item.color && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-gray-200 inline-block"
                              style={{ background: item.color }}
                            />
                            <span className="text-[10px] text-gray-400">
                              Colour
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-semibold text-[#111]">
                          ${(item.price * item.qty).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Ship To
                </h3>

                <p className="text-sm text-[#111] font-medium">
                  {addr.address}
                  {addr.apartment ? `, ${addr.apartment}` : ''}
                </p>

                <p className="text-sm text-gray-500">
                  {addr.city}, {addr.state} – {addr.pincode}
                </p>

                <p className="text-sm text-gray-500">{addr.country}</p>
              </div>

              {/* Payment */}
              <div className="bg-white rounded-3xl p-5 border border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                  Payment
                </h3>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>${Number(order.subtotal).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span
                      className={order.shipping === 0 ? 'text-green-600' : ''}
                    >
                      {order.shipping === 0
                        ? 'Free'
                        : `$${Number(order.shipping).toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-500">
                    <span>Tax</span>
                    <span>${Number(order.tax).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between font-bold text-[#111] border-t border-gray-100 pt-2">
                    <span>Total</span>
                    <span>${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Method</span>
                    <span className="capitalize font-medium">
                      {order.payment_method === 'razorpay'
                        ? '⚡ Razorpay'
                        : order.payment_method === 'cod'
                          ? '📦 Cash on Delivery'
                          : '💳 Card'}
                    </span>
                  </div>

                  {order.payment_id && (
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Payment ID</span>
                      <span className="font-mono text-green-600 text-[10px]">
                        {order.payment_id}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Payment Status</span>
                    <span
                      className={`font-medium capitalize ${
                        order.payment_status === 'paid'
                          ? 'text-green-600'
                          : order.payment_status === 'failed'
                            ? 'text-red-500'
                            : 'text-yellow-600'
                      }`}
                    >
                      {order.payment_status || 'pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Help */}
              <div className="bg-[#111] rounded-3xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-semibold mb-0.5">
                    Need help?
                  </p>
                  <p className="text-gray-500 text-xs">
                    Contact our support team
                  </p>
                </div>

                <a
                  href="mailto:support@shopflow.com"
                  className="px-4 py-2 bg-amber-400 text-black text-xs font-bold rounded-full hover:bg-amber-300 transition-colors"
                >
                  Get Help →
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
