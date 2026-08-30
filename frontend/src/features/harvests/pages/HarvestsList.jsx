import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconCash,
  IconCirclePlus,
  IconScale,
  IconSearch,
  IconTrophy,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/effects";
import ErrorState from "@/components/ui/error-state";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { usePermissions } from "@/features/auth/usePermissions";
import {
  useDeleteHarvestMutation,
  useListHarvestsQuery,
} from "../harvestApi";
import { setSelectedHarvest } from "../selectedHarvestSlice";
import { buildPageList } from "@/features/farms/lib/format";
import HarvestRow from "../components/HarvestRow";
import HarvestRowSkeleton from "../components/HarvestRowSkeleton";
import EmptyHarvests from "../components/EmptyHarvests";
import { GRADE_ORDER, QUALITY_GRADES } from "../constants";
import { formatMoney, formatYield } from "../lib/format";

const PAGE_SIZE = 8;

/**
 * HarvestsList — every harvest across the workspace, newest first.
 * The header strip summarises the season (count / total yield /
 * total revenue / A-grade share) and the toolbar filters by search,
 * grade and sort. Same layout skeleton as the daily-logs list so the
 * two pages feel like siblings.
 */
const HarvestsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { canViewHarvests, canLogHarvests } = usePermissions();

  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isFetching, refetch } =
    useListHarvestsQuery();
  const harvests = useMemo(() => data?.harvests ?? [], [data]);
  const [deleteHarvest, { isLoading: deleting }] = useDeleteHarvestMutation();

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  // Season summary — over ALL harvests, not the filtered slice.
  const stats = useMemo(() => {
    if (harvests.length === 0) {
      return { count: 0, totalYield: 0, totalRevenue: 0, gradeA: 0 };
    }
    const totalYield = harvests.reduce(
      (sum, h) => sum + (h.totalYieldGrams ?? 0),
      0
    );
    const totalRevenue = harvests.reduce(
      (sum, h) => sum + (h.totalRevenue ?? 0),
      0
    );
    const gradeA = harvests.filter((h) => h.qualityGrade === "A").length;
    return { count: harvests.length, totalYield, totalRevenue, gradeA };
  }, [harvests]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = harvests;
    if (q) {
      rows = rows.filter((h) =>
        [h.cropName, h.cycleName, h.zoneName, h.farmName, h.notes, h.qualityGrade]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (gradeFilter !== "all") {
      if (gradeFilter === "none") {
        rows = rows.filter((h) => !h.qualityGrade);
      } else {
        rows = rows.filter((h) => h.qualityGrade === gradeFilter);
      }
    }
    const sorted = [...rows];
    if (sort === "yield") {
      sorted.sort((a, b) => (b.totalYieldGrams ?? 0) - (a.totalYieldGrams ?? 0));
    } else if (sort === "revenue") {
      sorted.sort((a, b) => (b.totalRevenue ?? 0) - (a.totalRevenue ?? 0));
    } else {
      sorted.sort((a, b) =>
        a.harvestDate < b.harvestDate ? 1 : a.harvestDate > b.harvestDate ? -1 : 0
      );
    }
    return sorted;
  }, [harvests, search, gradeFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const pagedHarvests = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, activePage]);

  const pageItems = buildPageList(activePage, totalPages);
  const startIndex =
    filtered.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(activePage * PAGE_SIZE, filtered.length);

  // Permission gate — after every hook so hook order stays stable.
  if (!canViewHarvests) return <Navigate to="/app" replace />;

  const handleAdd = () => navigate("/app/harvests/new");
  const handleEdit = (harvest) => {
    dispatch(setSelectedHarvest(harvest));
    navigate("/app/harvests/edit");
  };
  const handleDelete = async (harvest) => {
    if (
      !confirm(
        `Delete the ${harvest.harvestDate} harvest (${formatYield(harvest.totalYieldGrams) ?? "—"})? This can't be undone.`
      )
    )
      return;
    try {
      await deleteHarvest(harvest.id).unwrap();
      toast.success("Harvest deleted", {
        description: `${harvest.cropName} · ${formatYield(harvest.totalYieldGrams) ?? "—"} removed from the records.`,
      });
    } catch (err) {
      toast.error("Could not delete harvest", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const gradeFilters = [
    { id: "all", label: "All", count: harvests.length },
    ...GRADE_ORDER.map((g) => ({
      id: g,
      label: QUALITY_GRADES[g].label,
      count: harvests.filter((h) => h.qualityGrade === g).length,
    })),
    {
      id: "none",
      label: "Not graded",
      count: harvests.filter((h) => !h.qualityGrade).length,
    },
  ];

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ===== Header ===================================================== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/10 via-wheat/5 to-lagoon/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-wheat/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-leaf/12 blur-3xl" />

          <div className="relative flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
                    <IconScale className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    Harvests
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Yields, grades and revenue across every cycle.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canLogHarvests && (
                  <Button
                    onClick={handleAdd}
                    size="sm"
                    className="gap-1.5 shadow-md shadow-leaf/25"
                  >
                    <IconCirclePlus className="size-4" strokeWidth={1.85} />
                    Log harvest
                  </Button>
                )}
              </div>
            </div>

            {/* Season stats row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border/30 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-leaf" />
                <span className="font-semibold text-foreground tabular-nums">
                  {stats.count}
                </span>{" "}
                {stats.count === 1 ? "harvest" : "harvests"}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1">
                <IconScale className="size-3.5 text-leaf" strokeWidth={1.85} />
                <span className="font-semibold text-foreground tabular-nums">
                  {formatYield(stats.totalYield) ?? "—"}
                </span>{" "}
                total yield
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1">
                <IconCash className="size-3.5 text-wheat-deep dark:text-wheat" strokeWidth={1.85} />
                <span className="font-semibold text-foreground tabular-nums">
                  {stats.totalRevenue > 0 ? formatMoney(stats.totalRevenue) : "—"}
                </span>{" "}
                revenue
              </span>
              {stats.count > 0 && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1">
                    <IconTrophy className="size-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.85} />
                    <span className="font-semibold text-foreground tabular-nums">
                      {stats.gradeA}
                    </span>{" "}
                    grade-A
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* ===== Toolbar ==================================================== */}
      <Reveal delay={60} duration={400}>
        <div className="glass-card texture-paper relative flex shrink-0 flex-col gap-2.5 rounded-2xl border border-border/40 p-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="relative min-w-0 flex-1 sm:max-w-72">
            <IconSearch
              className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground"
              strokeWidth={1.85}
            />
            <Input
              value={search}
              onChange={(e) => resetPage(setSearch)(e.target.value)}
              placeholder="Search crop, cycle, field or notes…"
              className="h-9 rounded-xl bg-card/60 pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {gradeFilters.map((f) => {
              const active = gradeFilter === f.id;
              const meta = QUALITY_GRADES[f.id];
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => resetPage(setGradeFilter)(f.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-tight transition-colors",
                    active
                      ? "border-leaf/40 bg-leaf/15 text-leaf"
                      : "border-border/40 bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
                  )}
                >
                  {meta && <span className={cn("size-1.5 rounded-full", meta.dot)} />}
                  {f.label}
                  <span className="tabular-nums opacity-60">{f.count}</span>
                </button>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-xl border border-border/40 bg-card/50 p-0.5">
            {[
              { id: "recent", label: "Recent" },
              { id: "yield", label: "Yield" },
              { id: "revenue", label: "Revenue" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => resetPage(setSort)(s.id)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
                  sort === s.id
                    ? "bg-leaf/15 text-leaf"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* ===== List ====================================================== */}
      <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {isError ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <ErrorState
                variant="error"
                title="Couldn't load harvests"
                message="The harvest list failed to load. Check your connection and try again."
                onRetry={refetch}
                retrying={isFetching}
                className="max-w-lg"
              />
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <HarvestRowSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyHarvests
                onAdd={handleAdd}
                canAdd={canLogHarvests}
                filtered={harvests.length > 0}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {pagedHarvests.map((harvest, i) => (
                <HarvestRow
                  key={harvest.id}
                  harvest={harvest}
                  index={i}
                  onEdit={() => handleEdit(harvest)}
                  onDelete={() => handleDelete(harvest)}
                  canManage={canLogHarvests && !deleting}
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && !isError && totalPages > 1 && (
          <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
            <Pagination className="justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={activePage === 1}
                    className={cn(
                      activePage === 1 && "pointer-events-none opacity-40"
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
                        isActive={item === activePage}
                        onClick={() => setPage(item)}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={activePage === totalPages}
                    className={cn(
                      activePage === totalPages &&
                        "pointer-events-none opacity-40"
                    )}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <p className="text-xs text-muted-foreground">
              Showing{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {startIndex}–{endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "harvest" : "harvests"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HarvestsList;
