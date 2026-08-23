import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import Logo from "@/components/layout/Logo";
import {
  IconArrowLeft,
  IconHome,
  IconLeaf,
  IconMapSearch,
} from "@tabler/icons-react";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "@/features/auth";

const NotFound = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const homeLink = isAuthenticated ? "/app" : "/";

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-6">
      {/* Decorative background — matches the Home page */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
        <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
        <div className="pattern-contour absolute inset-0 opacity-40" />
      </div>

      <Reveal duration={600} className="relative w-full max-w-lg">
        <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl px-6 py-12 text-center ring-1 ring-foreground/5 sm:px-12 sm:py-16">
          {/* Top accent band — same motif as the Login card */}
          <div className="absolute inset-x-0 top-0 h-1.5 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-r from-leaf via-sage-deep to-sky-warm" />
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent shimmer-overlay animate-shimmer" />
          </div>

          {/* Brand mark */}
          <Reveal delay={80} duration={500}>
            <Link
              to={homeLink}
              className="inline-flex items-center gap-2"
              aria-label="Farmdeck home"
            >
              <Logo variant="mark" className="size-8" />
              <span className="text-lg font-bold tracking-tight">
                Farm
                <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                  deck
                </span>
              </span>
            </Link>
          </Reveal>

          {/* Themed icon — a calm, static chip (no spin) */}
          <Reveal delay={160} duration={500}>
            <div className="relative mx-auto mt-8 flex items-center justify-center">
              <span
                aria-hidden
                className="pointer-events-none absolute size-28 rounded-full bg-clay/10 blur-2xl"
              />
              <span className="relative flex size-16 items-center justify-center rounded-2xl bg-clay/15 text-clay-deep ring-1 ring-clay/20 ring-inset dark:text-clay">
                <IconMapSearch className="size-8" strokeWidth={1.6} />
              </span>
            </div>
          </Reveal>

          {/* 404 badge + copy */}
          <Reveal delay={240} duration={500}>
            <span className="mt-5 inline-flex items-center rounded-full border border-border/60 bg-muted/40 px-3 py-1 font-mono text-xs font-semibold tracking-wider text-muted-foreground">
              Error 404
            </span>
            <h2 className="mt-4 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              This field is{" "}
              <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                unplanted.
              </span>
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground sm:text-base">
              The page you&rsquo;re looking for doesn&rsquo;t exist or may have
              been moved. Let&rsquo;s get you back to growing.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay={320} duration={500}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                nativeButton={false}
                className="group/cta relative overflow-hidden rounded-xl px-5 text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
                render={<Link to={homeLink} />}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                />
                <span className="relative inline-flex items-center gap-2">
                  {isAuthenticated ? (
                    <IconArrowLeft className="size-4" strokeWidth={2} />
                  ) : (
                    <IconHome className="size-4" strokeWidth={2} />
                  )}
                  {isAuthenticated ? "Back to dashboard" : "Back to home"}
                </span>
              </Button>
              <Button
                nativeButton={false}
                variant="outline"
                className="gap-2 rounded-xl px-5 text-sm font-semibold"
                render={<Link to="/" />}
              >
                <IconArrowLeft className="size-4" strokeWidth={1.85} />
                Landing page
              </Button>
            </div>
          </Reveal>

          {/* Footer flourish */}
          <Reveal delay={400} duration={500}>
            <div className="mt-9 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground/70">
              <IconLeaf className="size-3.5 text-leaf" strokeWidth={1.85} />
              <span>Error code · 404 — not found</span>
            </div>
          </Reveal>
        </div>
      </Reveal>
    </div>
  );
};

export default NotFound;
