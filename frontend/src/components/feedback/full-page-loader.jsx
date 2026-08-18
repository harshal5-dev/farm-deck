import { useEffect, useState } from "react";
import { IconLeaf } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Logo, { Mark } from "@/components/layout/Logo";

/**
 * FullPageLoader — a full-viewport themed loader used while the app is
 * bootstrapping (auth session check, profile fetch, route data, etc.).
 *
 * It deliberately echoes the visual language of the rest of the app:
 *   - the same sage/clay/sky glows as `BackgroundDecor`
 *   - the same glass-card / texture-paper / highlight-edge surface
 *   - the same gradient accent band as the Login + 404 cards
 *   - the leaf `Mark` with its built-in sun-pulse animation
 *
 * Props:
 *  - message:  primary copy under the spinner (default: "Loading your farm…")
 *  - caption:  smaller eyebrow copy above the message
 *  - brand:    "mark" | "wordmark" — header treatment ("wordmark" shows the
 *              full Farmdeck logo+tagline; default "mark" shows just the leaf)
 *  - tone:     "leaf" | "sky" | "clay" — picks the accent palette for the
 *              rings + accent band (default "leaf")
 */
const toneMap = {
  leaf: {
    accentBand: "from-leaf via-sage-deep to-sky-warm",
    ring1: "border-leaf/35",
    ring2: "border-sage/40",
    ring3: "border-sky-warm/30",
    glow: "bg-leaf/15",
    halo: "bg-sage/20",
    pill: "bg-leaf/10 text-leaf ring-leaf/25",
    dot: "bg-leaf",
    leafTint: "text-leaf",
  },
  sky: {
    accentBand: "from-sky-warm via-sage to-leaf",
    ring1: "border-sky-warm/35",
    ring2: "border-sage/30",
    ring3: "border-leaf/30",
    glow: "bg-sky-warm/15",
    halo: "bg-leaf/15",
    pill: "bg-sky-warm/10 text-sky-warm ring-sky-warm/25",
    dot: "bg-sky-warm",
    leafTint: "text-sage-deep",
  },
  clay: {
    accentBand: "from-clay via-clay-deep to-leaf",
    ring1: "border-clay/35",
    ring2: "border-leaf/30",
    ring3: "border-sage/30",
    glow: "bg-clay/15",
    halo: "bg-leaf/15",
    pill: "bg-clay/15 text-clay-deep ring-clay/25 dark:text-clay",
    dot: "bg-clay-deep",
    leafTint: "text-clay-deep",
  },
};

/** Tiny rising-leaf particles — pure decoration, very subtle. */
function FloatingLeaves({ count = 6 }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => {
        const left = 8 + ((i * 17) % 84);
        const delay = (i * 0.7).toFixed(2);
        const duration = 6 + (i % 4) * 1.2;
        const size = 10 + (i % 3) * 4;
        const drift = ((i % 2 === 0 ? 1 : -1) * (8 + (i % 3) * 4)).toFixed(0);
        return (
          <span
            key={i}
            className="absolute -bottom-6 text-leaf/40 animate-leaf-rise dark:text-leaf/25"
            style={{
              left: `${left}%`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
              // CSS custom prop consumed by keyframes
              ["--drift"]: `${drift}px`,
            }}
          >
            <IconLeaf
              style={{ width: size, height: size }}
              strokeWidth={1.6}
            />
          </span>
        );
      })}
    </div>
  );
}

/** Three pulsing dots that cycle to read as "loading…". */
function LoadingDots({ dotClass }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full animate-pulse-dot",
            dotClass
          )}
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </span>
  );
}

export default function FullPageLoader({
  message = "Loading your farm…",
  caption = "Please wait",
  brand = "mark",
  tone = "leaf",
}) {
  const [mounted, setMounted] = useState(false);
  const meta = toneMap[tone] || toneMap.leaf;

  // Trigger entrance animation on next frame so it actually plays.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message}
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background"
    >
      {/* Match the page background glows so the loader feels like part of the app */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
        <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
        <div className="absolute right-1/4 bottom-1/4 size-95 rounded-full bg-sky-warm/8 blur-[90px] dark:bg-sky-warm/6" />
        <div className="pattern-contour absolute inset-0 opacity-30" />
      </div>

      <FloatingLeaves />

      <div
        className={cn(
          "glass-card texture-paper highlight-edge relative w-full max-w-sm overflow-hidden rounded-3xl px-6 py-10 text-center ring-1 ring-foreground/5 sm:px-10 sm:py-12",
          "transition-all duration-500 ease-out",
          mounted
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-2 opacity-0 scale-[0.98]"
        )}
      >
        {/* Top accent band — same motif as Login + 404 */}
        <div className="absolute inset-x-0 top-0 h-1.5 overflow-hidden">
          <div className={cn("absolute inset-0 bg-linear-to-r", meta.accentBand)} />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
        </div>

        {/* Brand header */}
        <div className="flex justify-center">
          {brand === "wordmark" ? (
            <Logo variant="full" withSubtitle animate />
          ) : (
            <div className="animate-logo-pop">
              <Mark className="size-9" />
            </div>
          )}
        </div>

        {/* Spinner: layered rings around the leaf mark */}
        <div className="relative mx-auto mt-7 flex size-32 items-center justify-center">
          {/* outer far glow */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 rounded-full opacity-60 blur-2xl",
              meta.glow
            )}
            aria-hidden="true"
          />
          {/* softer mid glow */}
          <div
            className={cn(
              "pointer-events-none absolute -inset-2 rounded-full opacity-50 blur-xl",
              meta.halo
            )}
            aria-hidden="true"
          />
          {/* ring 1 — dashed, slow spin */}
          <div
            className={cn(
              "absolute inset-0 rounded-full border border-dashed animate-spin-slow",
              meta.ring1
            )}
            aria-hidden="true"
          />
          {/* ring 2 — solid, reverse spin */}
          <div
            className={cn(
              "absolute inset-2 rounded-full border-2 animate-spin-reverse",
              meta.ring2
            )}
            aria-hidden="true"
          />
          {/* ring 3 — tick marks, very slow */}
          <div
            className={cn(
              "absolute inset-4 rounded-full border animate-spin-slower",
              meta.ring3
            )}
            aria-hidden="true"
          />

          {/* center chip */}
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-card/70 shadow-sm ring-1 ring-inset ring-foreground/10 backdrop-blur">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/20 to-transparent dark:from-white/5"
              aria-hidden="true"
            />
            <Mark className={cn("relative size-9", meta.leafTint)} />
          </div>
        </div>

        {/* Eyebrow pill */}
        <div
          className={cn(
            "mt-7 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
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
          {caption}
        </div>

        {/* Message + dots */}
        <h2 className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground">
          {message}
        </h2>

        <div
          className="mx-auto mt-3 h-px w-10 bg-linear-to-r from-transparent via-border to-transparent"
          aria-hidden="true"
        />

        <div className="mt-4 flex items-center justify-center">
          <LoadingDots dotClass={meta.dot} />
        </div>

        {/* Footer flourish */}
        <div className="mt-7 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
          <IconLeaf className={cn("size-3.5", meta.leafTint)} strokeWidth={1.85} />
          <span>Cultivating your workspace</span>
        </div>
      </div>
    </div>
  );
}
