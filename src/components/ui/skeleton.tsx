import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="presentation"
      aria-hidden
      className={cn("skeleton-shimmer rounded-md", className)}
      {...props}
    />
  );
}

/** Full-page placeholder used as the Suspense fallback for lazy routes. */
function SkeletonPage() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-fade-in px-4 py-8 sm:px-6 lg:px-12">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" style={{ animationDelay: `${i * 80}ms` }} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Skeleton className="h-[340px] rounded-xl lg:col-span-8" />
        <Skeleton className="h-[340px] rounded-xl lg:col-span-4" />
      </div>
    </div>
  );
}

export { Skeleton, SkeletonPage };
