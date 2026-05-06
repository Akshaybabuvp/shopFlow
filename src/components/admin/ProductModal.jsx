import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
  'Books',
];
const BADGES = ['', 'Sale', 'New', 'Bestseller'];

const EMPTY_FORM = {
  name: '',
  category: 'Electronics',
  price: '',
  original_price: '',
  badge: '',
  rating: '4.5',
  reviews: '0',
  image: '',
  description: '',
  features: '',
  colors: '',
  stock: '100',
  is_active: true,
};

export default function ProductModal({ product, onClose, onSave }) {
  const isEdit = !!product;
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        category: product.category || 'Electronics',
        price: product.price?.toString() || '',
        original_price: product.original_price?.toString() || '',
        badge: product.badge || '',
        rating: product.rating?.toString() || '4.5',
        reviews: product.reviews?.toString() || '0',
        image: product.image || '',
        description: product.description || '',
        features: Array.isArray(product.features)
          ? product.features.join('\n')
          : '',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : '',
        stock: product.stock?.toString() || '100',
        is_active: product.is_active ?? true,
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [product]);

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    setError('');
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError('Enter a valid price');
      return;
    }
    if (!form.image.trim()) {
      setError('Image URL is required');
      return;
    }
    if (!form.category) {
      setError('Select a category');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      badge: form.badge || null,
      rating: Number(form.rating) || 4.5,
      reviews: Number(form.reviews) || 0,
      image: form.image.trim(),
      description: form.description.trim(),
      features: form.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      colors: form.colors
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean),
      stock: Number(form.stock) || 100,
      is_active: form.is_active,
      specs: product?.specs || [],
    };

    const { error: err } = await onSave(payload);
    setSaving(false);
    if (err) setError(err.message);
    else onClose();
  }

  const inputCls =
    'w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 transition-colors';
  const labelCls =
    'block text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-1.5';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed inset-0 z-[201] flex items-center justify-center p-4"
      >
        <div className="bg-[#111] rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10">
          {/* Modal header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h2 className="font-display text-xl text-white">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors text-lg"
            >
              ×
            </button>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 p-6">
            {/* Image preview */}
            {form.image && (
              <div className="mb-5 rounded-2xl overflow-hidden h-36 bg-[#1a1a1a]">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Product Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  placeholder="e.g. Merino Crewneck"
                  className={inputCls}
                />
              </div>

              {/* Category */}
              <div>
                <label className={labelCls}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className={inputCls + ' cursor-pointer'}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className={labelCls}>Badge</label>
                <select
                  value={form.badge}
                  onChange={(e) => update('badge', e.target.value)}
                  className={inputCls + ' cursor-pointer'}
                >
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b || 'None'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className={labelCls}>Price (USD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => update('price', e.target.value)}
                  placeholder="99.00"
                  className={inputCls}
                />
              </div>

              {/* Original price */}
              <div>
                <label className={labelCls}>Original Price (optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.original_price}
                  onChange={(e) => update('original_price', e.target.value)}
                  placeholder="129.00"
                  className={inputCls}
                />
              </div>

              {/* Rating */}
              <div>
                <label className={labelCls}>Rating (0–5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={form.rating}
                  onChange={(e) => update('rating', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Reviews */}
              <div>
                <label className={labelCls}>Review Count</label>
                <input
                  type="number"
                  min="0"
                  value={form.reviews}
                  onChange={(e) => update('reviews', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Stock */}
              <div>
                <label className={labelCls}>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => update('stock', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3 pt-5">
                <label className="relative cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => update('is_active', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-5 rounded-full transition-colors duration-200 ${form.is_active ? 'bg-amber-400' : 'bg-white/10'}`}
                  />
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_active ? 'translate-x-5' : ''}`}
                  />
                </label>
                <span className="text-sm text-gray-400">
                  {form.is_active ? 'Active (visible)' : 'Hidden'}
                </span>
              </div>

              {/* Image URL */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Image URL *</label>
                <input
                  value={form.image}
                  onChange={(e) => update('image', e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className={inputCls}
                />
              </div>

              {/* Description */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={3}
                  placeholder="Product description..."
                  className={inputCls + ' resize-none'}
                />
              </div>

              {/* Features */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Key Features (one per line)</label>
                <textarea
                  value={form.features}
                  onChange={(e) => update('features', e.target.value)}
                  rows={4}
                  placeholder={
                    'Premium quality materials\nEthically sourced\n1-year warranty'
                  }
                  className={inputCls + ' resize-none font-mono text-xs'}
                />
              </div>

              {/* Colors */}
              <div className="sm:col-span-2">
                <label className={labelCls}>
                  Colour Hex Codes (comma separated)
                </label>
                <input
                  value={form.colors}
                  onChange={(e) => update('colors', e.target.value)}
                  placeholder="#1a1a1a, #f5f0e8, #8b7355"
                  className={inputCls + ' font-mono'}
                />
                {form.colors && (
                  <div className="flex gap-2 mt-2">
                    {form.colors
                      .split(',')
                      .map((c) => c.trim())
                      .filter((c) => c.match(/^#[0-9a-f]{3,6}$/i))
                      .map((c) => (
                        <span
                          key={c}
                          className="w-6 h-6 rounded-full border border-white/20 shadow"
                          style={{ background: c }}
                          title={c}
                        />
                      ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-red-900/20 border border-red-800/30 text-red-400 text-sm rounded-xl px-4 py-3"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Modal footer */}
          <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 text-sm text-gray-400 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            >
              Cancel
            </button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-amber-400 text-black text-sm font-bold rounded-xl hover:bg-amber-300 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {saving && (
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
              )}
              {saving
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Create Product'}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
