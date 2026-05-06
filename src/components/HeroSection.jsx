import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
});

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0f0f0f]">
      {/* Ambient orb background */}
      <div
        aria-hidden="true"
        className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, #e2b04a 0%, #e07060 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #5ab4e0 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Decorative grid lines */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
          backgroundSize: '80px 80px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full grid md:grid-cols-2 gap-12 items-center py-24">
        {/* Left: Text */}
        <div>
          <motion.div {...fadeUp(0.1)}>
            <span className="inline-block text-amber-400 text-xs font-semibold tracking-[0.25em] uppercase mb-6 border border-amber-400/30 px-3 py-1 rounded-full">
              New Season Arrivals
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp(0.2)}
            className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-[0.95] text-white mb-6"
          >
            Shop the <span className="italic text-amber-400">Difference</span>
            <br />
            Feel the <span className="italic">Quality</span>
          </motion.h1>

          <motion.p
            {...fadeUp(0.35)}
            className="text-gray-400 text-lg leading-relaxed max-w-md mb-10"
          >
            Thoughtfully sourced. Beautifully made. Every product in our
            collection is chosen for people who care about what they bring into
            their lives.
          </motion.p>

          <motion.div {...fadeUp(0.45)} className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-amber-400 text-black text-sm font-semibold rounded-full hover:bg-amber-300 transition-colors duration-200 tracking-wide"
            >
              Shop Now
            </Link>
            <Link
              to="/collections"
              className="px-8 py-3.5 border border-white/20 text-white text-sm font-medium rounded-full hover:border-white/50 hover:bg-white/5 transition-all duration-200 tracking-wide"
            >
              View Collections
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            {...fadeUp(0.55)}
            className="flex gap-8 mt-14 pt-8 border-t border-white/10"
          >
            {[
              { value: '12K+', label: 'Products' },
              { value: '98%', label: 'Satisfaction' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="text-xs text-gray-500 tracking-wide mt-0.5">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: Hero visual — stacked product cards */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="hidden md:flex items-center justify-center relative"
        >
          {/* Card stack */}
          <div className="relative w-full max-w-sm">
            {/* Back card */}
            <div
              className="absolute top-6 left-6 right-0 h-80 rounded-3xl"
              style={{
                background: 'linear-gradient(135deg, #1e1e2e, #2a2a1a)',
              }}
            />
            {/* Front card */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&auto=format&fit=crop&q=85"
                alt="Featured collection"
                className="w-full h-80 object-cover"
              />
              {/* Overlay badge */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-white text-sm font-semibold">
                      Summer Collection
                    </div>
                    <div className="text-gray-400 text-xs mt-0.5">
                      152 new items
                    </div>
                  </div>
                  <Link
                    to="/products"
                    className="bg-amber-400 text-black text-xs font-bold px-4 py-2 rounded-full hover:bg-amber-300 transition-colors"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating rating pill */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="absolute -right-6 top-10 bg-white text-black rounded-2xl px-4 py-2.5 shadow-xl text-sm font-semibold flex items-center gap-2"
            >
              <span className="text-amber-500">★</span> 4.9 Rating
            </motion.div>

            {/* Floating order pill */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 3.5,
                ease: 'easeInOut',
                delay: 0.5,
              }}
              className="absolute -left-4 bottom-10 bg-[#1a1a1a] border border-white/10 text-white rounded-2xl px-4 py-2.5 shadow-xl text-xs flex items-center gap-2"
            >
              <span className="text-green-400 text-base">●</span> 1,240 orders
              today
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Bottom scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-600"
      >
        <span className="text-[10px] tracking-widest uppercase">Scroll</span>
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path
            d="M6 1v14M1 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </section>
  );
}
