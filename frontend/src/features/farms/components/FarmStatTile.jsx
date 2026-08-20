import { cn } from "@/lib/utils";

const FarmStatTile = ({ icon: Icon, label, value, accent }) => {
  const colorClass =
    accent === "leaf"
      ? "text-leaf"
      : accent === "sky"
        ? "text-sky-warm"
        : accent === "wheat"
          ? "text-wheat-deep dark:text-wheat"
          : accent === "clay"
            ? "text-clay-deep dark:text-clay"
            : accent === "sage"
              ? "text-sage-deep dark:text-sage"
              : accent === "amber"
                ? "text-amber-500"
                : "text-muted-foreground/70";

  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-2">
      <Icon className={cn("size-3.5 shrink-0", colorClass)} strokeWidth={1.85} />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="truncate text-xs font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
};

export default FarmStatTile;
