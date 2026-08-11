import {
  IconAlertTriangle,
  IconRefresh,
  IconWifiOff,
  IconLockAccess,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * ErrorState — a beautiful inline error display that matches the farm theme.
 * Use it directly, or via QueryState which produces its props from an RTK
 * Query error.
 *
 * Props:
 *  - title:     short headline (default "Something went wrong")
 *  - message:   supportive detail
 *  - icon:      optional override icon component
 *  - onRetry:   when provided, shows a "Try again" button
 *  - retrying:  disables the retry button + shows spinner text
 *  - variant:   "error" | "auth" | "offline" — tunes the icon/accent
 *  - compact:   smaller padding (for use inside panels like ResourceExplorer)
 *  - className: extra classes on the outer wrapper
 */
const variantMeta = {
  error: {
    icon: IconAlertTriangle,
    eyebrow: "Error",
    accent: "text-destructive",
    chip: "bg-destructive/15",
    chipGradient: "from-destructive/30 to-destructive/5",
    ring: "ring-destructive/25",
    glow: "bg-destructive/15",
    halo: "bg-destructive/25",
    pill: "bg-destructive/10 text-destructive ring-destructive/25",
    ringPulse: "ring-destructive/50",
    dot: "bg-destructive",
  },
  auth: {
    icon: IconLockAccess,
    eyebrow: "Sign-in required",
    accent: "text-wheat",
    chip: "bg-wheat/20",
    chipGradient: "from-wheat/30 to-wheat/5",
    ring: "ring-wheat/25",
    glow: "bg-wheat/15",
    halo: "bg-wheat/25",
    pill: "bg-wheat/15 text-wheat ring-wheat/25",
    ringPulse: "ring-wheat/40",
    dot: "bg-wheat",
  },
  offline: {
    icon: IconWifiOff,
    eyebrow: "You're offline",
    accent: "text-sky-warm",
    chip: "bg-sky-warm/15",
    chipGradient: "from-sky-warm/30 to-sky-warm/5",
    ring: "ring-sky-warm/20",
    glow: "bg-sky-warm/15",
    halo: "bg-sky-warm/25",
    pill: "bg-sky-warm/10 text-sky-warm ring-sky-warm/20",
    ringPulse: "ring-sky-warm/40",
    dot: "bg-sky-warm",
  },
};

export default function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  icon,
  onRetry,
  retrying = false,
  variant = "error",
  compact = false,
  className,
}) {
  const meta = variantMeta[variant] || variantMeta.error;
  const Icon = icon || meta.icon;

  return (
    <div
      role="alert"
      className={cn(
        "glass-card texture-paper highlight-edge relative flex flex-col items-center overflow-hidden rounded-2xl text-center animate-error-enter",
        compact ? "px-5 py-8" : "px-6 py-14",
        className
      )}
    >
      {/* far backdrop glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full opacity-50 blur-3xl",
          meta.glow
        )}
        aria-hidden="true"
      />
      {/* softer mid glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-8 left-1/2 size-40 -translate-x-1/2 rounded-full opacity-40 blur-2xl",
          meta.halo
        )}
        aria-hidden="true"
      />

      <div className="relative">
        {/* icon stack: expanding alert ring → soft halo → gradient chip → icon */}
        <div className="relative mx-auto flex size-16 items-center justify-center">
          {/* expanding alert ring (animated) */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl ring-2 animate-alert-ring",
              meta.ringPulse
            )}
            aria-hidden="true"
          />
          {/* soft halo around chip */}
          <div
            className={cn(
              "absolute inset-0 rounded-2xl opacity-50 blur-xl",
              meta.chip
            )}
            aria-hidden="true"
          />
          {/* gradient-filled chip with ring + inset highlight */}
          <div
            className={cn(
              "relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 ring-inset shadow-sm",
              meta.chipGradient,
              meta.chip,
              meta.ring
            )}
          >
            {/* inset top highlight */}
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent dark:from-white/5"
              aria-hidden="true"
            />
            <Icon
              className={cn("relative size-8 drop-shadow-sm", meta.accent)}
              strokeWidth={1.6}
            />
          </div>
        </div>

        {/* status eyebrow pill */}
        <div
          className={cn(
            "mt-5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
            meta.pill
          )}
        >
          <span
            className={cn("relative inline-flex size-1.5 rounded-full", meta.dot)}
            aria-hidden="true"
          >
            <span
              className={cn("absolute inset-0 animate-ping rounded-full opacity-75", meta.dot)}
              aria-hidden="true"
            />
          </span>
          {meta.eyebrow}
        </div>

        <h3
          className={cn(
            "mt-3 font-heading font-bold tracking-tight text-foreground",
            compact ? "text-base" : "text-lg"
          )}
        >
          {title}
        </h3>

        {/* hairline divider between title and message */}
        <div
          className={cn(
            "mx-auto mt-3 h-px w-10 bg-gradient-to-r from-transparent via-border to-transparent",
            compact && "w-8"
          )}
          aria-hidden="true"
        />

        <p
          className={cn(
            "mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {message}
        </p>

        {onRetry && (
          <div className="mt-6">
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              onClick={onRetry}
              disabled={retrying}
              className={cn("gap-2", meta.accent, "hover:bg-accent/50")}
            >
              <IconRefresh
                className={cn("size-4", retrying && "animate-spin")}
                strokeWidth={1.85}
              />
              {retrying ? "Retrying…" : "Try again"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
