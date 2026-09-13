export default function CatalogLoading() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      {/* Header Skeleton */}
      <div className="border-b border-stone-200/80 bg-[#FAF8F5] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-3 animate-pulse">
          <div className="h-3 w-28 bg-stone-200 rounded-md"></div>
          <div className="h-8 w-64 bg-stone-300 rounded-lg"></div>
          <div className="h-4 w-96 max-w-full bg-stone-200 rounded-md"></div>
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full flex-1">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-stone-200 bg-white p-3 space-y-3 overflow-hidden shadow-2xs"
            >
              <div className="aspect-[3/4] w-full rounded-xl bg-stone-200/80"></div>
              <div className="space-y-1.5 pt-1">
                <div className="h-2.5 w-16 bg-stone-200 rounded-md"></div>
                <div className="h-4 w-40 max-w-full bg-stone-300 rounded-md"></div>
                <div className="h-4 w-24 bg-stone-200 rounded-md pt-1"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
