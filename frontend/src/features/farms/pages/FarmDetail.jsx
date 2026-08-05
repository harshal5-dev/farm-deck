import { useParams, Link } from "react-router-dom"
import {
  IconArrowLeft,
  IconPlant,
  IconMapPin,
  IconArrowsMoveVertical,
  IconChartDots,
  IconDroplet,
  IconSun,
  IconBuildingWarehouse,
  IconArrowsExchange,
  IconBuilding,
  IconLeaf,
  IconSeeding,
  IconFlower,
  IconBasket,
  IconCircleCheck,
  IconCircleX,
  IconCircleOff,
  IconChevronRight,
  IconEdit,
  IconCalendar,
} from "@tabler/icons-react"
import { farms, fields } from "@/mocks"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Reveal, AnimatedCounter, FarmTypeArt } from "@/components/effects"

const typeMeta = {
  outdoor: {
    icon: IconSun,
    color: "amber",
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  greenhouse: {
    icon: IconBuildingWarehouse,
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  mixed: {
    icon: IconArrowsExchange,
    color: "violet",
    gradient: "from-violet-500/20 via-violet-400/10 to-transparent",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  indoor: {
    icon: IconBuilding,
    color: "sky",
    gradient: "from-sky-500/20 via-sky-400/10 to-transparent",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
  },
}

const statusMeta = {
  seeding: { icon: IconSeeding, label: "Seeding", color: "sky", bg: "bg-sky-500/10", text: "text-sky-600 dark:text-sky-400" },
  growing: { icon: IconLeaf, label: "Growing", color: "emerald", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  flowering: { icon: IconFlower, label: "Flowering", color: "violet", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  harvested: { icon: IconBasket, label: "Harvested", color: "amber", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400" },
  completed: { icon: IconCircleCheck, label: "Completed", color: "emerald", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400" },
  failed: { icon: IconCircleX, label: "Failed", color: "red", bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400" },
}

function FieldRow({ field, delay = 0 }) {
  const status = field.status ? statusMeta[field.status] : null
  const StatusIcon = status?.icon

  return (
    <Reveal delay={delay} duration={400} changeKey={field.id}>
      <div className="group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/50 hover:shadow-sm">
      <div className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", status ? status.bg : "bg-muted")}>
        {status ? (
          <StatusIcon className={cn("size-4", status.text)} strokeWidth={1.75} />
        ) : (
          <IconCircleOff className="size-4 text-muted-foreground" strokeWidth={1.75} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{field.name}</p>
        <p className="text-xs text-muted-foreground">
          {field.cropName || "No active crop"}
          {field.soilType && ` · ${field.soilType}`}
        </p>
      </div>
      <div className="hidden sm:block">
        <span className="text-sm tabular-nums">{field.area.toLocaleString()}</span>
        <span className="ml-1 text-xs text-muted-foreground">sq ft</span>
      </div>
      <div>
        {status ? (
          <Badge variant={status.color}>
            <StatusIcon className="size-3" strokeWidth={1.75} />
            {status.label}
          </Badge>
        ) : (
          <Badge variant="secondary" className="gap-1">
            <IconCircleOff className="size-3" strokeWidth={1.75} />
            Inactive
          </Badge>
        )}
      </div>
      </div>
    </Reveal>
  )
}

export default function FarmDetail() {
  const { farmId } = useParams()
  const farm = farms.find((f) => f.id === farmId)
  const farmFields = fields.filter((f) => f.farmId === farmId)

  if (!farm) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <IconPlant
          className="size-12 text-muted-foreground/40"
          strokeWidth={1.5}
        />
        <p className="mt-4 text-muted-foreground">Farm not found.</p>
        <Link
          to="/app/farms"
          className="mt-2 text-sm font-medium text-emerald-500 hover:underline"
        >
          Back to Farms
        </Link>
      </div>
    )
  }

  const meta = typeMeta[farm.farmType] || typeMeta.outdoor
  const TypeIcon = meta.icon
  const activeCount = farmFields.filter((f) => f.isActive).length

  return (
    <div className="space-y-8">
      <Reveal duration={400}>
        <Link
          to="/app/farms"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft className="size-4" strokeWidth={1.75} />
          Back to Farms
        </Link>
      </Reveal>

      <Reveal delay={80} duration={500}>
        <div className="glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl py-0">
          {/* Illustrated art banner */}
          <div className="relative h-32 overflow-hidden">
            <div className={cn("absolute inset-0 bg-gradient-to-br", meta.gradient)} />
            <FarmTypeArt variant={farm.farmType} className="relative size-full" />
            {/* type tag top-right */}
            <Badge
              variant={meta.color}
              className="absolute right-3 top-3 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm"
            >
              {farm.farmType}
            </Badge>
          </div>

          <div className="relative px-6 pb-6">
            {/* Overlapping type icon chip */}
            <div
              className={cn(
                "absolute -top-7 left-6 flex size-14 items-center justify-center rounded-2xl shadow-lg ring-4 ring-card",
                meta.bg
              )}
            >
              <TypeIcon className={cn("size-7", meta.text)} strokeWidth={1.7} />
            </div>

            {/* Title panel — its own surface with a soft type-derived gradient
                so it reads cleanly in both light & dark themes. */}
            <div
              className={cn(
                "mt-5 rounded-2xl bg-gradient-to-br from-card via-card to-card/80 p-5 pl-20 shadow-sm ring-1 ring-inset ring-border/40 sm:mt-6 sm:p-6",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h1 className="font-heading text-2xl font-bold tracking-tight sm:text-3xl">
                    {farm.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconMapPin className="size-3.5" strokeWidth={1.75} />
                      {farm.location}
                    </span>
                    <span className="hidden h-3 w-px bg-border sm:block" />
                    <span className="flex items-center gap-1">
                      <IconCalendar className="size-3.5" strokeWidth={1.75} />
                      Created{" "}
                      {new Date(farm.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/app/farms/${farm.id}/edit`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background px-3 py-1.5 text-sm font-medium text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-leaf/40 hover:text-leaf hover:shadow-md hover:shadow-leaf/10"
                >
                  <IconEdit className="size-4" strokeWidth={1.85} />
                  Edit
                </Link>
              </div>
            </div>

            {/* Stat cards */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="group flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-leaf/30 hover:shadow-md hover:shadow-leaf/10">
                <span className="flex size-10 items-center justify-center rounded-lg bg-leaf/15 text-leaf">
                  <IconArrowsMoveVertical className="size-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Total Area</p>
                  <p className="text-base font-bold tabular-nums">
                    <AnimatedCounter
                      value={farm.totalArea / 1000}
                      duration={900}
                      format={(n) => `${n.toFixed(1)}k`}
                    />{" "}
                    <span className="text-xs font-medium text-muted-foreground">sq ft</span>
                  </p>
                </div>
              </div>
              <div className="group flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-sky-warm/30 hover:shadow-md hover:shadow-sky-warm/10">
                <span className="flex size-10 items-center justify-center rounded-lg bg-sky-warm/15 text-sky-warm">
                  <IconChartDots className="size-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Fields</p>
                  <p className="text-base font-bold tabular-nums">
                    <AnimatedCounter value={farm.fieldCount} duration={800} />
                  </p>
                </div>
              </div>
              <div className="group flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-wheat/30 hover:shadow-md hover:shadow-wheat/10">
                <span className="flex size-10 items-center justify-center rounded-lg bg-wheat/20 text-wheat">
                  <IconDroplet className="size-5" strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs text-muted-foreground">Active</p>
                  <p className="text-base font-bold tabular-nums">
                    <AnimatedCounter value={activeCount} duration={800} />{" "}
                    <span className="text-xs font-medium text-muted-foreground">
                      of {farmFields.length}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {farm.notes && (
              <div className="mt-4 rounded-xl bg-muted/30 p-4 ring-1 ring-inset ring-border/30">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {farm.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      <div>
        <Reveal delay={160} duration={400}>
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Fields</h2>
            <Link
              to="/app/fields"
              className="flex items-center gap-1 text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
            >
              View all fields
              <IconChevronRight className="size-4" strokeWidth={1.75} />
            </Link>
          </div>
        </Reveal>
        <div
          key={farmId}
          className="glass-card mt-4 divide-y divide-border/50 overflow-hidden rounded-2xl"
        >
          {farmFields.length > 0 ? (
            farmFields.map((field, i) => (
              <FieldRow key={field.id} field={field} delay={200 + i * 70} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconChartDots
                className="size-10 text-muted-foreground/30"
                strokeWidth={1.5}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                No fields in this farm yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
