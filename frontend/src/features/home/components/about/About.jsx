import { Reveal } from "@/components/effects";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconHeartHandshake,
  IconLayoutDashboard,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import StatTile from "./StatTile";
import { highlights, stats } from "../../constants";


const About = ({ appLink, isAuthenticated = false }) => {
  const primaryCta = isAuthenticated
    ? { label: "Open dashboard", icon: IconLayoutDashboard }
    : { label: "Explore the demo", icon: IconArrowRight };
  const secondaryCta = isAuthenticated
    ? { to: "/app/profile", label: "View profile", icon: IconUserCircle }
    : { to: "/login", label: "Sign in", icon: null };
  return (
    <>
      <section
        id="about"
        className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal trigger="scroll" duration={500}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-clay/30 bg-clay/10 px-3 py-1 text-xs font-semibold text-clay-deep dark:text-clay">
              <IconHeartHandshake className="size-3.5" strokeWidth={2} />
              The story
            </span>
            <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem]">
              A portfolio built{" "}
              <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                to showcase.
              </span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              Farmdeck demonstrates end-to-end system design: a Go + Gin REST
              API backed by PostgreSQL with sqlc-generated type-safe queries,
              secure multi-workspace data isolation, and a polished React +
              shadcn/ui frontend.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-[17px]">
              It&apos;s a study in clean architecture, separation of concerns,
              and developer experience — built by{" "}
              <span className="font-semibold text-foreground">Harshal</span>{" "}
              to learn and demonstrate real-world full-stack engineering.
            </p>

            <a
              href="https://github.com/harshal5-dev/farm-deck"
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-leaf transition-colors hover:text-leaf/80"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-leaf/10 ring-1 ring-leaf/20 transition-transform group-hover:scale-105">
                <IconBrandGithub className="size-4" strokeWidth={1.85} />
              </span>
              Explore the repository
              <IconArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.2}
              />
            </a>
          </Reveal>

          <Reveal trigger="scroll" delay={120} duration={500}>
            <div className="glass-card texture-paper relative overflow-hidden rounded-2xl p-6">
              <div className="absolute -top-12 -right-12 size-32 rounded-full bg-leaf/10 blur-2xl" />
              <div className="relative">
                <h3 className="font-heading text-lg font-bold tracking-tight">
                  Engineering highlights
                </h3>
                <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {highlights.map((h) => {
                    const Icon = h.icon;
                    return (
                      <li
                        key={h.label}
                        className="flex items-center gap-2.5 rounded-lg bg-background/40 px-2.5 py-2 text-sm ring-1 ring-foreground/5"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-leaf/15 text-leaf">
                          <Icon className="size-3.5" strokeWidth={2.2} />
                        </span>
                        {h.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Stats strip */}
        <Reveal trigger="scroll" delay={180} duration={500}>
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((s) => (
              <StatTile key={s.label} {...s} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* ---------- Final CTA ---------- */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal trigger="scroll" duration={600}>
          <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12 sm:py-20">
            {/* layered gradient blobs */}
            <div className="pointer-events-none absolute inset-0 z-0">
              <div className="absolute -top-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-linear-to-br from-leaf/30 via-sky-warm/20 to-clay/20 blur-3xl" />
              <div className="pattern-contour absolute inset-0 opacity-30 mix-blend-soft-light" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur-sm">
                {isAuthenticated ? "Back to your fields" : "Ready to grow?"}
              </span>
              <h2 className="mt-5 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                {isAuthenticated
                  ? "Pick up where you left off."
                  : "Step inside the dashboard."}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground sm:text-[17px]">
                {isAuthenticated
                  ? "Your farms, fields, and recent activity are waiting. Head back into the dashboard to keep things growing."
                  : "Try the demo — no signup, no setup. Just explore the platform in action."}
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to={appLink}>
                  <Button
                    size="lg"
                    className="group/cta relative h-12 overflow-hidden rounded-xl px-6 text-sm font-semibold shadow-md shadow-leaf/20 transition-all hover:shadow-lg hover:shadow-leaf/30"
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover/cta:translate-x-full"
                    />
                    <span className="relative inline-flex items-center gap-2">
                      {primaryCta.label}
                      <primaryCta.icon
                        className="size-4 transition-transform group-hover/cta:translate-x-0.5"
                        strokeWidth={2.2}
                      />
                    </span>
                  </Button>
                </Link>
                <Link to={secondaryCta.to}>
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 gap-2 rounded-xl px-6 text-sm font-semibold"
                  >
                    {secondaryCta.icon && (
                      <secondaryCta.icon
                        className="size-4"
                        strokeWidth={1.85}
                      />
                    )}
                    {secondaryCta.label}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
};

export default About;
