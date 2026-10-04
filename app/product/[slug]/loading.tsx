const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-charcoal/10 ${className}`} />
);

export default function ProductLoading() {
  return (
    <div className="alt-container pt-28 pb-20 md:pt-36 md:pb-28">
      <Skeleton className="h-3 w-56" />

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="mt-4 flex gap-4">
            <Skeleton className="aspect-[4/5] w-20 md:w-24" />
            <Skeleton className="aspect-[4/5] w-20 md:w-24" />
          </div>
        </div>

        <div>
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-5 h-12 w-4/5" />
          <Skeleton className="mt-6 h-5 w-32" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-9/12" />
          </div>
          <div className="mt-10 space-y-8 border-t border-line pt-8">
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-11 w-20" />
              <Skeleton className="h-11 w-20" />
              <Skeleton className="h-11 w-20" />
            </div>
            <Skeleton className="h-3 w-16" />
            <div className="flex gap-2">
              <Skeleton className="h-11 w-14" />
              <Skeleton className="h-11 w-14" />
              <Skeleton className="h-11 w-14" />
            </div>
            <Skeleton className="h-13 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}