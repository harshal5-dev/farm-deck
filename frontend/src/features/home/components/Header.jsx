import ThemeToggle from "@/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { IconArrowRight, IconBrandGithub, IconStar } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import FarmMark from "./FarmMark";

const Header = ({ appLink, isAuthenticated }) => {
  return (
    <header className="glass sticky top-0 z-30 border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          to={appLink}
          className="group flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          <div className="size-8 transition-transform duration-300 group-hover:rotate-[-8deg]">
            <FarmMark />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Farm<span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">deck</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-medium text-muted-foreground md:flex">
          {[
            { href: "#features", label: "Features" },
            { href: "#stack", label: "Tech" },
            { href: "#about", label: "About" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-1.5 transition-all hover:bg-muted/60 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <a
            href="https://github.com/harshal5-dev/farm-deck"
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
        </div>
      </div>
    </header>
  );
};

export default Header;
