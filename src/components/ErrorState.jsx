export default function ErrorState({
  message = 'Something went wrong',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
      <div className="text-5xl mb-4">⚠️</div>
      <h3 className="font-display text-2xl text-[#111] mb-2">Failed to load</h3>
      <p className="text-gray-500 text-sm mb-6 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-[#111] text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
