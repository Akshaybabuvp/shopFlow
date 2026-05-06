import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct } from '../hooks/useProduct';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import { ProductDetailSkeleton } from '../components/Skeleton';
import ErrorState from '../components/ErrorState';

// ... (keep BADGE_STYLES and StarRating unchanged)

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, related, loading, error } = useProduct(Number(id));

  const [qty, setQty] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeTab, setActiveTab] = useState('features');
  const [toastVisible, setToastVisible] = useState(false);
  const { addItem } = useCart();

  // ✅ FIX: move state update to useEffect
  useEffect(() => {
    if (product && product.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, qty, selectedColor);
    setToastVisible(true);
  }

  if (loading) return <ProductDetailSkeleton />;
  if (error) return <ErrorState message={error} />;

  if (!product)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf9f6] gap-4">
        <h2 className="font-display text-3xl text-[#111]">Product not found</h2>
        <Link to="/products" className="text-amber-600 hover:underline text-sm">
          ← Back to products
        </Link>
      </div>
    );

  return (
    <div className="bg-[#faf9f6] min-h-screen">
      {/* Product Section */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        {/* Image */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-[400px] object-cover rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Details */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-display">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="text-2xl font-semibold text-amber-600">
            ₹{product.price}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="flex gap-2">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color ? 'border-black' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border"
            >
              -
            </button>
            <span>{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 border"
            >
              +
            </button>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-2 rounded-lg"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Related Products */}
      {related?.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-10">
          <h2 className="text-2xl font-display mb-6">Related Products</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      <Toast
        visible={toastVisible}
        message="Added to cart!"
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
}
