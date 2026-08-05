import { FarmScene, Reveal } from "@/components/effects";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconDatabase,
  IconSeedling,
  IconShieldLock,
  IconUsers,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const heroDots = ["bg-leaf", "bg-sky-warm", "bg-wheat"];

const Hero = ({ appLink, isAuthenticated }) => {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Reveal delay={0} duration={500}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
              <IconSeedling className="size-3.5" strokeWidth={2} />
              Portfolio Project · Farm Management System
            </span>
          </Reveal>
          <Reveal delay={80} duration={500}>
            <h1 className="mt-5 font-heading text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Smart farming,{" "}
              <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                beautifully managed.
              </span>
            </h1>
          </Reveal>
          <Reveal delay={160} duration={500}>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
              Farmdeck is a full-stack, multi-tenant platform for modern
              farming. Track fields, crops, harvests, pH, and EC — all in one
              modern dashboard.
            </p>
          </Reveal>
          <Reveal delay={240} duration={500}>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link to={appLink}>
                <Button size="lg" className="gap-2">
                  {isAuthenticated ? "Open Dashboard" : "Sign in"}
                  <IconArrowRight className="size-4" strokeWidth={2.2} />
                </Button>
              </Link>
              <a
                href="https://github.com/harshal5-dev/farm-deck"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2">
                  <IconBrandGithub className="size-4" strokeWidth={1.85} />
                  View Source
                </Button>
              </a>
            </div>
          </Reveal>
          <Reveal delay={320} duration={500}>
            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <IconShieldLock
                  className="size-4 text-leaf"
                  strokeWidth={1.85}
                />
                JWT Auth
              </span>
              <span className="flex items-center gap-1.5">
                <IconUsers className="size-4 text-leaf" strokeWidth={1.85} />
                Multi-tenant
              </span>
              <span className="flex items-center gap-1.5">
                <IconDatabase className="size-4 text-leaf" strokeWidth={1.85} />
                PostgreSQL
              </span>
            </div>
          </Reveal>
        </div>

        {/* Hero art card */}
        <Reveal delay={200} duration={600}>
          <div className="glass-card texture-paper highlight-edge relative h-72 overflow-hidden rounded-3xl sm:h-96">
            <FarmScene className="absolute! inset-0 size-full" />
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
            <div className="absolute right-5 bottom-5 left-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-wider text-leaf uppercase">
                  Live overview
                </p>
                <p className="mt-0.5 font-heading text-xl font-bold">
                  5 farms · 10 fields
                </p>
              </div>
              <div className="flex gap-2">
                {heroDots.map((c) => (
                  <span key={c} className={`size-2.5 rounded-full ${c}`} />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Hero;
