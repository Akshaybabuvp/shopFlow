import { motion } from 'framer-motion';

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

export default function OrderCard({ order, onClick, index = 0 }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0;
  const previewItems = order.items?.slice(0, 3) || [];
  const extra = (order.items?.length || 0) - previewItems.length;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full text-left bg-white rounded-3xl p-5 hover:shadow-xl transition-shadow duration-300 border border-gray-100 group"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">
            Order Number
          </p>
          <p className="font-mono text-sm font-bold text-[#111] tracking-wide group-hover:text-amber-600 transition-colors">
            {order.order_number}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span
            className={`inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${cfg.color}`}
          >
            {cfg.label}
          </span>
          <p className="text-lg font-bold text-[#111] mt-2">
            ${Number(order.total).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Product image previews */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-2">
          {previewItems.map((item, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm"
              style={{ zIndex: previewItems.length - i }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {extra > 0 && (
            <div
              className="w-10 h-10 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 shadow-sm"
              style={{ zIndex: 0 }}
            >
              +{extra}
            </div>
          )}
        </div>
        <div className="ml-2">
          <p className="text-sm font-medium text-[#111] line-clamp-1">
            {previewItems[0]?.name}
            {previewItems.length > 1 ? ` & ${itemCount - 1} more` : ''}
          </p>
          <p className="text-xs text-gray-400">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-3">
          {order.tracking_id && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg
                width="10"
                height="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span className="font-mono">{order.tracking_id}</span>
            </div>
          )}
        </div>
        <span className="text-xs font-medium text-gray-400 group-hover:text-amber-600 transition-colors flex items-center gap-1">
          View details
          <span className="group-hover:translate-x-1 transition-transform inline-block">
            →
          </span>
        </span>
      </div>
    </motion.button>
  );
}
