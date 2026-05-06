/**
 * Dynamically loads the Razorpay checkout script.
 * Returns a promise that resolves to true when ready.
 */
export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Generates a unique order number for ShopFlow.
 * Format: SF-YYYYMMDD-XXXXXX
 */
export function generateOrderNumber() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `SF-${date}-${rand}`;
}

/**
 * Generates a tracking ID.
 * Format: TRK-XXXXXXXXXX
 */
export function generateTrackingId() {
  return 'TRK-' + Math.random().toString(36).substr(2, 10).toUpperCase();
}

/**
 * Converts USD to INR paise (Razorpay uses smallest currency unit).
 * Uses a fixed rate for demo: 1 USD = 83 INR.
 */
export function toRazorpayAmount(usdAmount) {
  const INR_RATE = 83;
  const inr = usdAmount * INR_RATE;
  return Math.round(inr * 100); // paise
}
