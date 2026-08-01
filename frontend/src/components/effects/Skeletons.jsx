import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Skeleton placeholder matching the FarmCard layout. */
export function FarmCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>

      <div className="mt-5 flex gap-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>

      <Skeleton className="mt-4 h-8 w-full" />

      <div className="mt-5">
        <Skeleton className="mb-2 h-3 w-16" />
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/40 pt-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-12" />
      </div>
    </div>
  );
}

/** Skeleton placeholder matching the SoilTypeCard layout. */
export function SoilTypeCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl py-0">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="px-5 pt-8 pb-5">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="mt-2 h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
        <div className="mt-3 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Renders `count` copies of a skeleton in a grid. */
export function SkeletonGrid({
  count = 4,
  cols = "sm:grid-cols-2",
  type = "farm",
  className,
}) {
  const SkeletonCard =
    type === "soil" ? SoilTypeCardSkeleton : FarmCardSkeleton;
  return (
    <div className={cn("grid gap-4", cols, className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
