import { IconLeaf, IconRefresh, IconHome } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "@/components/layout/Logo";

/**
 * FullPageError — a full-viewport themed error screen used when bootstrapping
 * the app shell fails (e.g. /profile fetch returns an error inside Layout).
 *
 * Visual language matches `FullPageLoader` + the Login / 404 cards so the user
 * never sees a jarring style jump. The retry button re-mounts the loader via
 * `onRetry`; the home button falls back to a safe destination.
 *
 * Props:
 *  - title:     headline (default: "We couldn't load your workspace")
 *  - message:   short detail under the headline
 *  - onRetry:   retry callback (resets the failing query)
 *  - retrying:  disables the retry button + shows spinner text
 *  - homeTo:    href for the "back home" button (default "/app")
 *  - homeLabel: label for the home button (default "Go to dashboard")
 */
export default function FullPageError({
  title = "We couldn't load your workspace",
  message = "Something went wrong while preparing your farm. Please try again — your data is safe.",
  onRetry,
  retrying = false,
  homeTo = "/app",
  homeLabel = "Go to dashboard",
}) {
  return (
    <div
      role="alert"
      className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6"
    >
      {/* Same ambient glows as the rest of the app */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
        <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
        <div className="absolute right-1/4 bottom-1/4 size-95 rounded-full bg-sky-warm/8 blur-[90px] dark:bg-sky-warm/6" />
        <div className="pattern-contour absolute inset-0 opacity-30" />
      </div>

      <div
        className={cn(
          "glass-card texture-paper highlight-edge relative w-full max-w-md overflow-hidden rounded-3xl px-6 py-10 text-center ring-1 ring-foreground/5 animate-error-enter sm:px-10 sm:py-12"
        )}
      >
        {/* Top accent band */}
        <div className="absolute inset-x-0 top-0 h-1.5 overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-destructive via-clay-deep to-leaf" />
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
        </div>

        {/* far + mid glows around the icon */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-destructive/15 opacity-50 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-8 left-1/2 size-40 -translate-x-1/2 rounded-full bg-destructive/25 opacity-40 blur-2xl"
          aria-hidden="true"
        />

        {/* Brand header */}
        <div className="flex justify-center">
          <Logo variant="mark" />
        </div>

        {/* Icon stack */}
        <div className="relative mx-auto mt-7 flex size-16 items-center justify-center">
          <div
            className="absolute inset-0 animate-alert-ring rounded-2xl ring-2 ring-destructive/50"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 rounded-2xl bg-destructive/15 opacity-50 blur-xl"
            aria-hidden="true"
          />
          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-destructive/30 to-destructive/5 bg-destructive/15 text-destructive shadow-sm ring-1 ring-inset ring-destructive/25">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 to-transparent dark:from-white/5"
              aria-hidden="true"
            />
            <IconLeaf
              className="relative size-8 rotate-180 drop-shadow-sm"
              strokeWidth={1.6}
            />
          </div>
        </div>

        {/* eyebrow pill */}
        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive ring-1 ring-inset ring-destructive/25">
          <span className="relative inline-flex size-1.5 rounded-full bg-destructive" aria-hidden="true">
            <span
              className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-75"
              aria-hidden="true"
            />
          </span>
          Bootstrapping failed
        </div>

        <h2 className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground">
          {title}
        </h2>

        <div
          className="mx-auto mt-3 h-px w-10 bg-gradient-to-r from-transparent via-border to-transparent"
          aria-hidden="true"
        />

        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {message}
        </p>

        {(onRetry || homeTo) && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {onRetry && (
              <Button
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
            )}
            {homeTo && (
              <Button
                asChild
                variant="outline"
                className="gap-2 hover:bg-accent/50"
              >
                <Link to={homeTo}>
                  <IconHome className="size-4" strokeWidth={1.85} />
                  {homeLabel}
                </Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
