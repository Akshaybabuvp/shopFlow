import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  function updateForm(key, val) {
    setForm((p) => ({ ...p, [key]: val }));
    setError('');
  }

  async function handleSubmit() {
    setError('');
    setLoading(true);

    if (mode === 'signup') {
      if (!form.fullName.trim()) {
        setError('Full name is required');
        setLoading(false);
        return;
      }
      if (!form.email.includes('@')) {
        setError('Enter a valid email');
        setLoading(false);
        return;
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      const { error: err } = await signUp(
        form.email,
        form.password,
        form.fullName,
      );
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setSuccess('Account created! Check your email to confirm your account.');
    } else {
      if (!form.email || !form.password) {
        setError('Email and password are required');
        setLoading(false);
        return;
      }
      const { error: err } = await signIn(form.email, form.password);
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      onClose();
    }
    setLoading(false);
  }

  function switchMode() {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError('');
    setSuccess('');
    setForm({ fullName: '', email: '', password: '', confirmPassword: '' });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 text-gray-300 hover:text-gray-600 transition-colors text-2xl leading-none"
              >
                ×
              </button>

              {/* Logo */}
              <div className="text-center mb-8">
                <span className="font-display text-2xl text-[#111]">
                  ShopFlow
                </span>
                <p className="text-gray-500 text-sm mt-1">
                  {mode === 'signin' ? 'Welcome back' : 'Create your account'}
                </p>
              </div>

              {/* Success message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 text-sm text-green-700 text-center">
                  {success}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-5 text-sm text-red-600 text-center">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Full name (signup only) */}
                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={(e) => updateForm('fullName', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                />

                <AnimatePresence>
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={(e) =>
                          updateForm('confirmPassword', e.target.value)
                        }
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmit}
                  disabled={loading || !!success}
                  className="w-full bg-[#111] text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && (
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
                  {loading
                    ? 'Please wait...'
                    : mode === 'signin'
                      ? 'Sign In'
                      : 'Create Account'}
                </motion.button>
              </div>

              {/* Mode switch */}
              <p className="text-center text-sm text-gray-500 mt-6">
                {mode === 'signin'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  onClick={switchMode}
                  className="text-amber-600 font-semibold hover:text-amber-700 transition-colors"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
