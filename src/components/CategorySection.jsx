import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/categories';

export default function CategorySection() {
  return (
    <section className="py-24 bg-[#faf9f6]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Browse by Category
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#111]">
              Find Your <span className="italic">World</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#111] transition-colors group"
          >
            All categories
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </Link>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{
                duration: 0.5,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link
                to={`/products?category=${cat.id}`}
                className="group block rounded-2xl overflow-hidden relative h-36"
                style={{ background: cat.bg }}
              >
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${cat.accent}, transparent 70%)`,
                  }}
                />

                {/* Emoji / icon */}
                <div
                  className="absolute top-4 left-4 text-2xl transition-transform duration-300 group-hover:-translate-y-1"
                  style={{ color: cat.accent }}
                >
                  {cat.emoji}
                </div>

                {/* Text */}
                <div className="absolute bottom-4 left-4">
                  <div className="text-white text-sm font-semibold leading-tight">
                    {cat.label}
                  </div>
                  <div className="text-gray-500 text-xs mt-0.5 group-hover:text-gray-400 transition-colors">
                    {cat.description}
                  </div>
                </div>

                {/* Arrow */}
                <div
                  className="absolute top-4 right-4 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2"
                  style={{ color: cat.accent }}
                >
                  →
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
