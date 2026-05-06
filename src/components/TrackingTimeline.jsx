import { motion } from 'framer-motion';

const STATUSES = [
  {
    key: 'pending',
    label: 'Order Placed',
    sub: 'We received your order',
    icon: '◎',
  },
  {
    key: 'confirmed',
    label: 'Confirmed',
    sub: 'Payment verified',
    icon: '✦',
  },
  {
    key: 'processing',
    label: 'Processing',
    sub: 'Your items are being packed',
    icon: '◈',
  },
  {
    key: 'shipped',
    label: 'Shipped',
    sub: 'On its way to you',
    icon: '◆',
  },
  {
    key: 'delivered',
    label: 'Delivered',
    sub: 'Enjoy your order!',
    icon: '✓',
  },
];

const STATUS_ORDER = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
];

function getStatusIndex(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

export default function TrackingTimeline({ status, trackingId, createdAt }) {
  const currentIndex = getStatusIndex(status);
  const isCancelled = status === 'cancelled';

  return (
    <div className="bg-[#0f0f0f] rounded-3xl p-6 text-white">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-amber-400 text-[10px] font-semibold tracking-[0.2em] uppercase mb-1">
            Live Tracking
          </p>
          <h3 className="font-display text-xl text-white">
            {isCancelled ? 'Order Cancelled' : STATUSES[currentIndex]?.label}
          </h3>
        </div>
        {trackingId && (
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              Tracking ID
            </p>
            <p className="font-mono text-xs text-amber-400">{trackingId}</p>
          </div>
        )}
      </div>

      {isCancelled ? (
        <div className="flex items-center gap-3 bg-red-900/20 border border-red-800/30 rounded-2xl p-4">
          <span className="text-red-400 text-2xl">✕</span>
          <div>
            <p className="text-red-400 font-medium text-sm">
              This order was cancelled.
            </p>
            <p className="text-red-700 text-xs mt-0.5">
              Payment was refunded (if charged).
            </p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-white/5 rounded-full" />

          {/* Progress fill */}
          <motion.div
            className="absolute left-[15px] top-4 w-[2px] rounded-full bg-gradient-to-b from-amber-400 to-amber-600"
            initial={{ height: 0 }}
            animate={{
              height: `${(currentIndex / (STATUSES.length - 1)) * 100}%`,
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />

          <div className="space-y-6 relative">
            {STATUSES.map((s, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              const future = i > currentIndex;

              return (
                <motion.div
                  key={s.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  {/* Node */}
                  <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {active && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-amber-400/20"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-500
                        ${
                          done
                            ? 'bg-amber-400 border-amber-400 text-black'
                            : active
                              ? 'bg-[#111] border-amber-400 text-amber-400'
                              : 'bg-[#111] border-white/10 text-white/20'
                        }`}
                    >
                      {done ? '✓' : s.icon}
                    </div>
                  </div>

                  {/* Label */}
                  <div className="pt-1">
                    <p
                      className={`text-sm font-semibold transition-colors duration-300 ${future ? 'text-white/20' : active ? 'text-white' : 'text-white/60'}`}
                    >
                      {s.label}
                    </p>
                    <p
                      className={`text-xs mt-0.5 transition-colors duration-300 ${future ? 'text-white/10' : active ? 'text-amber-400' : 'text-white/30'}`}
                    >
                      {active ? `In progress — ${s.sub}` : done ? s.sub : s.sub}
                    </p>
                  </div>

                  {/* Active pulse label */}
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-auto flex-shrink-0"
                    >
                      <span className="text-[10px] bg-amber-400/20 text-amber-400 border border-amber-400/30 px-2.5 py-1 rounded-full font-semibold uppercase tracking-wide">
                        Current
                      </span>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Estimated delivery */}
      {!isCancelled && status !== 'delivered' && createdAt && (
        <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              Est. Delivery
            </p>
            <p className="text-sm text-white font-medium">
              {new Date(
                new Date(createdAt).getTime() + 7 * 24 * 60 * 60 * 1000,
              ).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
              Ordered
            </p>
            <p className="text-sm text-white font-medium">
              {new Date(createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      )}

      {status === 'delivered' && (
        <div className="mt-5 bg-green-900/20 border border-green-800/30 rounded-2xl p-3 flex items-center gap-2">
          <span className="text-green-400">✓</span>
          <span className="text-green-400 text-sm font-medium">
            Delivered successfully
          </span>
        </div>
      )}
    </div>
  );
}
