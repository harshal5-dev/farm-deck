import { Skeleton } from "@/components/ui/skeleton";

/** Loading placeholder matching the redesigned MemberCard layout. */
export function MemberCardSkeleton() {
  return (
    <div className="glass-card relative overflow-hidden rounded-2xl p-5">
      <div className="flex flex-col items-center pt-1.5 text-center">
        <Skeleton className="size-20 rounded-full" />
        <Skeleton className="mt-3 h-4 w-32" />
        <Skeleton className="mt-2 h-3 w-44" />
        <div className="mt-2.5 flex gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border/30 pt-3">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-full rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-3 w-3/4 rounded" />
    </div>
  );
}
