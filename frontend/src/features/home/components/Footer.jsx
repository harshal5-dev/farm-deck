import { Link } from "react-router-dom";
import {
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import Logo from "@/components/layout/Logo";
import {
  GITHUB_PROFILE_URL,
  LINKEDIN_URL,
  REPO_URL,
} from "../constants";

const Footer = ({ appLink, isAuthenticated = false }) => {
  const authLink = isAuthenticated
    ? { to: "/app", label: "Dashboard" }
    : { to: "/login", label: "Sign in" };

  return (
    <footer className="relative border-t border-border/40 bg-card/30">
      <div className="absolute inset-0 pattern-contour opacity-20" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to={appLink} className="inline-flex items-center gap-2.5">
              <Logo variant="mark" className="size-7" />
              <span className="text-base font-bold tracking-tight">
                Farm
                <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
                  deck
                </span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A full-stack portfolio project for modern, multi-workspace farm
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
                  to={authLink.to}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {authLink.label}
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
                  href={REPO_URL}
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

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Farmdeck · Built with Go, Gin,
            PostgreSQL & React
          </p>
          <div className="flex items-center gap-1">
            <a
              href={GITHUB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <IconBrandGithub className="size-4" strokeWidth={1.85} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              className="flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              <IconBrandLinkedin className="size-4" strokeWidth={1.85} />
            </a>
            <p className="ml-3 font-mono">portfolio.project</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
