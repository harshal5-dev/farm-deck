import { Skeleton } from "@/components/ui/skeleton";

const FarmTypeCardSkeleton = () => {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40">
      {/* Top art band placeholder with the circular badge */}
      <div className="relative h-16 w-full shrink-0 overflow-hidden">
        <Skeleton className="size-full rounded-none" />
        <Skeleton className="absolute top-2 left-2 size-7 rounded-full" />
      </div>

      {/* Body — title + full-length description */}
      <div className="flex flex-1 items-start gap-2 p-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <Skeleton className="h-3 w-10/12" />
          <Skeleton className="h-3 w-9/12" />
        </div>
      </div>
    </div>
  );
};

export default FarmTypeCardSkeleton;
