import { IconAlertTriangle, IconRefresh, IconWifiOff, IconLockAccess } from "@tabler/icons-react";
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
    accent: "text-clay",
    chip: "bg-clay/15",
    ring: "ring-clay/20",
    glow: "bg-clay/10",
  },
  auth: {
    icon: IconLockAccess,
    accent: "text-wheat",
    chip: "bg-wheat/20",
    ring: "ring-wheat/20",
    glow: "bg-wheat/10",
  },
  offline: {
    icon: IconWifiOff,
    accent: "text-sky-warm",
    chip: "bg-sky-warm/15",
    ring: "ring-sky-warm/20",
    glow: "bg-sky-warm/10",
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
      className={cn(
        "glass-card texture-paper relative flex flex-col items-center overflow-hidden rounded-2xl text-center",
        compact ? "px-5 py-8" : "px-6 py-14",
        className
      )}
    >
      {/* soft backdrop glow */}
      <div
        className={cn(
          "pointer-events-none absolute -top-12 size-44 rounded-full opacity-40 blur-3xl",
          meta.glow
        )}
        aria-hidden="true"
      />

      <div className="relative">
        {/* icon in a layered chip */}
        <div className="relative mx-auto flex size-16 items-center justify-center">
          <div
            className={cn("absolute inset-0 rounded-2xl opacity-25 blur-xl", meta.chip)}
            aria-hidden="true"
          />
          <div
            className={cn(
              "relative flex size-16 items-center justify-center rounded-2xl ring-1 ring-inset",
              meta.chip,
              meta.ring
            )}
          >
            <Icon className={cn("size-8", meta.accent)} strokeWidth={1.6} />
          </div>
        </div>

        <h3
          className={cn(
            "mt-5 font-heading font-bold tracking-tight",
            compact ? "text-base" : "text-lg"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mx-auto mt-2 max-w-sm leading-relaxed text-muted-foreground",
            compact ? "text-xs" : "text-sm"
          )}
        >
          {message}
        </p>

        {onRetry && (
          <div className="mt-5">
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              onClick={onRetry}
              disabled={retrying}
              className="gap-2"
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
