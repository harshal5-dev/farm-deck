
import {
  IconActivity,
  IconBasket,
  IconChartDots,
  IconDroplet,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Reveal, FarmScene } from "@/components/effects";
import { useAuth } from "@/features/auth";

/**
 * The roadmap of dashboard modules that aren't built yet. Each becomes a
 * "Coming soon" card. Accent keys map into `accentMap` below so every card
 * draws from the farm palette.
 */
const roadmap = [
  {
    icon: IconChartDots,
    title: "Farm Analytics",
    desc: "Deep insights into yields, growth cycles, and performance across every growing location.",
    accent: "leaf",
  },
  {
    icon: IconDroplet,
    title: "Field Intelligence",
    desc: "Live pH, EC, and soil-health readings from every active field, refreshed in real time.",
    accent: "sky",
  },
  {
    icon: IconBasket,
    title: "Harvest Planning",
    desc: "Plan crop cycles, schedule harvests, and forecast yields with smart timelines.",
    accent: "wheat",
  },
  {
    icon: IconActivity,
    title: "Team Activity",
    desc: "A unified feed of every action across your farms — who did what, and when.",
    accent: "clay",
  },
];

const accentMap = {
  leaf: {
    chip: "bg-leaf/15 text-leaf ring-leaf/20",
    glow: "bg-leaf/10",
  },
  sky: {
    chip: "bg-sky-warm/15 text-sky-warm ring-sky-warm/20",
    glow: "bg-sky-warm/10",
  },
  wheat: {
    chip: "bg-wheat/20 text-wheat ring-wheat/30",
    glow: "bg-wheat/10",
  },
  clay: {
    chip: "bg-clay/15 text-clay-deep ring-clay/20 dark:text-clay",
    glow: "bg-clay/10",
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* ---------- Welcome header ---------- */}
      <Reveal duration={500}>
        <div className="relative h-60 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-lg shadow-leaf/5 sm:h-64">
          <FarmScene />
          {/* gradient scrim on the left so text reads, scene visible on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent sm:from-card/95 sm:via-card/40" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-card to-transparent" />
          <div className="relative flex h-full flex-col justify-center gap-3 p-6 sm:p-10">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-leaf/30 bg-leaf/15 px-3 py-1 text-xs font-semibold text-leaf backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-leaf" />
              </span>
              Dashboard
            </span>
            <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {firstName} 🌱
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              The dashboard is sprouting. Insights and live monitoring are on
              the roadmap — explore the modules below to see what&rsquo;s
              coming.
            </p>
          </div>
        </div>
      </Reveal>

      {/* ---------- Coming soon cards ---------- */}
      <section>
        <Reveal delay={80} duration={500}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-base font-semibold tracking-tight">
              On the roadmap
            </h2>
            <span className="text-xs text-muted-foreground">In progress</span>
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {roadmap.map((item, i) => (
            <ComingSoonCard key={item.title} item={item} delay={120 + i * 80} />
          ))}
        </div>
      </section>
    </div>
  );
}

/**
 * ComingSoonCard — a themed placeholder for an unbuilt dashboard module.
 * Shows the icon, title, description, and a "Coming soon" pill.
 */
function ComingSoonCard({ item, delay }) {
  const meta = accentMap[item.accent];
  const Icon = item.icon;

  return (
    <Reveal delay={delay} duration={500}>
      <div className="glass-card texture-paper group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/10">
        {/* hover glow */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute -top-12 -right-8 size-32 rounded-full opacity-60 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-90",
            meta.glow
          )}
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
                meta.chip
              )}
            >
              <Icon className="size-6" strokeWidth={1.7} />
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/50 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              <span className="size-1.5 rounded-full bg-wheat" />
              Coming soon
            </span>
          </div>

          <h3 className="mt-5 font-heading text-lg font-bold tracking-tight">
            {item.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {item.desc}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
