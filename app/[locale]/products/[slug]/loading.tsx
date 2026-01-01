export default function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
        {/* Product Info Skeleton */}
        <div className="space-y-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
          <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

