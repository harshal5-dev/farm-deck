import { cn } from "@/lib/utils";
import { getFarmType, getFarmStatus } from "@/constants/farms";

/** Compact gradient pill showing a farm's type (icon + label). */
export function FarmTypePill({ farmType, size = "sm", withIcon = true }) {
  const t = getFarmType(farmType);
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

/** Status pill driven by the API's `isActive` flag — live dot when active. */
export function FarmStatusPill({ active }) {
  const s = getFarmStatus(active ? "active" : "inactive");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm",
        s.chip
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "relative flex bg-emerald-500" : s.dot
        )}
      >
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
        )}
      </span>
      {s.label}
    </span>
  );
}
