import { Link } from "react-router-dom";
import { IconArrowLeft, IconSeedling, IconCheck } from "@tabler/icons-react";
import { FarmScene, Reveal } from "@/components/effects";
import Logo from "@/components/layout/Logo";
import ThemeToggle from "@/theme/theme-toggle";
import { features } from "../constants";

const AuthLayout = ({ children }) => {
  return (
    <div className="relative flex min-h-svh bg-background">
      {/* Floating theme toggle — top right, above everything. */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Left brand/art panel (desktop only) */}
      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-leaf/20 via-sage/10 to-transparent" />
        <FarmScene className="absolute! inset-0 size-full" />
        {/* scrim for contrast */}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="pattern-contour absolute inset-0 opacity-30" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
          >
            <Logo variant="full" withSubtitle={false} animate />
          </Link>

          <div className="max-w-md">
            <Reveal delay={0} duration={500}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur-sm">
                <IconSeedling className="size-3.5" strokeWidth={2} />
                Smart farming, simplified
              </span>
            </Reveal>
            <Reveal delay={90} duration={500}>
              <h2 className="mt-4 font-heading text-4xl leading-tight font-bold tracking-tight">
                Grow more with less effort. 🌾
              </h2>
            </Reveal>
            <Reveal delay={170} duration={500}>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Farmdeck is a modern multi-workspace platform for modern farming —
                track every field, crop, and harvest in one place.
              </p>
            </Reveal>

            <Reveal delay={250} duration={500}>
              <ul className="mt-6 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className="flex size-5 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                      <IconCheck className="size-3" strokeWidth={2.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <p className="text-xs text-muted-foreground/60">
            Built with Go, Gin, PostgreSQL & React
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex w-full flex-col lg:w-1/2">
        {/* Top bar — back link on the left, visually mirrors the fixed
            theme toggle on the right so the corners feel balanced. */}
        <div className="flex items-center px-4 pt-4 sm:px-6 sm:pt-5">
          <Link
            to="/"
            className="group inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <IconArrowLeft
              className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            <span>Back to home</span>
          </Link>
        </div>

        {/* Mobile logo — stacked: bigger mark on top, wordmark below.
            The full mark+wordmark lives in the left brand panel on
            desktop, so on mobile we stack vertically to avoid horizontal
            crowding on narrow screens. */}
        <div className="flex flex-col items-center px-6 pt-4 pb-2 lg:hidden">
          <Link
            to="/"
            aria-label="Farmdeck home"
            className="transition-transform duration-200 hover:scale-[1.03] active:scale-95"
          >
            <Logo variant="stacked" />
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-10 pt-2 sm:pb-12">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
