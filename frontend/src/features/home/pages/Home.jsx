import Header from "../components/Header";
import Hero from "../components/hero/Hero";
import Feature from "../components/feature/Feature";
import TechStack from "../components/tech-stack/TechStack";
import About from "../components/about/About";
import Footer from "../components/Footer";

const Home = () => {
  const appLink = "/login";

  return (
    <div className="relative min-h-svh bg-background">
      {/* Skip link for keyboard / screen-reader users */}
      <a
        href="#main"
        className="sr-only z-50 rounded-md bg-background px-4 py-2 text-sm font-semibold text-foreground ring-1 ring-border focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
      >
        Skip to content
      </a>

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
      <Header />

      <main id="main" className="relative scroll-mt-20">
        {/* Hero */}
        <Hero appLink={appLink} />

        {/* Features */}
        <Feature />

        {/* Tech Stack */}
        <TechStack />

        {/* About / Highlights */}
        <About appLink={appLink} />
      </main>

      {/* Footer */}
      <Footer appLink={appLink} />
    </div>
  );
};

export default Home;
