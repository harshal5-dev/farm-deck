import { cn } from "@/lib/utils";
import { getRole, getStatus } from "@/constants/roles";

/** Compact gradient pill showing a member's role (icon + label). */
export function RolePill({ role, size = "sm", withIcon = true }) {
  const r = getRole(role);
  const Icon = r.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-linear-to-br font-semibold tracking-wide ring-1 ring-inset uppercase",
        r.chip,
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
      {r.label}
    </span>
  );
}

/** Status pill with a live dot for active members. */
export function StatusPill({ status }) {
  const s = getStatus(status);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
        s.chip
      )}
    >
      {status === "active" ? (
        <span className="relative flex size-1.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500" />
        </span>
      ) : (
        <span className={cn("size-1.5 rounded-full", s.dot)} />
      )}
      {s.label}
    </span>
  );
}
