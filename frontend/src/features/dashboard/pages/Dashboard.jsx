
import {
  IconActivity,
  IconBasket,
  IconChartDots,
  IconDroplet,
} from "@tabler/icons-react";
import { Reveal, FarmScene } from "@/components/effects";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth";
import ComingSoonCard from "../components/ComingSoonCard";

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

const Dashboard = () => {
  const user = useSelector(selectUser);
  const firstName = user?.fullName?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* ---------- Welcome header ---------- */}
      <Reveal duration={500}>
        <div className="relative h-60 overflow-hidden rounded-3xl border border-border/50 bg-card shadow-lg shadow-leaf/5 sm:h-64">
          <FarmScene />
          {/* gradient scrim on the left so text reads, scene visible on right */}
          <div className="absolute inset-0 bg-linear-to-r from-card via-card/80 to-transparent sm:from-card/95 sm:via-card/40" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-card to-transparent" />
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

export default Dashboard;
