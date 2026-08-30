import { cn } from "@/lib/utils";
import {
  getCropType,
  getCropStatus,
  getGrowthStage,
} from "../constants";

/** Compact gradient pill showing a crop's type (icon + label). */
export function CropTypePill({ typeName, size = "sm", withIcon = true }) {
  const t = getCropType(typeName);
  const Icon = t.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-linear-to-br font-semibold tracking-wide ring-1 ring-inset uppercase",
        t.chip,
        size === "xs" && "px-1.5 py-0.5 text-[9px]",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-0.5 text-[11px]"
      )}
    >
      {withIcon && (
        <Icon
          className={cn(size === "xs" ? "size-2.5" : "size-3")}
          strokeWidth={2.2}
        />
      )}
      {t.label}
    </span>
  );
}

/** Lifecycle status pill — planned → seeding → growing → flowering
 *  → harvested → completed (plus failed/cancelled). */
export function CropStatusPill({ status, withIcon = true }) {
  const s = getCropStatus(status);
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm",
        s.chip
      )}
    >
      {withIcon && <Icon className="size-3" strokeWidth={2.1} />}
      {s.label}
    </span>
  );
}

/** Fine-grained growth stage pill — seedling/vegetative/flowering/
 *  fruiting/harvest. Pairs with the coarser status above. */
export function GrowthStagePill({ stage, withIcon = true, size = "sm" }) {
  const s = getGrowthStage(stage);
  const Icon = s.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold tracking-wide uppercase",
        s.chip,
        size === "xs" && "px-1.5 py-0.5 text-[9px]",
        size === "sm" && "px-2 py-0.5 text-[10px]"
      )}
    >
      {withIcon && (
        <Icon
          className={cn(size === "xs" ? "size-2.5" : "size-3")}
          strokeWidth={2.1}
        />
      )}
      {s.label}
    </span>
  );
}