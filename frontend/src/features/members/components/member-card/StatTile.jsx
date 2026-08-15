
import { cn } from "@/lib/utils";

const StatTile = ({ icon: Icon, label, value, accent }) => {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-muted/40 px-2.5 py-2">
      <Icon
        className={cn(
          "size-3.5 shrink-0",
          accent === "amber"
            ? "text-amber-500"
            : accent === "leaf"
              ? "text-leaf"
              : "text-muted-foreground/70"
        )}
        strokeWidth={1.85}
      />
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "truncate text-xs font-bold tabular-nums",
            accent === "amber" && "text-amber-700 dark:text-amber-400"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export default StatTile;
