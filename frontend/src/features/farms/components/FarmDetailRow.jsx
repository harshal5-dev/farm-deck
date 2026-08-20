import { cn } from "@/lib/utils";

const FarmDetailRow = ({ icon: Icon, label, value, accent }) => {
  const valueClass = cn(
    "truncate text-xs font-semibold tabular-nums",
    accent === "amber" && "text-amber-700 dark:text-amber-400"
  );

  const iconBg =
    accent === "leaf"
      ? "bg-leaf/12 text-leaf"
      : accent === "sky"
        ? "bg-sky-warm/12 text-sky-warm"
        : accent === "wheat"
          ? "bg-wheat/15 text-wheat-deep dark:text-wheat"
          : accent === "clay"
            ? "bg-clay/12 text-clay-deep dark:text-clay"
            : accent === "sage"
              ? "bg-sage/15 text-sage-deep dark:text-sage"
              : "bg-background/60 text-muted-foreground/80";

  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          iconBg
        )}
      >
        <Icon className="size-3.5" strokeWidth={1.85} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className={valueClass}>{value}</p>
      </div>
    </div>
  );
};

export default FarmDetailRow;
