// PostsSkeleton.jsx
export function PostsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Multiple skeleton posts */}
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-2xl bg-white p-6 shadow-sm"
        >
          {/* Header skeleton */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/6"></div>
            </div>
          </div>

          {/* Content skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          {/* Actions skeleton */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
