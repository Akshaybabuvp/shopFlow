// src/context/ToastContext.jsx
// Problem 2 fix: global toast context so ANY component can trigger it
import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = useCallback((message) => {
    // Reset first so multiple quick taps each re-trigger animation
    setToast({ show: false, message: '' });
    requestAnimationFrame(() => {
      setToast({ show: true, message });
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((t) => ({ ...t, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast message={toast.message} show={toast.show} onClose={hideToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
