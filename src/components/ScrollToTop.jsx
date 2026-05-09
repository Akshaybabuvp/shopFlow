// src/components/ScrollToTop.jsx
// Automatically scrolls to top on every route change — fixes Problem 1 & 4
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Instant scroll — no animation flash, no footer blink
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}
