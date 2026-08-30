import { Skeleton } from "@/components/ui/skeleton";

const CycleCardSkeleton = () => {
  return (
    <div className="glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Hero band */}
      <div className="relative h-16 shrink-0 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col px-4 pb-2.5">
        {/* Identity — tile overlapping the hero */}
        <div className="flex items-end gap-2.5">
          <Skeleton className="-mt-5 size-11 shrink-0 rounded-2xl ring-[3px] ring-card" />
          <div className="min-w-0 flex-1 space-y-1.5 pb-0.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>

        {/* Pills row — category + plant count */}
        <div className="mt-2 flex items-center gap-1.5">
          <Skeleton className="h-4 w-16 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>

        {/* Targets strip */}
        <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-border/30 bg-muted/25 px-2 py-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Skeleton className="size-5 rounded-md" />
              <div className="min-w-0 flex-1 space-y-1">
                <Skeleton className="h-2 w-6" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>

        {/* Timeline strip */}
        <div className="mt-2 rounded-xl border border-border/30 bg-muted/25 px-3 py-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="mt-2 h-1.5 w-full rounded-full" />
        </div>
      </div>

      {/* Footer bar */}
      <div className="relative flex items-center justify-between border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
        <Skeleton className="h-3 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default CycleCardSkeleton;