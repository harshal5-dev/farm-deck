import { Reveal } from "@/components/effects";
import {
  IconApi,
  IconBrandGolang,
  IconBrandReact,
  IconDatabase,
  IconLayoutGrid,
  IconServer,
  IconStack2,
  IconShieldCheck,
  IconRoute,
  IconBolt,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Backend",
    items: [
      { icon: IconBrandGolang, name: "Go", role: "Language" },
      { icon: IconApi, name: "Gin", role: "HTTP framework" },
      { icon: IconRoute, name: "REST API", role: "Type-safe routes" },
      { icon: IconShieldCheck, name: "JWT", role: "Auth + refresh" },
    ],
  },
  {
    label: "Data",
    items: [
      { icon: IconDatabase, name: "PostgreSQL", role: "Database" },
      { icon: IconServer, name: "sqlc", role: "Type-safe SQL" },
    ],
  },
  {
    label: "Frontend",
    items: [
      { icon: IconBrandReact, name: "React 19", role: "UI library" },
      { icon: IconLayoutGrid, name: "shadcn/ui", role: "Component system" },
      { icon: IconBolt, name: "Vite", role: "Build tool" },
      { icon: IconStack2, name: "Redux Toolkit", role: "State + cache" },
    ],
  },
];

const TechStack = () => {
  return (
    <section
      id="stack"
      className="relative border-y border-border/40 bg-card/30 py-20 sm:py-24"
    >
      <div className="absolute inset-0 pattern-contour opacity-25" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal
          trigger="scroll"
          duration={500}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <IconStack2 className="size-3.5" strokeWidth={2} />
            Built with modern tools
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            The tech stack
          </h2>
          <p className="mt-3 text-base text-muted-foreground sm:text-[17px]">
            A pragmatic, type-safe full-stack architecture — built to learn and
            demonstrate real-world patterns.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {groups.map((group, gi) => (
            <Reveal
              key={group.label}
              trigger="scroll"
              delay={gi * 100}
              duration={500}
            >
              <div className="glass-card texture-paper relative h-full overflow-hidden rounded-2xl p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">
                    {group.label}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    0{gi + 1}
                  </span>
                </div>
                <ul className="space-y-2">
                  {group.items.map((t, i) => (
                    <TechRow key={t.name} item={t} index={i} />
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;

function TechRow({ item, index }) {
  const Icon = item.icon;
  return (
    <li
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-transparent bg-background/40 px-3 py-2.5 transition-all duration-200",
        "hover:border-leaf/20 hover:bg-card hover:shadow-sm hover:shadow-leaf/5"
      )}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-leaf/10 text-leaf ring-1 ring-leaf/15 transition-transform group-hover:scale-105">
        <Icon className="size-4.5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold tracking-tight">{item.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {item.role}
        </p>
      </div>
      <span className="font-mono text-[10px] text-muted-foreground/40">
        {String(index).padStart(2, "0")}
      </span>
    </li>
  );
}
