// Reusable skeleton shimmer components

function Shimmer({ className }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={{
        background:
          'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden">
      <Shimmer className="aspect-[4/3] rounded-none" />
      <div className="p-4 space-y-2.5">
        <Shimmer className="h-3 w-16 rounded-full" />
        <Shimmer className="h-4 w-3/4 rounded-lg" />
        <Shimmer className="h-3 w-24 rounded-full" />
        <Shimmer className="h-5 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-12">
        <Shimmer className="aspect-square rounded-3xl" />
        <div className="space-y-4 pt-2">
          <Shimmer className="h-3 w-24 rounded-full" />
          <Shimmer className="h-10 w-4/5 rounded-xl" />
          <Shimmer className="h-4 w-40 rounded-full" />
          <Shimmer className="h-8 w-32 rounded-xl mt-4" />
          <Shimmer className="h-20 w-full rounded-xl mt-4" />
          <Shimmer className="h-12 w-full rounded-2xl mt-6" />
          <Shimmer className="h-12 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function FeaturedSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Global shimmer keyframes — inject once
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
`;
document.head.appendChild(style);
