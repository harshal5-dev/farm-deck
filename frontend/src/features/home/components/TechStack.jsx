import { Reveal } from "@/components/effects";
import {
  IconApi,
  IconBrandGolang,
  IconBrandReact,
  IconDatabase,
  IconLayoutGrid,
  IconServer,
} from "@tabler/icons-react";

const techStack = [
  { icon: IconBrandGolang, name: "Go", role: "Backend language" },
  { icon: IconApi, name: "Gin", role: "HTTP framework" },
  { icon: IconDatabase, name: "PostgreSQL", role: "Database" },
  { icon: IconServer, name: "sqlc", role: "Type-safe SQL" },
  { icon: IconBrandReact, name: "React", role: "UI library" },
  { icon: IconLayoutGrid, name: "shadcn/ui", role: "Component system" },
];

const TechStack = () => {
  return (
    <section id="stack" className="border-y border-border/40 bg-card/40">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
        <Reveal
          trigger="scroll"
          duration={500}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <IconServer className="size-3.5" strokeWidth={2} />
            Built with modern tools
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            The tech stack
          </h2>
          <p className="mt-3 text-muted-foreground">
            A pragmatic, type-safe full-stack architecture.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {techStack.map((t, i) => {
            const Icon = t.icon;
            return (
              <Reveal
                key={t.name}
                trigger="scroll"
                delay={i * 70}
                duration={450}
              >
                <div className="glass-card flex flex-col items-center rounded-2xl p-5 text-center transition-shadow duration-200 hover:shadow-md hover:shadow-leaf/10">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-leaf/10 text-leaf">
                    <Icon className="size-6" strokeWidth={1.7} />
                  </div>
                  <p className="mt-3 text-sm font-bold">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground">{t.role}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
