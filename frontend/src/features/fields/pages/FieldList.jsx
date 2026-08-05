import { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import {
  IconChartDots,
  IconLeaf,
  IconSeeding,
  IconFlower,
  IconBasket,
  IconCircleCheck,
  IconCircleX,
  IconCircleOff,
  IconArrowsMoveVertical,
  IconPlant,
  IconFilter,
  IconX,
  IconPlus,
  IconEdit,
  IconTrash,
  IconShovel,
  IconMapPin,
} from "@tabler/icons-react"
import { fields, farms, soilTypes } from "@/mocks"
import { cn } from "@/lib/utils"
import { useMockLoading } from "@/hooks/use-mock-loading"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Reveal } from "@/components/effects"

const statusMeta = {
  seeding: { icon: IconSeeding, label: "Seeding", color: "sky", bg: "bg-sky-warm/15", text: "text-sky-warm" },
  growing: { icon: IconLeaf, label: "Growing", color: "emerald", bg: "bg-leaf/15", text: "text-leaf" },
  flowering: { icon: IconFlower, label: "Flowering", color: "violet", bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400" },
  harvested: { icon: IconBasket, label: "Harvested", color: "amber", bg: "bg-wheat/20", text: "text-wheat" },
  completed: { icon: IconCircleCheck, label: "Completed", color: "emerald", bg: "bg-leaf/15", text: "text-leaf" },
  failed: { icon: IconCircleX, label: "Failed", color: "red", bg: "bg-red-500/10", text: "text-red-500" },
}

const filters = ["all", "seeding", "growing", "flowering", "harvested", "inactive"]

const PAGE_SIZE = 6

/** Build the page-number list with ellipses. */
function buildPageList(current, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = new Set([1, totalPages, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  const result = []
  sorted.forEach((p, i) => {
    result.push(p)
    const next = sorted[i + 1]
    if (next && next - p > 1) result.push("...")
  })
  return result
}

/** Resolve a soil type by id → its display info. */
function useSoil(id) {
  return soilTypes.find((s) => s.id === id) || null
}

function SoilChip({ soilTypeId }) {
  const soil = useSoil(soilTypeId)
  if (!soil) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
        <IconPlant className="size-3" strokeWidth={2} />
        Hydroponic
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-wheat/15 px-1.5 py-0.5 text-[10px] font-semibold text-wheat">
      <IconShovel className="size-3" strokeWidth={2} />
      {soil.displayName}
    </span>
  )
}

function FieldCard({ field }) {
  const farm = farms.find((f) => f.id === field.farmId)
  const status = field.status ? statusMeta[field.status] : null
  const StatusIcon = status?.icon

  const handleDelete = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm(`Delete "${field.name}"? This cannot be undone.`)) {
      toast.success("Field deleted", { description: field.name })
    }
  }

  return (
    <div className="glass-card texture-paper highlight-edge group relative flex flex-col overflow-hidden rounded-2xl transition-shadow duration-200 hover:shadow-lg hover:shadow-leaf/10">
      {/* soil-tinted banner strip */}
      <div className="relative h-16 overflow-hidden border-b border-border/40">
        <div
          className={cn(
            "absolute inset-0",
            field.soilTypeId ? "bg-gradient-to-r from-wheat/15 to-wheat/5" : "bg-gradient-to-r from-sky-warm/15 to-sky-warm/5"
          )}
        />
        {/* texture dots */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(${field.soilTypeId ? "var(--wheat)" : "var(--sky-warm)"} 1px, transparent 1.2px)`,
            backgroundSize: "16px 16px",
          }}
        />
        <div className="relative flex h-full items-center justify-between px-4">
          <SoilChip soilTypeId={field.soilTypeId} />
          {status ? (
            <Badge variant={status.color} className="gap-1 text-[10px]">
              <StatusIcon className="size-3" strokeWidth={1.75} />
              {status.label}
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1 text-[10px]">
              <IconCircleOff className="size-3" strokeWidth={1.75} />
              Inactive
            </Badge>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold tracking-tight">{field.name}</h3>
            {field.cropName ? (
              <p className="mt-0.5 truncate text-xs text-muted-foreground">{field.cropName}</p>
            ) : (
              <p className="mt-0.5 truncate text-xs italic text-muted-foreground/60">No active crop</p>
            )}
          </div>
          <div
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-xl",
              status ? status.bg : "bg-muted"
            )}
          >
            {status ? (
              <StatusIcon className={cn("size-4", status.text)} strokeWidth={1.75} />
            ) : (
              <IconCircleOff className="size-4 text-muted-foreground" strokeWidth={1.75} />
            )}
          </div>
        </div>

        {/* stat chips */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5">
            <IconArrowsMoveVertical className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Area</p>
              <p className="text-sm font-bold tabular-nums">
                {field.area.toLocaleString()}
                <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">sqft</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-1.5">
            <IconPlant className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.7} />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70">Farm</p>
              <p className="truncate text-sm font-bold">{farm?.name || "Unknown"}</p>
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-3">
          <Link
            to={`/app/farms/${field.farmId}`}
            className="flex items-center gap-1 text-xs font-medium text-leaf transition-colors hover:underline"
          >
            <IconMapPin className="size-3" strokeWidth={1.85} />
            View farm
          </Link>
          <div className="flex items-center gap-1">
            <Link
              to={`/app/fields/${field.id}/edit`}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-leaf"
              title="Edit field"
            >
              <IconEdit className="size-3.5" strokeWidth={1.85} />
            </Link>
            <button
              onClick={handleDelete}
              className="flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
              title="Delete field"
            >
              <IconTrash className="size-3.5" strokeWidth={1.85} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Fields() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [page, setPage] = useState(1)
  const loading = useMockLoading(700)

  const filteredFields = useMemo(
    () =>
      fields.filter((field) => {
        if (activeFilter === "all") return true
        if (activeFilter === "inactive") return !field.isActive
        return field.status === activeFilter
      }),
    [activeFilter]
  )

  const totalPages = Math.ceil(filteredFields.length / PAGE_SIZE)
  const pagedFields = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredFields.slice(start, start + PAGE_SIZE)
  }, [filteredFields, page])

  const handleFilter = (f) => {
    setActiveFilter(f)
    setPage(1)
  }

  const pageItems = buildPageList(page, totalPages)

  return (
    <div className="space-y-6">
      <Reveal duration={450}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Fields</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse all growing areas across your farms.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/soil-types">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconShovel className="size-4" strokeWidth={1.85} />
                Soil Types
              </Button>
            </Link>
            <Link to="/app/fields/new">
              <Button size="sm" className="gap-1.5">
                <IconPlus className="size-4" strokeWidth={2.2} />
                New Field
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* status filters */}
      <Reveal delay={80} duration={450}>
        <div className="flex flex-wrap items-center gap-2">
          <IconFilter className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} />
          {filters.map((f) => {
            const filterMeta = f !== "all" && f !== "inactive" ? statusMeta[f] : null
            return (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-medium transition-colors duration-200",
                  activeFilter === f
                    ? "bg-leaf/15 text-leaf ring-1 ring-inset ring-leaf/20"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                {filterMeta && <filterMeta.icon className="size-3.5" strokeWidth={1.75} />}
                {f === "inactive" && <IconCircleOff className="size-3.5" strokeWidth={1.75} />}
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            )
          })}
          {activeFilter !== "all" && (
            <button
              onClick={() => handleFilter("all")}
              className="flex shrink-0 items-center gap-1 rounded-xl px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <IconX className="size-3.5" strokeWidth={1.75} />
              Clear
            </button>
          )}
          <span className="ml-auto rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            {filteredFields.length} {filteredFields.length === 1 ? "field" : "fields"}
          </span>
        </div>
      </Reveal>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden rounded-2xl">
              <div className="h-16 animate-pulse bg-muted" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-12 animate-pulse rounded-lg bg-muted" />
                  <div className="h-12 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pagedFields.length > 0 ? (
        <>
          <div key={`fields-${page}-${activeFilter}`} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pagedFields.map((field) => (
              <FieldCard key={field.id} field={field} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3">
              <Pagination className="justify-center">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={cn(page === 1 && "pointer-events-none opacity-40")}
                    />
                  </PaginationItem>
                  {pageItems.map((item, idx) =>
                    item === "..." ? (
                      <PaginationItem key={`e-${idx}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink isActive={item === page} onClick={() => setPage(item)}>
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={cn(page === totalPages && "pointer-events-none opacity-40")}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              <p className="text-xs text-muted-foreground">
                Showing {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, filteredFields.length)} of {filteredFields.length} fields
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="glass-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <IconChartDots className="size-12 text-muted-foreground/30" strokeWidth={1.5} />
          <p className="mt-4 text-sm text-muted-foreground">No fields match this filter.</p>
          <button
            onClick={() => handleFilter("all")}
            className="mt-2 text-sm font-medium text-leaf hover:underline"
          >
            Show all fields
          </button>
        </div>
      )}
    </div>
  )
}
