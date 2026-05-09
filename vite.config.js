// vite.config.js
// Problem 3 fix: historyApiFallback ensures refreshing /cart or /checkout
// doesn't return 404 — the server always serves index.html
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Dev server: always serve index.html for any route
    historyApiFallback: true,
  },
  preview: {
    // Preview server (vite preview): same fix
    historyApiFallback: true,
  },
});
