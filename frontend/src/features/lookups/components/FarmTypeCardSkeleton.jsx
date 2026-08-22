import { Skeleton } from "@/components/ui/skeleton";

/**
 * FarmTypeCardSkeleton — loading placeholder matching the new compact
 * `FarmTypeCard` layout: hero band (h-32) with circular icon top-left
 * that fades into the body, then display name + line-clamped description.
 */
const FarmTypeCardSkeleton = () => {
  return (
    <div className="glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Hero band placeholder */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <Skeleton className="size-full rounded-none" />
        {/* Circular icon placeholder */}
        <div className="absolute top-3 left-3">
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1.5 px-5 pt-1 pb-5">
        {/* Display name */}
        <Skeleton className="h-5 w-2/3" />
        {/* Description — 2 lines (line-clamp-2) */}
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-4/5" />
      </div>
    </div>
  );
};

export default FarmTypeCardSkeleton;
