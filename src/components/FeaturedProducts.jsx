import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFeaturedProducts } from '../hooks/useFeaturedProducts';
import ProductCard from './ProductCard';
import { FeaturedSkeleton } from './Skeleton';
import ErrorState from './ErrorState';

export default function FeaturedProducts() {
  const { products, loading, error } = useFeaturedProducts(4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-amber-600 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
              Handpicked for You
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#111]">
              Featured <span className="italic">Products</span>
            </h2>
          </div>
          <Link
            to="/products"
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#111] transition-colors group"
          >
            View all
            <span className="group-hover:translate-x-1 transition-transform inline-block">
              →
            </span>
          </Link>
        </div>

        {loading && <FeaturedSkeleton count={4} />}
        {error && <ErrorState message={error} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProductCard product={product} view="grid" />
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center md:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-8 py-3 border border-[#111] text-[#111] text-sm font-medium rounded-full hover:bg-[#111] hover:text-white transition-all duration-200"
          >
            View all products →
          </Link>
        </div>
      </div>
    </section>
  );
}
