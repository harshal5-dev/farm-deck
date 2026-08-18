import { Reveal } from "@/components/effects";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconDatabase,
  IconLayoutDashboard,
  IconShieldLock,
  IconSparkles,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import HeroArtCard from "./HeroArtCard";

const Hero = ({ appLink, isAuthenticated = false }) => {
  const primaryCta = isAuthenticated
    ? { label: "Open dashboard", icon: IconLayoutDashboard }
    : { label: "Sign in to demo", icon: IconArrowRight };

  return (
    <section className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-20 sm:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* ---------- Copy column ---------- */}
        <div>
          <Reveal delay={0} duration={500}>
            <span
              className={
                isAuthenticated
                  ? "inline-flex items-center gap-1.5 rounded-full border border-sage/30 bg-sage/10 px-3 py-1 text-xs font-semibold text-sage-deep dark:text-sage"
                  : "inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf"
              }
            >
              <span className="relative flex size-1.5">
                <span
                  className={
                    isAuthenticated
                      ? "absolute inset-0 animate-ping rounded-full bg-sage/70"
                      : "absolute inset-0 animate-ping rounded-full bg-leaf/70"
                  }
                />
                <span
                  className={
                    isAuthenticated
                      ? "relative inline-flex size-1.5 rounded-full bg-sage-deep dark:bg-sage"
                      : "relative inline-flex size-1.5 rounded-full bg-leaf"
                  }
                />
              </span>
              {isAuthenticated ? "Welcome back" : "Portfolio Project · v1.0"}
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
                    {primaryCta.label}
                    <primaryCta.icon
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
