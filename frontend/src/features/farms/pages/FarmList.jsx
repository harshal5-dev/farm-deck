import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  IconBuildingWarehouse,
  IconPlus,
  IconSearch,
  IconArrowsMoveVertical,
  IconChartDots,
  IconSeeding,
  IconX,
} from "@tabler/icons-react";
import { farms as seedFarms, fields } from "@/mocks";
import { cn } from "@/lib/utils";
import { useMockLoading } from "@/hooks/use-mock-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Reveal, AnimatedCounter } from "@/components/effects";
import { FarmCard } from "../components/FarmCard";
import { FarmCardSkeleton } from "../components/FarmCardSkeleton";
import { FarmTypeChip } from "../components/FarmTypeChip";
import { EmptyFarms } from "../components/EmptyFarms";
import { farmTypeOrder } from "../lib/farm-meta";
import { buildPageList } from "../lib/format";

const PAGE_SIZE = 4;
const ACTIVE_STATUSES = new Set(["seeding", "growing", "flowering"]);

/** A single glass stat tile for the summary strip. */
function StatTile({ icon: Icon, label, children, accent }) {
  const accents = {
    leaf: "bg-leaf/15 text-leaf",
    "sky-warm": "bg-sky-warm/15 text-sky-warm",
    wheat: "bg-wheat/20 text-wheat",
    clay: "bg-clay/15 text-clay-deep dark:text-clay",
  };
  return (
    <div className="glass highlight-edge flex items-center gap-3 rounded-2xl p-4">
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-xl",
          accents[accent]
        )}
      >
        <Icon className="size-5" strokeWidth={1.7} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="font-heading text-xl font-bold leading-tight tabular-nums">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function FarmList() {
  // Own the farm collection so the action menu can mutate it locally.
  const [farmList, setFarmList] = useState(seedFarms);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Monotonic counter for duplicate farm ids — a ref avoids re-renders and
  // keeps id generation out of render purity rules.
  const duplicateSeq = useRef(0);

  const loading = useMockLoading(850, []);

  // Live per-type counts for the filter chips.
  const typeCounts = useMemo(() => {
    const counts = { all: farmList.length };
    farmTypeOrder.forEach((t) => (counts[t] = 0));
    farmList.forEach((f) => {
      if (counts[f.farmType] != null) counts[f.farmType]++;
    });
    return counts;
  }, [farmList]);

  // Apply search + type filter.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return farmList.filter((f) => {
      if (typeFilter !== "all" && f.farmType !== typeFilter) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        (f.notes || "").toLowerCase().includes(q)
      );
    });
  }, [farmList, query, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedFarms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const pageItems = buildPageList(currentPage, totalPages);

  // Aggregate stats across all farms + their fields.
  const stats = useMemo(() => {
    const totalArea = farmList.reduce((sum, f) => sum + (f.totalArea || 0), 0);
    const farmIds = new Set(farmList.map((f) => f.id));
    const farmFields = fields.filter((f) => farmIds.has(f.farmId));
    const activeFields = farmFields.filter((f) => f.isActive).length;
    const cropsInProgress = farmFields.filter((f) =>
      ACTIVE_STATUSES.has(f.status)
    ).length;
    return { totalArea, activeFields, cropsInProgress };
  }, [farmList]);

  // ── Action handlers (menu mutations) ───────────────────────────────
  const resetPage = () => setPage(1);

  const handleDuplicate = (farm) => {
    duplicateSeq.current += 1;
    const copy = {
      ...farm,
      id: `${farm.id}-copy-${duplicateSeq.current}`,
      name: `${farm.name} (Copy)`,
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    setFarmList((prev) => [copy, ...prev]);
    resetPage();
  };

  const handleToggleActive = (farm) => {
    setFarmList((prev) =>
      prev.map((f) =>
        f.id === farm.id ? { ...f, isActive: !(f.isActive !== false) } : f
      )
    );
  };

  const handleDelete = (farm) => {
    setFarmList((prev) => prev.filter((f) => f.id !== farm.id));
    resetPage();
  };

  const clearFilters = () => {
    setQuery("");
    setTypeFilter("all");
    resetPage();
  };

  const hasFilters = query.trim() || typeFilter !== "all";

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────── */}
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

      {/* ── Stats strip ────────────────────────────────────────────── */}
      <Reveal delay={60} duration={450}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile icon={IconBuildingWarehouse} label="Total Farms" accent="leaf">
            <AnimatedCounter value={farmList.length} duration={700} />
          </StatTile>
          <StatTile icon={IconArrowsMoveVertical} label="Total Area" accent="wheat">
            <AnimatedCounter
              value={stats.totalArea / 1000}
              duration={900}
              format={(n) => `${n.toFixed(1)}k`}
            />
            <span className="ml-1 text-xs font-medium text-muted-foreground">
              sq ft
            </span>
          </StatTile>
          <StatTile icon={IconChartDots} label="Active Fields" accent="sky-warm">
            <AnimatedCounter value={stats.activeFields} duration={800} />
          </StatTile>
          <StatTile icon={IconSeeding} label="Crops Growing" accent="clay">
            <AnimatedCounter value={stats.cropsInProgress} duration={800} />
          </StatTile>
        </div>
      </Reveal>

      {/* ── Toolbar: search + type filter ──────────────────────────── */}
      <Reveal delay={120} duration={450}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-xs flex-1">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.85}
            />
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                resetPage();
              }}
              placeholder="Search farms, locations…"
              className="pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  resetPage();
                }}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 flex size-5 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <IconX className="size-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <FarmTypeChip
              type="all"
              count={typeCounts.all}
              active={typeFilter === "all"}
              onClick={() => {
                setTypeFilter("all");
                resetPage();
              }}
            />
            {farmTypeOrder.map((t) => (
              <FarmTypeChip
                key={t}
                type={t}
                count={typeCounts[t]}
                active={typeFilter === t}
                onClick={() => {
                  setTypeFilter(t);
                  resetPage();
                }}
              />
            ))}
          </div>
        </div>
      </Reveal>

      {/* ── Grid / loading / empty ─────────────────────────────────── */}
      <div className="space-y-6">
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <FarmCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyFarms
            filtered={hasFilters || farmList.length > 0}
            onAdd={hasFilters ? clearFilters : () => undefined}
          />
        ) : (
          <>
            <div key={`farms-${currentPage}`} className="grid gap-4 sm:grid-cols-2">
              {pagedFarms.map((farm, i) => (
                <FarmCard
                  key={farm.id}
                  farm={farm}
                  index={i}
                  farmFields={fields.filter((f) => f.farmId === farm.id)}
                  onDuplicate={() => handleDuplicate(farm)}
                  onToggleActive={() => handleToggleActive(farm)}
                  onDelete={() => handleDelete(farm)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-col items-center gap-3">
                <Pagination className="justify-center">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setPage((p) => Math.max(1, p - 1))
                        }
                        aria-disabled={currentPage === 1}
                        className={cn(
                          currentPage === 1 &&
                            "pointer-events-none opacity-40"
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
                            isActive={item === currentPage}
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
                        aria-disabled={currentPage === totalPages}
                        className={cn(
                          currentPage === totalPages &&
                            "pointer-events-none opacity-40"
                        )}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>

                <p className="text-xs text-muted-foreground">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                  {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length} farms
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
