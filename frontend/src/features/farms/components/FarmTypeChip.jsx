import { IconBuildingWarehouse } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getFarmTypeMeta } from "../lib/farm-meta";

/**
 * Toggleable farm-type chip used in the filter bar; shows the type's live
 * count. Mirrors the RoleFilterChip pattern from the members feature.
 * `type="all"` renders a neutral leaf-tinted "All farms" chip.
 */
export function FarmTypeChip({ type, count, active, onClick }) {
  const isAll = type === "all";
  const meta = getFarmTypeMeta(type);
  const Icon = isAll ? IconBuildingWarehouse : meta.icon;
  const label = isAll ? "All" : meta.label;

  // The "all" chip uses the brand leaf palette rather than a single type's hue.
  const activeClass = isAll
    ? "bg-leaf/15 text-leaf"
    : cn(meta.bg, meta.text);
  const activeGradient = isAll
    ? "from-leaf/40 to-sage/30"
    : meta.gradient;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group/chip relative inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
        active
          ? cn("border-transparent shadow-sm", activeClass)
          : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
      )}
    >
      {active && (
        <span
          className={cn(
            "absolute inset-0 -z-10 rounded-full bg-gradient-to-br opacity-25 blur-md",
            activeGradient
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
}
