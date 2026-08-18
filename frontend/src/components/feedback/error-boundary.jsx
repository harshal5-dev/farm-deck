import { Component } from "react";
import { IconRefresh, IconBug } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * ErrorBoundary — a class component that catches render-time errors anywhere in
 * its subtree and shows a themed fallback instead of a white screen. Wrap it
 * around the whole app (in main.jsx) and/or around individual routes.
 *
 * Props:
 *  - children:        the subtree to guard
 *  - fallback:        optional custom fallback UI (receives { error, reset })
 *  - fullscreen:      when true, fills the viewport (use at the app root)
 *
 * On reset (button click or remount) it clears the error and re-renders.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Log so it shows in the console even when minified in prod.
    console.error("ErrorBoundary caught:", error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { hasError, error } = this.state;
    const { fallback, fullscreen = false } = this.props;

    if (hasError) {
      if (typeof fallback === "function") {
        return fallback({ error, reset: this.reset });
      }
      if (fallback) return fallback;

      return <DefaultFallback error={error} onReset={this.reset} fullscreen={fullscreen} />;
    }

    return this.props.children;
  }
}

function DefaultFallback({ error, onReset, fullscreen }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-background p-6",
        fullscreen ? "min-h-svh" : "min-h-[60vh]"
      )}
    >
      <div
        role="alert"
        className="glass-card texture-paper highlight-edge relative w-full max-w-md animate-error-enter overflow-hidden rounded-2xl px-6 py-10 text-center"
      >
        {/* far backdrop glow */}
        <div
          className="pointer-events-none absolute -top-16 left-1/2 size-56 -translate-x-1/2 rounded-full bg-destructive/15 opacity-50 blur-3xl"
          aria-hidden="true"
        />
        {/* softer mid glow */}
        <div
          className="pointer-events-none absolute -top-8 left-1/2 size-40 -translate-x-1/2 rounded-full bg-destructive/25 opacity-40 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative">
          <div className="relative mx-auto flex size-16 items-center justify-center">
            {/* expanding alert ring */}
            <div
              className="absolute inset-0 animate-alert-ring rounded-2xl ring-2 ring-destructive/50"
              aria-hidden="true"
            />
            {/* soft halo */}
            <div
              className="absolute inset-0 rounded-2xl bg-destructive/15 opacity-50 blur-xl"
              aria-hidden="true"
            />
            {/* gradient chip */}
            <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-destructive/30 to-destructive/5 bg-destructive/15 text-destructive shadow-sm ring-1 ring-inset ring-destructive/25">
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-b from-white/15 to-transparent dark:from-white/5"
                aria-hidden="true"
              />
              <IconBug className="relative size-8 drop-shadow-sm" strokeWidth={1.6} />
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
            Render error
          </div>

          <h2 className="mt-3 font-heading text-lg font-bold tracking-tight text-foreground">
            Something broke
          </h2>

          <div
            className="mx-auto mt-3 h-px w-10 bg-linear-to-r from-transparent via-border to-transparent"
            aria-hidden="true"
          />

          <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred while rendering this page. You can try
            again — your work is safe.
          </p>

          {error?.message && (
            <details className="mx-auto mt-4 max-w-sm text-left">
              <summary className="cursor-pointer text-[11px] font-medium text-muted-foreground/70 hover:text-muted-foreground">
                Technical details
              </summary>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-muted/50 p-3 text-[11px] leading-relaxed text-muted-foreground">
                {error.message}
              </pre>
            </details>
          )}

          <div className="mt-6 flex justify-center gap-2">
            <Button onClick={onReset} className="gap-2">
              <IconRefresh className="size-4" strokeWidth={1.85} />
              Try again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.assign("/app")}
              className="text-destructive hover:bg-accent/50"
            >
              Go to dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
