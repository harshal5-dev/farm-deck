import { Reveal, FarmTypeArt, FieldPlot } from "@/components/effects";
import {
  IconBuildingWarehouse,
  IconChartDots,
  IconUsers,
  IconLeaf,
  IconArrowUpRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: IconBuildingWarehouse,
    title: "Multi-tenant by design",
    desc: "Every farm, field, and crop is scoped to a tenant. Complete data isolation, row-level security, and a single Postgres backend serving many workspaces.",
    accent: "leaf",
    art: <FarmTypeArt variant="greenhouse" className="size-full" />,
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    icon: IconChartDots,
    title: "Field & crop tracking",
    desc: "Growth stages, pH, EC, soil types, and yields — indoor, outdoor, and greenhouse.",
    accent: "sky",
    span: "lg:col-span-1",
  },
  {
    icon: IconUsers,
    title: "Role-based access",
    desc: "JWT + RBAC: owners, workers, and viewers get exactly the access they need.",
    accent: "clay",
    span: "lg:col-span-1",
  },
  {
    icon: IconLeaf,
    title: "Soil intelligence",
    desc: "Drainage, nutrients, pH ranges, and amendments — built into the lookup library.",
    accent: "wheat",
    span: "lg:col-span-2",
  },
];

const accentMap = {
  leaf: {
    icon: "bg-leaf/15 text-leaf",
    chip: "bg-leaf/10 text-leaf border-leaf/20",
    glow: "from-leaf/20",
  },
  sky: {
    icon: "bg-sky-warm/15 text-sky-warm",
    chip: "bg-sky-warm/10 text-sky-warm border-sky-warm/20",
    glow: "from-sky-warm/20",
  },
  clay: {
    icon: "bg-clay/15 text-clay-deep dark:text-clay",
    chip: "bg-clay/10 text-clay-deep border-clay/20 dark:text-clay",
    glow: "from-clay/20",
  },
  wheat: {
    icon: "bg-wheat/20 text-wheat",
    chip: "bg-wheat/15 text-wheat border-wheat/30",
    glow: "from-wheat/25",
  },
};

const Feature = () => {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
    >
      <Reveal
        trigger="scroll"
        duration={500}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf">
          What's inside
        </span>
        <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Everything your farm needs.
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-[17px]">
          A complete backend and frontend built to demonstrate real-world,
          production-style architecture.
        </p>
      </Reveal>

      <div className="mt-14 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <Reveal
            key={f.title}
            trigger="scroll"
            delay={i * 80}
            duration={500}
            className={cn("h-full", f.span)}
          >
            <FeatureCard feature={f} featured={i === 0} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Feature;

function FeatureCard({ feature, featured }) {
  const meta = accentMap[feature.accent];
  const Icon = feature.icon;

  return (
    <div
      className={cn(
        "glass-card texture-paper group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl hover:shadow-foreground/5",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-linear-to-br before:via-transparent before:to-transparent",
        meta.glow,
        "before:to-transparent"
      )}
    >
      {/* Featured art (only on the big card) */}
      {featured && feature.art && (
        <div className="pointer-events-none absolute -top-2 -right-6 h-44 w-44 opacity-50 transition-opacity duration-500 group-hover:opacity-90 sm:h-56 sm:w-56">
          <div className="absolute inset-0 bg-linear-to-br to-transparent blur-2xl" />
          <div className="relative h-full w-full">{feature.art}</div>
        </div>
      )}

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div
            className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/10 ring-inset dark:ring-white/5",
              meta.icon
            )}
          >
            <Icon className="size-6" strokeWidth={1.7} />
          </div>
          <IconArrowUpRight
            className="size-5 text-muted-foreground/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground/60"
            strokeWidth={1.75}
          />
        </div>

        <h3
          className={cn(
            "mt-5 font-heading font-bold tracking-tight",
            featured ? "text-2xl" : "text-lg"
          )}
        >
          {feature.title}
        </h3>
        <p
          className={cn(
            "mt-2 leading-relaxed text-muted-foreground",
            featured ? "text-[15px] sm:max-w-md" : "text-sm"
          )}
        >
          {feature.desc}
        </p>

        {/* Mini field plot for the soil intelligence card */}
        {feature.title === "Soil intelligence" && (
          <div className="mt-5 flex items-center gap-2">
            <FieldPlot
              className="h-12 flex-1 rounded-lg"
              cols={5}
              statuses={["growing", "seeding", "flowering", "growing", "harvested"]}
            />
            <div className="rounded-lg bg-muted/60 px-2.5 py-2 font-mono text-[10px] text-muted-foreground">
              pH 6.2 · EC 1.4
            </div>
          </div>
        )}

        {featured && (
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Tenant-scoped",
              "Row-level security",
              "Audit log",
              "Workspace switcher",
            ].map((tag) => (
              <span
                key={tag}
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase",
                  meta.chip
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
