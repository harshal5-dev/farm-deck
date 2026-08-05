import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  IconMapPin,
  IconArrowsMoveVertical,
  IconChartDots,
  IconSun,
  IconBuildingWarehouse,
  IconArrowsExchange,
  IconBuilding,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import { farms, fields } from "@/mocks";
import { cn } from "@/lib/utils";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  Reveal,
  FieldPlot,
  FarmTypeArt,
  FarmCardSkeleton,
} from "@/components/effects";

const typeMeta = {
  outdoor: {
    icon: IconSun,
    color: "amber",
    gradient: "from-amber-500/20 via-amber-400/10 to-transparent",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/10",
  },
  greenhouse: {
    icon: IconBuildingWarehouse,
    color: "emerald",
    gradient: "from-emerald-500/20 via-emerald-400/10 to-transparent",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  mixed: {
    icon: IconArrowsExchange,
    color: "violet",
    gradient: "from-violet-500/20 via-violet-400/10 to-transparent",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/20",
    glow: "shadow-violet-500/10",
  },
  indoor: {
    icon: IconBuilding,
    color: "sky",
    gradient: "from-sky-500/20 via-sky-400/10 to-transparent",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/20",
    glow: "shadow-sky-500/10",
  },
};

function FarmCard({ farm }) {
  const meta = typeMeta[farm.farmType] || typeMeta.outdoor;
  const Icon = meta.icon;
  const farmFields = fields.filter((f) => f.farmId === farm.id);
  const fieldStatuses = farmFields.map((f) => f.status).filter(Boolean);

  return (
    <Link
      to={`/app/farms/${farm.id}`}
      className="glass-card texture-paper highlight-edge group relative block overflow-hidden rounded-2xl py-0 transition-shadow duration-200 hover:shadow-lg hover:shadow-leaf/10"
    >
      {/* Slim art banner */}
      <div className="relative h-20 overflow-hidden">
        <div
          className={cn("absolute inset-0 bg-linear-to-br", meta.gradient)}
        />
        <FarmTypeArt variant={farm.farmType} className="relative size-full" />
        <Badge
          variant={meta.color}
          className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm"
        >
          {farm.farmType}
        </Badge>
      </div>

      <div className="relative px-5 pb-5">
        {/* Overlapping icon chip */}
        <div
          className={cn(
            "absolute -top-6 left-5 flex size-12 items-center justify-center rounded-2xl shadow-md ring-4 ring-card",
            meta.bg
          )}
        >
          <Icon className={cn("size-6", meta.text)} strokeWidth={1.7} />
        </div>

        {/* Title */}
        <div className="mt-7 pl-16">
          <h3 className="truncate font-heading text-base font-bold tracking-tight">
            {farm.name}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <IconMapPin className="size-3 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{farm.location}</span>
          </div>
        </div>

        {/* Stat chips */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <IconArrowsMoveVertical
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.7}
            />
            <div className="min-w-0">
              <p className="text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                Area
              </p>
              <p className="text-sm font-bold tabular-nums">
                {(farm.totalArea / 1000).toFixed(1)}k
                <span className="ml-0.5 text-[10px] font-medium text-muted-foreground">
                  sqft
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <IconChartDots
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.7}
            />
            <div className="min-w-0">
              <p className="text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                Fields
              </p>
              <p className="text-sm font-bold tabular-nums">
                {farm.fieldCount}
              </p>
            </div>
          </div>
        </div>

        {farm.notes && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {farm.notes}
          </p>
        )}

        {/* Mini field plot */}
        <div className="mt-4">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
            <span className="size-1.5 rounded-full bg-leaf/70" />
            Field plot · {farmFields.length} zones
          </div>
          <FieldPlot statuses={fieldStatuses} cols={6} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <span className="text-xs text-muted-foreground">
            Created{" "}
            {new Date(farm.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1 text-xs font-medium text-leaf">
            View
            <IconChevronRight className="size-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </Link>
  );
}

const PAGE_SIZE = 4;

/** Build the page-number list with ellipses, e.g. [1, "...", 4, 5, "...", 9] */
function buildPageList(current, totalPages) {
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, current, current - 1, current + 1]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const result = [];
  sorted.forEach((p, i) => {
    result.push(p);
    const next = sorted[i + 1];
    if (next && next - p > 1) result.push("...");
  });
  return result;
}

export default function Farms() {
  const [page, setPage] = useState(1);

  // Simulate async loading; resets when the view (tab) changes.
  const loading = useMockLoading(850, []);

  const totalPages = Math.ceil(farms.length / PAGE_SIZE);
  const pagedFarms = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return farms.slice(start, start + PAGE_SIZE);
  }, [page]);

  const pageItems = buildPageList(page, totalPages);

  return (
    <div className="space-y-6">
      <Reveal duration={450}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              Farms
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your growing locations and farm types.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/farm-types">
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconBuildingWarehouse className="size-4" strokeWidth={1.85} />
                Farm Types
              </Button>
            </Link>
            <Link to="/app/farms/new">
              <Button size="sm" className="gap-1.5">
                <IconPlus className="size-4" strokeWidth={2.2} />
                New Farm
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>

      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <FarmCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div key={`farms-${page}`} className="grid gap-4 sm:grid-cols-2">
              {pagedFarms.map((farm) => (
                <FarmCard key={farm.id} farm={farm} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3">
                <Pagination className="justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        aria-disabled={page === 1}
                        className={cn(
                          page === 1 && "pointer-events-none opacity-40"
                        )}
                      />
                    </PaginationItem>

                    {pageItems.map((item, idx) =>
                      item === "..." ? (
                        <PaginationItem key={`e-${idx}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationLink
                            isActive={item === page}
                            onClick={() => setPage(item)}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        aria-disabled={page === totalPages}
                        className={cn(
                          page === totalPages &&
                            "pointer-events-none opacity-40"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <p className="text-xs text-muted-foreground">
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, farms.length)} of {farms.length}{" "}
                  farms
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
