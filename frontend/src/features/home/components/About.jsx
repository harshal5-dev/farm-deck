import { Reveal } from "@/components/effects";
import { Button } from "@/components/ui/button";
import {
  IconArrowRight,
  IconBrandGithub,
  IconCheck,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";

const highlights = [
  "Type-safe SQL with sqlc",
  "JWT authentication & refresh",
  "Row-level tenant isolation",
  "RESTful API design",
  "Optimistic UI updates",
  "Dark / light theming",
];

const About = ({ appLink, isAuthenticated }) => {
  return (
    <>
      <section
        id="about"
        className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
      >
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal trigger="scroll" duration={500}>
            <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              A portfolio built to showcase
            </h2>
            <p className="mt-4 text-muted-foreground">
              Farmdeck demonstrates end-to-end system design: a Go + Gin REST
              API backed by PostgreSQL with sqlc-generated type-safe queries,
              secure multi-tenant data isolation, and a polished React +
              shadcn/ui frontend. It&apos;s a study in clean architecture,
              separation of concerns, and developer experience.
            </p>
            <p className="mt-3 text-muted-foreground">
              This is a personal project by{" "}
              <span className="font-semibold text-foreground">Harshal</span> —
              built to learn and demonstrate real-world full-stack engineering.
            </p>
            <a
              href="https://github.com/harshal5-dev/farm-deck"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-leaf hover:underline"
            >
              <IconBrandGithub className="size-4" strokeWidth={1.85} />
              Explore the repository
            </a>
          </Reveal>

          <Reveal trigger="scroll" delay={120} duration={500}>
            <div className="glass-card texture-paper rounded-2xl p-6">
              <h3 className="font-heading text-lg font-bold tracking-tight">
                Engineering highlights
              </h3>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2.5 text-sm">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf">
                      <IconCheck className="size-3" strokeWidth={2.5} />
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <Reveal trigger="scroll" duration={600}>
          <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="absolute inset-0 bg-linear-to-br from-leaf/10 to-transparent" />
            <div className="relative">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to grow? 🌱
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Explore the dashboard with a demo account — no setup required.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to={appLink}>
                  <Button size="lg" className="gap-2">
                    {isAuthenticated ? "Open Dashboard" : "Explore the demo"}
                    <IconArrowRight className="size-4" strokeWidth={2.2} />
                  </Button>
                </Link>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
};

export default About;
