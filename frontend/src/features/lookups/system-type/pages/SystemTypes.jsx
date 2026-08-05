import { Link } from "react-router-dom"
import {
  IconArrowLeft,
  IconDroplet,
  IconBolt,
  IconWind,
  IconAlertTriangle,
  IconLeaf,
  IconCircleOff,
  IconSettings,
  IconPuzzle,
  IconCoin,
  IconUsers,
  IconGauge,
  IconWashMachine,
} from "@tabler/icons-react"
import { systemTypes } from "@/mocks"
import { cn } from "@/lib/utils"
import { useMockLoading } from "@/hooks/use-mock-loading"
import { Badge } from "@/components/ui/badge"
import { Reveal, SystemTypeArt, SoilTypeCardSkeleton } from "@/components/effects"
import LevelMeter, { levelMeta } from "@/components/effects/LevelMeter"
import ResourceExplorer from "@/components/layout/ResourceExplorer"

const meta = {
  sky: { gradient: "from-sky-warm/25 via-sky-warm/10 to-transparent", bg: "bg-sky-warm/15", text: "text-sky-warm" },
  leaf: { gradient: "from-leaf/25 via-leaf/10 to-transparent", bg: "bg-leaf/15", text: "text-leaf" },
  wheat: { gradient: "from-wheat/25 via-wheat/10 to-transparent", bg: "bg-wheat/20", text: "text-wheat" },
  clay: { gradient: "from-clay/25 via-clay/10 to-transparent", bg: "bg-clay/15", text: "text-clay" },
  violet: { gradient: "from-violet-500/25 via-violet-500/10 to-transparent", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
}

function InfoBlock({ label, value, icon: Icon, chip = "bg-muted/50", text = "text-muted-foreground" }) {
  return (
    <div className="rounded-xl p-2">
      <div className="flex items-center gap-2">
        <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md", chip)}>
          <Icon className={cn("size-3.5", text)} strokeWidth={2} />
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</span>
      </div>
      <p className="mt-1 pl-8 text-[12.5px] leading-relaxed text-muted-foreground">{value}</p>
    </div>
  )
}

function SystemTypeCard({ type }) {
  const m = meta[type.color] || meta.sky

  const requirements = [
    { label: "Water Pump", value: type.pumpRequired, icon: IconWashMachine, on: "Required", off: "Not needed" },
    { label: "Air Pump", value: type.airPumpRequired, icon: IconWind, on: "Required", off: "Not needed" },
  ]

  return (
    <div className="glass-card texture-paper highlight-edge group relative overflow-hidden rounded-2xl py-0 transition-shadow duration-200 hover:shadow-xl">
      {/* Art banner */}
      <div className="relative h-28 overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", m.gradient)} />
        <SystemTypeArt variant={type.name} className="relative size-full" />
        {/* icon chip */}
        <div className={cn("absolute -bottom-5 left-5 flex size-12 items-center justify-center rounded-2xl ring-4 ring-card", m.bg)}>
          <IconDroplet className={cn("size-6", m.text)} strokeWidth={1.7} />
        </div>
        {/* flow tag */}
        <Badge className="absolute right-3 top-3 bg-background/70 px-2.5 py-0.5 text-[10px] font-bold capitalize text-foreground backdrop-blur-sm">
          {type.waterFlowType} flow
        </Badge>
      </div>

      <div className="px-5 pb-4 pt-8">
        <h3 className="font-heading text-lg font-bold tracking-tight">{type.displayName}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{type.description}</p>

        {/* meters */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <LevelMeter label="Maintenance" value={type.maintenanceLevel} icon={IconSettings} />
          <LevelMeter label="Setup" value={type.setupComplexity} icon={IconPuzzle} />
          <LevelMeter label="Cost" value={type.costLevel} icon={IconCoin} />
          <LevelMeter label="Failure Risk" value={type.failureRisk} icon={IconAlertTriangle} />
        </div>

        {/* requirements row */}
        <div className="mt-3 flex flex-wrap gap-2">
          {requirements.map((r) => {
            const on = !!r.value
            const Icon = r.icon
            return (
              <span
                key={r.label}
                className={cn(
                  "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold",
                  on ? "bg-leaf/15 text-leaf" : "bg-muted/60 text-muted-foreground"
                )}
              >
                <Icon className="size-3" strokeWidth={2} />
                {r.label}: {on ? r.on : r.off}
              </span>
            )
          })}
          <span className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            <IconGauge className="size-3" strokeWidth={2} />
            Failure in {type.failureWindowHours}
          </span>
        </div>

        {/* density */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <IconUsers className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Density</p>
              <p className="text-xs font-bold">{type.plantsPerSqMeter}/m²</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <IconDroplet className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Reservoir</p>
              <p className="text-xs font-bold">{type.typicalReservoirSize}</p>
            </div>
          </div>
        </div>

        {/* info blocks */}
        <div className="mt-4 space-y-2">
          <InfoBlock label="How It Works" value={type.howItWorks} icon={IconBolt} chip="bg-sky-warm/15" text="text-sky-warm" />
          <InfoBlock label="Ideal Crops" value={type.idealCrops} icon={IconLeaf} chip="bg-leaf/15" text="text-leaf" />
          <InfoBlock label="Not Suitable" value={type.unsuitableCrops} icon={IconCircleOff} chip="bg-clay/15" text="text-clay" />
        </div>
      </div>
    </div>
  )
}

export default function SystemTypes() {
  const loading = useMockLoading(700)

  const renderListItem = ({ item, active, onSelect }) => {
    const m = meta[item.color] || meta.sky
    return (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
          active ? "bg-leaf/10 ring-1 ring-inset ring-leaf/20" : "hover:bg-muted/50"
        )}
      >
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", m.bg)}>
          <IconDroplet className={cn("size-5", m.text)} strokeWidth={1.85} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm font-semibold", active ? "text-foreground" : "text-foreground/80")}>
            {item.displayName?.split(" (")[0] || item.name}
          </p>
          <p className="truncate text-[11px] capitalize text-muted-foreground">
            {item.waterFlowType} flow · {item.setupComplexity} setup
          </p>
        </div>
        {active && <span className="size-2 shrink-0 rounded-full bg-leaf" />}
      </button>
    )
  }

  return (
    <div className="space-y-6">
      <Reveal duration={450}>
        <div>
          <Link
            to="/app/farms"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft className="size-4" strokeWidth={1.75} />
            Back to Farms
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sky-warm/15 text-sky-warm ring-1 ring-inset ring-sky-warm/20">
                <IconDroplet className="size-6" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">Grow Systems</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse all hydroponic methods on the left — click any to see its
                  full profile. No scrolling required.
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              {systemTypes.length} systems
            </span>
          </div>
        </div>
      </Reveal>

      <ResourceExplorer
        items={systemTypes}
        isLoading={loading}
        skeletonCount={6}
        renderListItem={renderListItem}
        renderDetail={(item) => <SystemTypeCard type={item} />}
        ListSkeleton={() => (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="size-9 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}
        DetailSkeleton={() => <SoilTypeCardSkeleton />}
        emptyState="No grow systems found."
      />
    </div>
  )
}
