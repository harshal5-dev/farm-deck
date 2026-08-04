import { useAuth } from "@/auth";
import Header from "./Header";
import Hero from "./Hero";
import Feature from "./Feature";
import TechStack from "./TechStack";
import About from "./About";
import FarmMark from "./FarmMark";

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
      <footer className="border-t border-border/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <div className="size-6">
              <FarmMark />
            </div>
            <span>Farmdeck · Portfolio Project</span>
          </div>
          <p>
            Built with Go, Gin, PostgreSQL & React · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
