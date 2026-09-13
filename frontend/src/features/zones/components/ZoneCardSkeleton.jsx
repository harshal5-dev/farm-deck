import { Skeleton } from "@/components/ui/skeleton";

const ZoneCardSkeleton = () => {
  return (
    <div className="glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Hero band */}
      <div className="relative h-16 shrink-0 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col px-3.5 pb-2.5">
        {/* Identity — tile overlapping the hero */}
        <div className="flex items-end gap-2.5">
          <Skeleton className="-mt-4 size-10 shrink-0 rounded-xl ring-[3px] ring-card" />
          <div className="min-w-0 flex-1 space-y-1.5 pb-0.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Stat duo */}
        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>

        {/* Notes teaser */}
        <Skeleton className="mt-2 h-3 w-2/3" />
      </div>

      {/* Footer bar */}
      <div className="relative flex items-center justify-between border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
        <Skeleton className="h-3 w-28" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default ZoneCardSkeleton;
