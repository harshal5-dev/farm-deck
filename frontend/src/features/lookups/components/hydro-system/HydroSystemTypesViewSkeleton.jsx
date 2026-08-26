import { IconLoader2 } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import HydroSystemCardSkeleton from "./HydroSystemCardSkeleton";

const HydroSystemTypesViewSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-4">
      {/* Loading header — quiet, but unambiguous */}
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-xl bg-muted/60 ring-1 ring-border/40">
          <IconLoader2
            className="size-4 animate-spin text-muted-foreground"
            strokeWidth={1.85}
          />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      </div>

      {/* Grid of card skeletons */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: count }).map((_, i) => (
          <HydroSystemCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default HydroSystemTypesViewSkeleton;
