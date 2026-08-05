import ThemeToggle from "@/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import FarmMark from "./FarmMark";

const Header = ({ appLink, isAuthenticated }) => {
  return (
    <header className="glass sticky top-0 z-30 border-b border-border/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to={appLink}
          className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02] active:scale-95"
        >
          <div className="size-8">
            <FarmMark />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Farm<span className="text-leaf">deck</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a
            href="#features"
            className="transition-colors hover:text-foreground"
          >
            Features
          </a>
          <a href="#stack" className="transition-colors hover:text-foreground">
            Tech Stack
          </a>
          <a href="#about" className="transition-colors hover:text-foreground">
            About
          </a>
        </nav>
        <div className="flex items-center gap-2">
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
