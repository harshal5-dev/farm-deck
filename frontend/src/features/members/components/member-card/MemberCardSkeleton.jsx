import { Skeleton } from "@/components/ui/skeleton";


const MemberCardSkeleton = () => {
  return (
    <div className="glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl">
      {/* Top gradient strip */}
      <div className="relative h-1 shrink-0 overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
      </div>

      {/* Body */}
      <div className="relative flex flex-1 flex-col p-5">
        {/* Identity row */}
        <div className="flex items-start gap-3">
          <Skeleton className="size-16 shrink-0 rounded-full ring-2 ring-card" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-40" />
            <div className="flex gap-1.5">
              <Skeleton className="h-4 w-14 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </div>
          <Skeleton className="size-8 shrink-0 rounded-xl" />
        </div>

        {/* Stat tiles */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-2">
            <Skeleton className="size-3.5 shrink-0 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-2 w-10" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-2">
            <Skeleton className="size-3.5 shrink-0 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-border/30 pt-3">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export default MemberCardSkeleton;
