import { Reveal, FarmTypeArt, SoilTypeArt } from "@/components/effects";
import {
  IconBuildingWarehouse,
  IconChartDots,
  IconUsers,
  IconLeaf,
  IconArrowUpRight,
  IconDroplet,
  IconBolt,
  IconFlask,
  IconChevronRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: IconBuildingWarehouse,
    title: "Multi-tenant by design",
    desc: "Every farm, field, and crop is scoped to a tenant. Complete data isolation, row-level security, and a single Postgres backend serving many workspaces.",
    accent: "leaf",
    art: <FarmTypeArt variant="greenhouse" className="size-full" />,
    span: "lg:col-span-2",
  },
  {
    icon: IconChartDots,
    title: "Field & crop tracking",
    desc: "Growth stages, pH, EC, soil types, and yields — indoor, outdoor, and greenhouse.",
    accent: "sky",
    art: <SoilTypeArt variant="loam" className="size-full" />,
    span: "lg:col-span-1",
  },
  {
    icon: IconUsers,
    title: "Role-based access",
    desc: "JWT + RBAC: owners, workers, and viewers get exactly the access they need.",
    accent: "clay",
    art: <SoilTypeArt variant="clay" className="size-full" />,
    span: "lg:col-span-1",
  },
  {
    icon: IconLeaf,
    title: "Soil intelligence",
    desc: "Drainage, nutrients, pH ranges, and amendments — built into the lookup library.",
    accent: "wheat",
    art: <SoilTypeArt variant="sandy_loam" className="size-full" />,
    span: "lg:col-span-2",
  },
];

const tenantPreview = [
  { name: "Acme Farms", subdomain: "acme", farms: "5", fields: "18", tone: "bg-leaf/15 text-leaf" },
  { name: "Green Valley", subdomain: "green-valley", farms: "3", fields: "11", tone: "bg-sky-warm/15 text-sky-warm" },
  { name: "Sunset Acres", subdomain: "sunset", farms: "4", fields: "19", tone: "bg-clay/15 text-clay-deep dark:text-clay" },
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

      <div className="mt-14 grid auto-rows-min gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
  const showArt = !!feature.art;
  const artSize = featured ? "h-44 w-44" : "h-28 w-28";

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
      {/* Decorative art bleed (top-right) */}
      {showArt && (
        <div
          className={cn(
            "pointer-events-none absolute -top-3 -right-4 transition-opacity duration-500 group-hover:opacity-90",
            artSize,
            featured ? "opacity-60" : "opacity-40"
          )}
        >
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

        {/* Featured: 2-col layout with tenant list mock on the right */}
        {featured && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-end">
            <div className="flex flex-wrap gap-2">
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
            <TenantList />
          </div>
        )}

        {/* Soil intelligence — compact stat strip */}
        {feature.title === "Soil intelligence" && <SoilReadout />}
      </div>
    </div>
  );
}

function TenantList() {
  return (
    <div className="rounded-xl bg-background/55 p-2 ring-1 ring-foreground/5">
      <div className="flex items-center justify-between px-2 py-1.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
        <span>Workspaces</span>
        <span className="font-mono">3 active</span>
      </div>
      <ul className="space-y-1">
        {tenantPreview.map((t) => (
          <li
            key={t.subdomain}
            className="flex items-center gap-2.5 rounded-lg bg-card/60 px-2.5 py-1.5 transition-colors hover:bg-card"
          >
            <span
              className={cn(
                "flex size-7 shrink-0 items-center justify-center rounded-md text-[10px] font-bold",
                t.tone
              )}
            >
              {t.name.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold tracking-tight">
                {t.name}
              </p>
              <p className="font-mono text-[9px] text-muted-foreground">
                {t.subdomain}.farmdeck.app
              </p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-[10px] font-semibold tabular-nums">
                {t.farms} · {t.fields}
              </p>
              <p className="text-[8px] tracking-wider text-muted-foreground uppercase">
                farms · fields
              </p>
            </div>
            <IconChevronRight
              className="size-3.5 shrink-0 text-muted-foreground/40"
              strokeWidth={1.85}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function SoilReadout() {
  // pH range bar: scale 4.5 (acidic) → 8.5 (alkaline), ideal band 6.0–7.0
  const value = 6.4;
  const min = 4.5;
  const max = 8.5;
  const pct = ((value - min) / (max - min)) * 100;
  const idealStart = ((6.0 - min) / (max - min)) * 100;
  const idealEnd = ((7.0 - min) / (max - min)) * 100;

  return (
    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <SoilStat icon={IconDroplet} label="pH" value="6.4" tone="text-leaf" />
        <SoilStat icon={IconBolt} label="EC" value="1.4" tone="text-sky-warm" />
        <SoilStat
          icon={IconFlask}
          label="Drainage"
          value="Good"
          tone="text-clay-deep dark:text-clay"
        />
      </div>
      <div>
        <div className="relative h-2 overflow-hidden rounded-full bg-muted/60">
          {/* ideal band */}
          <div
            className="absolute inset-y-0 bg-leaf/25"
            style={{ left: `${idealStart}%`, right: `${100 - idealEnd}%` }}
          />
          {/* marker */}
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-leaf bg-background shadow-sm"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] text-muted-foreground">
          <span>4.5</span>
          <span className="text-leaf">ideal 6.0–7.0</span>
          <span>8.5</span>
        </div>
      </div>
    </div>
  );
}

function SoilStat({ icon: Icon, label, value, tone }) {
  return (
    <div className="rounded-lg bg-background/50 px-2 py-2 ring-1 ring-foreground/5">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", tone)} strokeWidth={1.85} />
        <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <p className="mt-0.5 font-heading text-sm font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}
