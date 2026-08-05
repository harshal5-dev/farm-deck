import { Skeleton } from "@/components/ui/skeleton";

const FarmTypeCardSkeleton = () => {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl py-0">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="px-5 pt-8 pb-5">
        <div className="flex items-center gap-3">
          <Skeleton className="size-12 rounded-2xl" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
        <div className="mt-4 space-y-2.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-1.5 rounded-xl p-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FarmTypeCardSkeleton;
