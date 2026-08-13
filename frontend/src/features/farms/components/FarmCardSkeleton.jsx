import { Skeleton } from "@/components/ui/skeleton";

/** Skeleton placeholder matching the redesigned FarmCard layout. */
export function FarmCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl py-0">
      {/* banner */}
      <Skeleton className="h-24 w-full rounded-none" />
      <div className="px-5 pb-5">
        {/* overlapping chip + title */}
        <div className="flex items-center gap-3 pt-4">
          <Skeleton className="size-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* stat tiles */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>

        {/* notes */}
        <Skeleton className="mt-4 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-4/5" />

        {/* field plot */}
        <div className="mt-4">
          <Skeleton className="mb-2 h-2.5 w-20" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}
