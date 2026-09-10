import { cn } from "@/lib/utils";
import { getZoneType, getZoneStatus } from "../constants";

/** Compact gradient pill showing a zone's type (icon + label). */
export function ZoneTypePill({ typeName, size = "sm", withIcon = true }) {
  const t = getZoneType(typeName);
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

/** Container-status pill — idle / preparing / maintenance with a dot. */
export function ZoneStatusPill({ status, withDot = true }) {
  const s = getZoneStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm",
        s.chip
      )}
    >
      {withDot && <span className={cn("size-1.5 rounded-full", s.dot)} />}
      {s.label}
    </span>
  );
}

/** Active/inactive pill driven by `isActive` — live dot when active. */
export function ZoneActivePill({ active }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase backdrop-blur-sm",
        active
          ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
          : "border-border/60 bg-muted/40 text-muted-foreground"
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          active ? "relative flex bg-emerald-500" : "bg-muted-foreground/50"
        )}
      >
        {active && (
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
        )}
      </span>
      {active ? "Active" : "Inactive"}
    </span>
  );
}
