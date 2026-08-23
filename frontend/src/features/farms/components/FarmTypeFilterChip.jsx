import { cn } from "@/lib/utils";
import { getFarmType } from "@/constants/farms";

/**
 * Filter chip for a farm-type lookup row. `typeName` is the lookup
 * `name` (e.g. "greenhouse") used to resolve the visual config;
 * `label` is the user-facing displayName.
 */
const FarmTypeFilterChip = ({ typeName, label, count, active, onClick }) => {
  const t = getFarmType(typeName);
  const Icon = t.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/chip relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
        active
          ? cn("border-transparent shadow-sm", t.bg, t.text)
          : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-linear-to-br opacity-25 blur-md",
            t.gradient
          )}
        />
      )}
      <Icon className="size-3.5" strokeWidth={1.85} />
      {label}
      <span
        className={cn(
          "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
          active
            ? "bg-background/40 text-foreground"
            : "bg-muted text-muted-foreground"
        )}
      >
        {count}
      </span>
    </button>
  );
};

export default FarmTypeFilterChip;
