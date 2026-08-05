import { FarmScene, Reveal } from "@/components/effects";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconDatabase,
  IconShieldLock,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const heroMetrics = [
  { key: "farms", label: "Farms", value: 12, accent: "text-leaf" },
  { key: "fields", label: "Fields", value: 48, accent: "text-sky-warm" },
  { key: "members", label: "Members", value: 6, accent: "text-clay-deep dark:text-clay" },
  { key: "ph", label: "pH", value: 6.4, accent: "text-wheat", decimals: 1 },
];

const Hero = ({ appLink, isAuthenticated }) => {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ---------- Copy column ---------- */}
        <div>
          <Reveal delay={0} duration={500}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
              <span className="relative flex size-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-leaf/70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-leaf" />
              </span>
              Portfolio Project · v1.0
            </span>
          </Reveal>

          <Reveal delay={80} duration={500}>
            <h1 className="mt-6 font-heading text-[2.6rem] leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-[3.6rem]">
              Smart farming,{" "}
              <span className="relative inline-block">
                <span className="bg-linear-to-br from-leaf via-sage-deep to-sky-warm bg-clip-text text-transparent">
                  beautifully managed.
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 300 12"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full text-leaf/50"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 Q 75 2, 150 6 T 298 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160} duration={500}>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              Farmdeck is a full-stack, multi-tenant platform for modern
              farming. Track fields, crops, harvests, pH, and EC — all in one
              calm, focused dashboard.
            </p>
          </Reveal>

          <Reveal delay={240} duration={500}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to={appLink}>
                <Button
                  size="lg"
                  className="group/cta relative h-12 overflow-hidden rounded-xl px-5 text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                  />
                  <span className="relative inline-flex items-center gap-2">
                    {isAuthenticated ? "Open Dashboard" : "Sign in to demo"}
                    <IconArrowRight
                      className="size-4 transition-transform group-hover/cta:translate-x-0.5"
                      strokeWidth={2.2}
                    />
                  </span>
                </Button>
              </Link>
              <a
                href="https://github.com/harshal5-dev/farm-deck"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 gap-2 rounded-xl px-5 text-sm font-semibold"
                >
                  <IconBrandGithub className="size-4" strokeWidth={1.85} />
                  View Source
                </Button>
              </a>
            </div>
          </Reveal>

          <Reveal delay={320} duration={500}>
            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {[
                { icon: IconShieldLock, label: "JWT auth" },
                { icon: IconUsers, label: "Multi-tenant" },
                { icon: IconDatabase, label: "PostgreSQL" },
                { icon: IconSparkles, label: "Modern stack" },
              ].map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-1.5 font-medium"
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-leaf/12 text-leaf">
                    <Icon className="size-3" strokeWidth={2.2} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* ---------- Art column ---------- */}
        <Reveal delay={200} duration={600}>
          <HeroArtCard />
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;

function HeroArtCard() {
  return (
    <div className="relative">
      {/* Soft glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-leaf/20 via-sky-warm/15 to-clay/15 opacity-70 blur-2xl"
      />

      <div className="glass-card texture-paper highlight-edge relative h-80 overflow-hidden rounded-3xl ring-1 ring-foreground/5 sm:h-104">
        {/* Decorative contour pattern */}
        <div className="pattern-contour absolute inset-0 opacity-30" />

        {/* Farm scene */}
        <FarmScene className="absolute! inset-0 size-full" />

        {/* Bottom scrim for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />

        {/* Live status panel */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="rounded-2xl bg-background/85 px-4 py-3.5 shadow-md ring-1 ring-foreground/5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <p className="text-[10px] font-bold tracking-wider text-leaf uppercase">
                  Live overview
                </p>
              </div>
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                v1.0
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 divide-x divide-foreground/5">
              {heroMetrics.map((m) => (
                <MetricCell key={m.key} metric={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCell({ metric }) {
  const displayValue = metric.decimals
    ? metric.value.toFixed(metric.decimals)
    : metric.value;
  return (
    <div className="flex flex-col items-center justify-center px-1 text-center first:pl-0 last:pr-0">
      <p
        className={cn(
          "font-heading text-lg font-bold tabular-nums leading-none sm:text-xl",
          metric.accent
        )}
      >
        {displayValue}
      </p>
      <p className="mt-1 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
        {metric.label}
      </p>
    </div>
  );
}
