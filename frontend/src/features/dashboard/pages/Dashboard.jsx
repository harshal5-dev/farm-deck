import {
  IconPlant,
  IconChartDots,
  IconArrowsMoveVertical,
  IconChecklist,
  IconDroplet,
  IconLeaf,
  IconFlower,
  IconBasket,
  IconActivity,
  IconTrendingUp,
  IconArrowUpRight,
} from "@tabler/icons-react"
import { stats, recentActivity } from "@/mocks"
import { cn } from "@/lib/utils"
import {
  Reveal,
  AnimatedCounter,
  AnimatedBar,
  FarmScene,
} from "@/components/effects"

const statMeta = {
  farms: {
    icon: IconPlant,
    text: "text-leaf",
    chip: "from-leaf/20 to-leaf/5 text-leaf",
    glow: "bg-leaf/15",
  },
  fields: {
    icon: IconChartDots,
    text: "text-sky-warm",
    chip: "from-sky-warm/20 to-sky-warm/5 text-sky-warm",
    glow: "bg-sky-warm/15",
  },
  area: {
    icon: IconArrowsMoveVertical,
    text: "text-clay-deep dark:text-clay",
    chip: "from-clay/20 to-clay/5 text-clay-deep dark:text-clay",
    glow: "bg-clay/15",
  },
  crops: {
    icon: IconChecklist,
    text: "text-wheat",
    chip: "from-wheat/25 to-wheat/5 text-wheat",
    glow: "bg-wheat/20",
  },
}

function StatCard({ metaKey, label, value, format, subtitle, trend, delay }) {
  const meta = statMeta[metaKey]
  const Icon = meta.icon

  return (
    <Reveal delay={delay} duration={500}>
      <div className="glass-card texture-paper highlight-edge group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/15">
        {/* Hover wash */}
        <div
          className={cn(
            "absolute -right-10 -top-10 size-32 rounded-full opacity-50 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:opacity-90",
            meta.glow
          )}
        />
        <div className="relative flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="mt-2 flex items-end gap-1.5">
              <span className="font-heading text-3xl font-semibold tracking-tight tabular-nums">
                <AnimatedCounter
                  value={value}
                  duration={1000}
                  format={format}
                />
              </span>
            </div>
            {subtitle && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                {trend && (
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-500/10 px-1.5 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                    <IconArrowUpRight className="size-3" strokeWidth={2.2} />
                    {trend}
                  </span>
                )}
                {subtitle}
              </p>
            )}
          </div>
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ring-1 ring-inset ring-white/10 dark:ring-white/5",
              meta.chip
            )}
          >
            <Icon className={cn("size-5", meta.text)} strokeWidth={1.75} />
          </div>
        </div>
      </div>
    </Reveal>
  )
}

const activityMeta = {
  harvest: { Icon: IconBasket, text: "text-wheat", bg: "bg-wheat/15" },
  plant: { Icon: IconLeaf, text: "text-leaf", bg: "bg-leaf/15" },
  ph: { Icon: IconDroplet, text: "text-sky-warm", bg: "bg-sky-warm/15" },
  status: { Icon: IconFlower, text: "text-clay", bg: "bg-clay/15" },
}

function ActivityItem({ activity }) {
  const { Icon, text, bg } = activityMeta[activity.type] || activityMeta.status

  return (
    <div className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted/50">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-110",
          bg
        )}
      >
        <Icon className={cn("size-4", text)} strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug">{activity.message}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {activity.farm} &middot; {activity.time}
        </p>
      </div>
    </div>
  )
}

function HealthRow({ label, value, max, color, delay }) {
  const pct = Math.min((value / max) * 100, 100)

  return (
    <Reveal delay={delay} duration={500}>
      <div className="flex items-center gap-3">
        <span className="w-24 shrink-0 text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <AnimatedBar pct={pct} color={color} />
        <span className="w-10 text-right text-xs font-semibold tabular-nums">
          {value}
        </span>
      </div>
    </Reveal>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Illustrated landscape hero */}
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
              All systems operational
            </span>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
              Your Harvest Awaits 🌾
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground">
              Welcome back — your fields are thriving. Here's today's overview
              across all your growing locations.
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          metaKey="farms"
          label="Total Farms"
          value={stats.totalFarms}
          subtitle={`${stats.activeFarms} active`}
          trend="100%"
          delay={60}
        />
        <StatCard
          metaKey="fields"
          label="Active Fields"
          value={stats.activeFields}
          subtitle={`of ${stats.totalFields} total`}
          delay={130}
        />
        <StatCard
          metaKey="area"
          label="Total Area"
          value={stats.totalArea / 1000}
          format={(n) => `${n.toFixed(1)}k`}
          subtitle="sq ft across all farms"
          delay={200}
        />
        <StatCard
          metaKey="crops"
          label="Crops Growing"
          value={stats.cropsInProgress}
          subtitle={`${stats.harvestedThisMonth} harvested this month`}
          delay={270}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal delay={120} duration={500} className="lg:col-span-2">
          <div className="glass-card texture-paper h-full rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconTrendingUp
                  className="size-5 text-leaf"
                  strokeWidth={1.75}
                />
                <h2 className="font-heading text-base font-semibold">
                  Farm Health Overview
                </h2>
              </div>
              <span className="text-xs text-muted-foreground">Live</span>
            </div>
            <div className="mt-6 space-y-4">
              <HealthRow
                label="pH Level"
                value={stats.averagePh}
                max={8}
                color="bg-gradient-to-r from-leaf to-sage-deep"
                delay={180}
              />
              <HealthRow
                label="EC (mS/cm)"
                value={stats.averageEc}
                max={3}
                color="bg-gradient-to-r from-sky-warm to-sky-warm"
                delay={250}
              />
              <HealthRow
                label="Active Crops"
                value={stats.cropsInProgress}
                max={12}
                color="bg-gradient-to-r from-wheat to-clay"
                delay={320}
              />
              <HealthRow
                label="Harvests"
                value={stats.harvestedThisMonth}
                max={10}
                color="bg-gradient-to-r from-clay to-clay-deep"
                delay={390}
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={200} duration={500}>
          <div className="glass-card texture-paper h-full rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconActivity
                  className="size-5 text-leaf"
                  strokeWidth={1.75}
                />
                <h2 className="font-heading text-base font-semibold">
                  Recent Activity
                </h2>
              </div>
            </div>
            <div className="mt-4 -mx-3 space-y-0.5">
              {recentActivity.map((a, i) => (
                <Reveal
                  key={a.id}
                  delay={280 + i * 70}
                  duration={400}
                  changeKey={a.id}
                >
                  <ActivityItem activity={a} />
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
