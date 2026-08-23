import { Skeleton } from "@/components/ui/skeleton";

const FarmCardSkeleton = () => {
  return (
    <div className="glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Hero band */}
      <div className="relative h-20 shrink-0 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col px-4 pb-3">
        {/* Identity — tile overlapping the hero */}
        <div className="flex items-end gap-2.5">
          <Skeleton className="-mt-6 size-12 shrink-0 rounded-2xl ring-[3px] ring-card" />
          <div className="min-w-0 flex-1 space-y-1.5 pb-0.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Pills */}
        <div className="mt-2.5 flex gap-2">
          <Skeleton className="h-4.5 w-18 rounded-full" />
          <Skeleton className="h-4.5 w-16 rounded-full" />
        </div>

        {/* KPI strip */}
        <div className="mt-3 grid grid-cols-3 divide-x divide-border/40 rounded-xl border border-border/30 bg-muted/25">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1.5 px-2 py-2"
            >
              <Skeleton className="size-3.5 rounded" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>

        {/* Notes teaser */}
        <Skeleton className="mt-2.5 h-3 w-full" />
      </div>

      {/* Footer bar */}
      <div className="relative flex items-center justify-between border-t border-border/40 bg-muted/25 px-3.5 py-2">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default FarmCardSkeleton;
