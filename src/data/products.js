// src/data/products.js  — replace entire file contents with this

const BASE_FEATURES = [
  'Premium quality materials',
  'Designed for everyday use',
  'Ethically sourced & manufactured',
  '1-year manufacturer warranty',
];

const BASE_SPECS = [
  { label: 'Weight', value: '320g' },
  { label: 'Dimensions', value: '15 × 8 × 4 cm' },
  { label: 'Material', value: 'Premium grade' },
  { label: 'Warranty', value: '12 months' },
];

export const ALL_PRODUCTS = [
  {
    id: 1,
    name: 'Noise-Cancel Buds Pro',
    category: 'Electronics',
    price: 199.0,
    originalPrice: 249.0,
    badge: 'Sale',
    rating: 4.7,
    reviews: 312,
    image:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    description:
      'Premium wireless earbuds with active noise cancellation and 30hr battery life. Engineered for audiophiles who demand clarity on the go.',
    features: [
      'Active Noise Cancellation (ANC)',
      '30-hour total battery life',
      'IPX5 water resistance',
      'Multipoint Bluetooth 5.3 connection',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Battery', value: '30 hrs (buds) + case' },
      { label: 'Driver', value: '10mm dynamic' },
      { label: 'Connectivity', value: 'Bluetooth 5.3' },
      { label: 'Weight', value: '5.4g per earbud' },
    ],
    colors: ['#1a1a1a', '#f5f0e8', '#3b5998'],
  },
  {
    id: 2,
    name: 'Mechanical Keyboard TKL',
    category: 'Electronics',
    price: 129.0,
    originalPrice: null,
    badge: 'New',
    rating: 4.9,
    reviews: 88,
    image:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    description:
      'Tenkeyless mechanical keyboard with hot-swap switches and per-key RGB. Built for developers and creatives who type for hours.',
    features: [
      'Hot-swappable switch sockets',
      'Per-key RGB backlighting',
      'USB-C detachable cable',
      'PBT double-shot keycaps',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Layout', value: 'TKL (87-key)' },
      { label: 'Switch', value: 'Gateron Red (hot-swap)' },
      { label: 'Backlight', value: 'Per-key RGB' },
      { label: 'Connection', value: 'USB-C wired' },
    ],
    colors: ['#1a1a1a', '#2c2c3e'],
  },
  {
    id: 3,
    name: 'Smart Watch Series X',
    category: 'Electronics',
    price: 349.0,
    originalPrice: 399.0,
    badge: 'Sale',
    rating: 4.6,
    reviews: 204,
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    description:
      'Advanced health tracking, GPS, and 7-day battery in a sleek aluminum case. Your wellness companion for every adventure.',
    features: [
      'Always-on AMOLED display',
      'Built-in GPS + GLONASS',
      'Heart rate & SpO2 monitoring',
      '7-day battery life',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Display', value: '1.4" AMOLED' },
      { label: 'Battery', value: '7 days typical' },
      { label: 'Water resist.', value: '5ATM' },
      { label: 'Strap size', value: '20mm standard' },
    ],
    colors: ['#c0c0c0', '#1a1a1a', '#b87333'],
  },
  {
    id: 4,
    name: 'Portable SSD 1TB',
    category: 'Electronics',
    price: 89.0,
    originalPrice: null,
    badge: 'Bestseller',
    rating: 4.8,
    reviews: 540,
    image:
      'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&auto=format&fit=crop&q=80',
    description:
      '1TB pocket-sized SSD with USB-C and lightning-fast read speeds up to 1050MB/s. Fits in your palm, performs like a pro.',
    features: [
      'Read up to 1050 MB/s',
      'Write up to 1000 MB/s',
      'USB-C & USB-A compatible',
      'Shock & drop resistant',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Capacity', value: '1TB' },
      { label: 'Read speed', value: '1050 MB/s' },
      { label: 'Interface', value: 'USB 3.2 Gen 2' },
      { label: 'Weight', value: '47g' },
    ],
    colors: ['#1a1a1a', '#0057b7'],
  },
  {
    id: 5,
    name: 'Merino Crewneck',
    category: 'Fashion',
    price: 145.0,
    originalPrice: null,
    badge: 'New',
    rating: 4.9,
    reviews: 88,
    image:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    description:
      'Superfine merino wool crewneck. Ethically sourced, naturally temperature-regulating, and beautifully soft against the skin.',
    features: [
      '100% superfine merino wool',
      'Naturally temperature regulating',
      'Machine washable (cold)',
      'Anti-odour & moisture-wicking',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Material', value: '100% Merino Wool' },
      { label: 'Fit', value: 'Regular' },
      { label: 'Care', value: 'Machine wash cold' },
      { label: 'Origin', value: 'Made in Portugal' },
    ],
    colors: ['#f5f0e8', '#1a1a1a', '#8b7355', '#2c4a3e'],
  },
  {
    id: 6,
    name: 'Slim Chino Trousers',
    category: 'Fashion',
    price: 79.0,
    originalPrice: 99.0,
    badge: 'Sale',
    rating: 4.5,
    reviews: 162,
    image:
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=80',
    description:
      'Tailored slim-fit chinos in Japanese stretch cotton. Available in 6 colours, perfect from desk to dinner.',
    features: [
      'Japanese stretch cotton blend',
      'Slim tapered fit',
      'YKK zip fly',
      'Two rear welt pockets',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Material', value: '97% Cotton, 3% Elastane' },
      { label: 'Fit', value: 'Slim tapered' },
      { label: 'Rise', value: 'Mid-rise' },
      { label: 'Care', value: 'Machine wash 30°C' },
    ],
    colors: ['#c8b89a', '#1a1a1a', '#4a6741', '#4a5568'],
  },
  {
    id: 7,
    name: 'Leather Chelsea Boots',
    category: 'Fashion',
    price: 220.0,
    originalPrice: null,
    badge: null,
    rating: 4.8,
    reviews: 97,
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    description:
      'Full-grain leather Chelsea boots with elastic side panels and leather sole. Hand-finished in Spain for a lifetime of wear.',
    features: [
      'Full-grain leather upper',
      'Leather sole with rubber heel',
      'Elastic side panels',
      'Hand-finished in Spain',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Upper', value: 'Full-grain leather' },
      { label: 'Sole', value: 'Leather + rubber heel' },
      { label: 'Origin', value: 'Made in Spain' },
      { label: 'Last', value: 'Round toe' },
    ],
    colors: ['#3d2b1f', '#1a1a1a'],
  },
  {
    id: 8,
    name: 'Structured Tote Bag',
    category: 'Fashion',
    price: 95.0,
    originalPrice: null,
    badge: 'Bestseller',
    rating: 4.7,
    reviews: 211,
    image:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80',
    description:
      'Vegan leather structured tote with laptop compartment and magnetic closure. The bag that goes everywhere you do.',
    features: [
      'Padded 15" laptop compartment',
      'Magnetic top closure',
      'Interior zip pocket',
      'Adjustable crossbody strap included',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Material', value: 'Vegan leather (PU)' },
      { label: 'Dimensions', value: '38 × 28 × 14 cm' },
      { label: 'Laptop fit', value: 'Up to 15"' },
      { label: 'Weight', value: '620g' },
    ],
    colors: ['#1a1a1a', '#f5f0e8', '#8b7355'],
  },
  {
    id: 9,
    name: 'Arc Desk Lamp',
    category: 'Home & Living',
    price: 89.99,
    originalPrice: 119.99,
    badge: 'Sale',
    rating: 4.8,
    reviews: 124,
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    description:
      'Minimalist adjustable arc lamp with warm-white LED and touch dimmer. Illuminate your workspace in style.',
    features: [
      'Touch-sensitive dimmer (3 levels)',
      'Warm white 3000K LED',
      'Flexible gooseneck arm',
      'USB-A charging port on base',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Bulb', value: 'LED 12W integrated' },
      { label: 'Colour temp.', value: '3000K warm white' },
      { label: 'Arm reach', value: '45cm' },
      { label: 'Base', value: 'Weighted steel' },
    ],
    colors: ['#f5f0e8', '#1a1a1a', '#b87333'],
  },
  {
    id: 10,
    name: 'Ceramic Pour-Over Set',
    category: 'Home & Living',
    price: 48.0,
    originalPrice: null,
    badge: 'Bestseller',
    rating: 5.0,
    reviews: 203,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80',
    description:
      'Hand-thrown ceramic pour-over dripper and server set. Dishwasher safe and beautifully imperfect by design.',
    features: [
      'Hand-thrown stoneware ceramic',
      'Includes dripper + server + lid',
      'Dishwasher & microwave safe',
      'Holds 600ml brewed coffee',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Capacity', value: '600ml server' },
      { label: 'Filter', value: 'Size 2 paper/cloth' },
      { label: 'Material', value: 'Stoneware ceramic' },
      { label: 'Care', value: 'Dishwasher safe' },
    ],
    colors: ['#f5f0e8', '#8b7355', '#2c4a3e', '#1a1a1a'],
  },
  {
    id: 11,
    name: 'Linen Throw Blanket',
    category: 'Home & Living',
    price: 65.0,
    originalPrice: null,
    badge: 'New',
    rating: 4.6,
    reviews: 78,
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80',
    description:
      'Stone-washed 100% linen throw in earthy tones. Soft, breathable, and gets better with every wash.',
    features: [
      '100% European linen',
      'Stone-washed for softness',
      'OEKO-TEX certified fabric',
      'Decorative fringe trim',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Size', value: '130 × 170 cm' },
      { label: 'Material', value: '100% Linen' },
      { label: 'Weight', value: '380 GSM' },
      { label: 'Care', value: 'Machine wash 40°C' },
    ],
    colors: ['#c8b89a', '#4a6741', '#8b7355', '#f5f0e8'],
  },
  {
    id: 12,
    name: 'Scented Candle Set',
    category: 'Home & Living',
    price: 38.0,
    originalPrice: null,
    badge: null,
    rating: 4.7,
    reviews: 145,
    image:
      'https://images.unsplash.com/photo-1602607144496-9e51ea06e4e5?w=800&auto=format&fit=crop&q=80',
    description:
      'Set of 3 soy-wax candles. Scents: cedar & smoke, vanilla & amber, sea salt & driftwood.',
    features: [
      '100% soy wax blend',
      '3 complementary scents',
      'Cotton braided wick',
      '45-hour burn time per candle',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Contents', value: '3 × 200g candles' },
      { label: 'Burn time', value: '45 hrs each' },
      { label: 'Wax', value: '100% soy' },
      { label: 'Vessel', value: 'Reusable glass jar' },
    ],
    colors: ['#f5f0e8', '#1a1a1a'],
  },
  {
    id: 13,
    name: 'Vitamin C Serum',
    category: 'Beauty',
    price: 42.0,
    originalPrice: 55.0,
    badge: 'Sale',
    rating: 4.8,
    reviews: 389,
    image:
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=800&auto=format&fit=crop&q=80',
    description:
      '15% stabilised Vitamin C + hyaluronic acid. Brightening, anti-aging, and suitable for all skin types.',
    features: [
      '15% L-ascorbic acid (stabilised)',
      'Hyaluronic acid for hydration',
      'Fragrance-free formula',
      'Dermatologist tested & approved',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Volume', value: '30ml' },
      { label: 'Vitamin C', value: '15% L-ascorbic acid' },
      { label: 'Skin type', value: 'All skin types' },
      { label: 'Shelf life', value: '12 months opened' },
    ],
    colors: ['#f5f0e8'],
  },
  {
    id: 14,
    name: 'Bamboo Brush Set',
    category: 'Beauty',
    price: 34.0,
    originalPrice: null,
    badge: 'New',
    rating: 4.5,
    reviews: 62,
    image:
      'https://images.unsplash.com/photo-1526758097130-bab247274f58?w=800&auto=format&fit=crop&q=80',
    description:
      '12-piece vegan makeup brush set with sustainable bamboo handles. Soft synthetic bristles for flawless application.',
    features: [
      '12 essential brush shapes',
      'FSC-certified bamboo handles',
      '100% vegan synthetic bristles',
      'Includes roll-up travel pouch',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Pieces', value: '12 brushes + pouch' },
      { label: 'Handle', value: 'Bamboo' },
      { label: 'Bristles', value: 'Vegan synthetic' },
      { label: 'Care', value: 'Hand wash & air dry' },
    ],
    colors: ['#8b7355'],
  },
  {
    id: 15,
    name: 'Yoga Mat Pro',
    category: 'Sports',
    price: 72.0,
    originalPrice: null,
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 417,
    image:
      'https://images.unsplash.com/photo-1601925228880-e60d5dbb5c4d?w=800&auto=format&fit=crop&q=80',
    description:
      '6mm natural rubber yoga mat with alignment lines and carry strap. Superior grip — even through the sweatiest sessions.',
    features: [
      '6mm natural rubber base',
      'Microfibre top layer',
      'Alignment guide lines printed',
      'Non-slip bottom surface',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Size', value: '183 × 68 cm' },
      { label: 'Thickness', value: '6mm' },
      { label: 'Material', value: 'Natural rubber + microfibre' },
      { label: 'Weight', value: '2.4kg' },
    ],
    colors: ['#2c4a3e', '#1a1a1a', '#8b4a4a', '#4a5568'],
  },
  {
    id: 16,
    name: 'Adjustable Dumbbells',
    category: 'Sports',
    price: 299.0,
    originalPrice: 349.0,
    badge: 'Sale',
    rating: 4.7,
    reviews: 183,
    image:
      'https://images.unsplash.com/photo-1526401485004-46910ecc8e2e?w=800&auto=format&fit=crop&q=80',
    description:
      'Select-a-weight dumbbells from 5–52.5 lbs. Replaces 15 pairs of weights in a compact footprint.',
    features: [
      'Adjusts from 5 to 52.5 lbs',
      'Dial-select weight mechanism',
      'Includes storage tray',
      'Replaces 15 sets of weights',
      ...BASE_FEATURES,
    ],
    specs: [
      { label: 'Weight range', value: '5–52.5 lbs (15 settings)' },
      { label: 'Length', value: '40.6cm at max weight' },
      { label: 'Material', value: 'Steel plates + ABS housing' },
      { label: 'Warranty', value: '2 years' },
    ],
    colors: ['#1a1a1a'],
  },
];

export const CATEGORIES_LIST = [
  'All',
  'Electronics',
  'Fashion',
  'Home & Living',
  'Beauty',
  'Sports',
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];
