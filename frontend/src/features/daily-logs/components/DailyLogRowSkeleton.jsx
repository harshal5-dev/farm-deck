import { Skeleton } from "@/components/ui/skeleton";

const DailyLogRowSkeleton = () => (
  <div className="glass-card texture-paper relative overflow-hidden rounded-2xl border border-border/40">
    <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4">
      <div className="flex shrink-0 items-center gap-3 sm:w-44 sm:flex-col sm:items-start sm:gap-1.5">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </div>
  </div>
);

export default DailyLogRowSkeleton;