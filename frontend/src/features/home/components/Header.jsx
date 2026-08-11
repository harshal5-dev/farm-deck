import ThemeToggle from "@/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconMenu2,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import FarmMark from "./FarmMark";
import { navLinks, REPO_URL } from "../constants";
import { useActiveSection } from "../useActiveSection";


const Header = ({ isAuthenticated }) => {
  const [open, setOpen] = useState(false);
  const activeId = useActiveSection();

  useEffect(() => {
    if (open && typeof window !== "undefined") {
      const onResize = () => {
        if (window.matchMedia("(min-width: 768px)").matches) setOpen(false);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, [open]);

  const handleLogoClick = () => {
    setOpen(false);
    if (typeof window === "undefined") return;

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="glass sticky top-0 z-30 border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={handleLogoClick}
          className="group flex items-center gap-2.5 rounded-md transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-95"
          aria-label="Farmdeck home — back to top"
        >
          <div className="size-8 transition-transform duration-300 group-hover:rotate-[-8deg]">
            <FarmMark />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Farm<span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">deck</span>
          </span>
        </button>
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
          {navLinks.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-1.5 transition-colors",
                  isActive
                    ? "text-foreground"
                    : "hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-linear-to-r from-leaf to-sage-deep" />
                )}
              </a>
            );
          })}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground sm:inline-flex"
          >
            <IconStar
              className="size-3.5 text-wheat"
              strokeWidth={2}
              fill="currentColor"
            />
            Star
            <IconBrandGithub className="size-3.5" strokeWidth={1.85} />
          </a>
          <ThemeToggle />
          {isAuthenticated ? (
            <Link to="/app">
              <Button size="sm" className="gap-1.5">
                Dashboard <IconArrowRight className="size-4" strokeWidth={2} />
              </Button>
            </Link>
          ) : (
            <Link to="/login" className="hidden sm:block">
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
            </Link>
          )}
          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground md:hidden"
          >
            {open ? (
              <IconX className="size-5" strokeWidth={1.85} />
            ) : (
              <IconMenu2 className="size-5" strokeWidth={1.85} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-border/40 bg-card/95 backdrop-blur md:hidden"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {navLinks.map((item) => {
              const isActive = activeId === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-leaf/10 text-leaf"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="size-1.5 rounded-full bg-leaf" aria-hidden />
                  )}
                </a>
              );
            })}
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <IconStar
                className="size-3.5 text-wheat"
                strokeWidth={2}
                fill="currentColor"
              />
              Star on GitHub
              <IconBrandGithub className="size-3.5" strokeWidth={1.85} />
            </a>
            <div className="mt-1 border-t border-border/40 pt-2">
              {isAuthenticated ? (
                <Link to="/app" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full gap-1.5">
                    Dashboard <IconArrowRight className="size-4" strokeWidth={2} />
                  </Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Sign in
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
