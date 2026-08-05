import { useAuth } from "@/features/auth";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import TechStack from "../components/TechStack";
import About from "../components/About";
import FarmMark from "../components/FarmMark";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const appLink = isAuthenticated ? "/app" : "/login";

  return (
    <div className="relative min-h-svh bg-background">
      {/* Decorative background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
        <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
        <div className="pattern-contour absolute inset-0 opacity-40" />
      </div>

      {/* Nav */}
      <Header appLink={appLink} isAuthenticated={isAuthenticated} />

      <main className="relative">
        {/* Hero */}
        <Hero appLink={appLink} isAuthenticated={isAuthenticated} />

        {/* Features */}
        <Feature />

        {/* Tech Stack */}
        <TechStack />

        {/* About / Highlights */}
        <About appLink={appLink} isAuthenticated={isAuthenticated} />
      </main>

      {/* Footer */}
      <footer className="relative border-t border-border/40 bg-card/30">
        <div className="absolute inset-0 pattern-contour opacity-20" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <Link to={appLink} className="inline-flex items-center gap-2.5">
                <div className="size-7">
                  <FarmMark />
                </div>
                <span className="text-base font-bold tracking-tight">
                  Farm
                  <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                    deck
                  </span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                A full-stack portfolio project for modern, multi-tenant farm
                management.
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Explore
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#stack"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Tech stack
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    About
                  </a>
                </li>
                <li>
                  <Link
                    to={isAuthenticated ? "/app" : "/login"}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {isAuthenticated ? "Dashboard" : "Sign in"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Source
              </h4>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a
                    href="https://github.com/harshal5-dev/farm-deck"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    GitHub repository →
                  </a>
                </li>
                <li>
                  <span className="text-muted-foreground/70">
                    MIT-licensed · v1.0
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {new Date().getFullYear()} Farmdeck · Built with Go, Gin,
              PostgreSQL & React
            </p>
            <p className="font-mono">portfolio.project</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
