import { Skeleton } from "@/components/ui/skeleton";

const SoilTypeCardSkeleton = () => {
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
};

export default SoilTypeCardSkeleton;
