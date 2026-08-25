import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconCirclePlus,
  IconSearch,
  IconX,
  IconPlant2,
  IconFilter,
  IconTractor,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CROP_STATUS_FILTERS,
  CROP_STATUS_ORDER,
  CROP_TYPE_ORDER,
  getCropStatus,
} from "../constants";
import {
  useListCropsQuery,
  useListCropTypesQuery,
  useAdvanceCropStatusMutation,
} from "../cropApi";
import { useListFarmsForPickerQuery } from "@/features/fields/zoneApi";
import { setSelectedCrop } from "../selectedCropSlice";
import { buildPageList } from "../lib/format-crops";
import CropCard from "../components/CropCard";
import CropCardSkeleton from "../components/CropCardSkeleton";
import EmptyCrops from "../components/EmptyCrops";
import CropTypeFilterChip from "../components/CropTypeFilterChip";

const PAGE_SIZE = 6;
const GRID_COLS = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

const SORT_OPTIONS = [
  { id: "recent", label: "Recently updated" },
  { id: "name", label: "Name (A → Z)" },
  { id: "harvest", label: "Harvest soonest" },
  { id: "sow", label: "Sow date (newest)" },
];

const CropsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useListCropsQuery();
  const { crops = [] } = data ?? {};
  const [advanceCropStatus] = useAdvanceCropStatusMutation();
  const { canViewCrops, canManageCrops } = usePermissions();

  const { data: cropTypes = [], isLoading: typesLoading } =
    useListCropTypesQuery();
  const { data: farms = [] } = useListFarmsForPickerQuery();

  const [typeFilter, setTypeFilter] = useState("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  // Decorate each crop with its lookup row (same pattern as the lists).
  const decorated = useMemo(() => {
    const typeById = new Map(cropTypes.map((t) => [t.id, t]));
    return crops.map((c) => ({
      ...c,
      cropType: typeById.get(c.cropTypeId),
    }));
  }, [crops, cropTypes]);

  const counts = useMemo(() => {
    const active = decorated.filter((c) =>
      ["planned", "sown", "growing", "harvest_ready"].includes(c.status)
    ).length;
    const ready = decorated.filter(
      (c) => c.status === "harvest_ready"
    ).length;
    const done = decorated.filter((c) =>
      ["harvested", "failed", "cancelled"].includes(c.status)
    ).length;
    return { active, ready, done, total: decorated.length };
  }, [decorated]);

  const orderedTypes = useMemo(() => {
    const rank = (name) => {
      const idx = CROP_TYPE_ORDER.indexOf(name);
      return idx === -1 ? CROP_TYPE_ORDER.length : idx;
    };
    return [...cropTypes].sort((a, b) =>
      rank(a.name) === rank(b.name)
        ? a.displayName.localeCompare(b.displayName)
        : rank(a.name) - rank(b.name)
    );
  }, [cropTypes]);

  const typeCounts = useMemo(() => {
    const c = { all: decorated.length };
    decorated.forEach((crop) => {
      c[crop.cropTypeId] = (c[crop.cropTypeId] || 0) + 1;
    });
    return c;
  }, [decorated]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const statusBucket =
      CROP_STATUS_FILTERS.find((f) => f.id === statusFilter)?.statuses ??
      CROP_STATUS_ORDER;
    let out = decorated.filter((c) => {
      if (!statusBucket.includes(c.status)) return false;
      if (typeFilter !== "all" && c.cropTypeId !== typeFilter) return false;
      if (farmFilter !== "all" && c.farmId !== farmFilter) return false;
      if (q) {
        const hay = `${c.name} ${c.variety ?? ""} ${c.zoneName ?? ""} ${
          c.farmName ?? ""
        } ${c.notes ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorter = {
      recent: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      name: (a, b) => a.name.localeCompare(b.name),
      harvest: (a, b) => {
        const da = a.harvestDateActual || a.harvestDateExpected;
        const db = b.harvestDateActual || b.harvestDateExpected;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(da) - new Date(db);
      },
      sow: (a, b) => {
        const da = a.sowDateActual || a.sowDatePlanned;
        const db = b.sowDateActual || b.sowDatePlanned;
        if (!da && !db) return 0;
        if (!da) return 1;
        if (!db) return -1;
        return new Date(db) - new Date(da);
      },
    }[sort];
    if (sorter) out = [...out].sort(sorter);
    return out;
  }, [decorated, typeFilter, farmFilter, statusFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);

  const pagedCrops = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, activePage]);

  // Permission gate — bounce anyone without `crops.view` back to the
  // dashboard.
  if (!canViewCrops) return <Navigate to="/app" replace />;

  const pageItems = buildPageList(activePage, totalPages);
  const startIndex =
    filtered.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(activePage * PAGE_SIZE, filtered.length);

  const resetPage = (setter) => (next) => {
    setter(next);
    setPage(1);
  };
  const onTypeFilterChange = resetPage(setTypeFilter);
  const onFarmFilterChange = resetPage(setFarmFilter);
  const onStatusFilterChange = resetPage(setStatusFilter);
  const onSearchChange = resetPage(setSearch);
  const onSortChange = resetPage(setSort);

  const handleAdd = () => navigate("/app/crops/new");

  const handleEdit = (c) => {
    dispatch(setSelectedCrop(c));
    navigate("/app/crops/edit");
  };

  const handleAdvance = async (crop) => {
    const nextLabel =
      getCropStatus(
        {
          planned: "sown",
          sown: "growing",
          growing: "harvest_ready",
          harvest_ready: "harvested",
        }[crop.status]
      )?.label ?? "next stage";
    try {
      await advanceCropStatus(crop.id).unwrap();
      toast.success(`${crop.name} → ${nextLabel}`, {
        description:
          crop.status === "harvest_ready"
            ? "Cycle complete — harvest date recorded."
            : "The cycle moved to its next stage.",
      });
    } catch (err) {
      toast.error("Could not advance the crop", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ============ Compact header ===================================== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/10 via-wheat/5 to-lagoon/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-leaf/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-wheat/12 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:p-5">
            {/* Row 1 — title + counts | actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
                    <IconPlant2 className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    Crops
                  </h1>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-leaf" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.active}
                      </span>{" "}
                      in cycle
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.ready}
                      </span>{" "}
                      ready
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {counts.done}
                      </span>{" "}
                      finished
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canManageCrops && (
                  <Button
                    onClick={handleAdd}
                    size="sm"
                    className="gap-1.5 shadow-md shadow-leaf/25"
                  >
                    <IconCirclePlus className="size-4" strokeWidth={1.85} />
                    Plan a crop
                  </Button>
                )}
              </div>
            </div>

            {/* Row 2 — search | status segmented | sort + farm */}
            <div className="flex flex-col gap-2.5 border-t border-border/30 pt-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <IconSearch
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <Input
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Search by crop, field, farm or notes…"
                  className="pl-9"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <IconX className="size-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex h-9 w-fit items-center gap-0.5 rounded-2xl border border-border/50 bg-card/60 p-1 shadow-sm">
                  {CROP_STATUS_FILTERS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onStatusFilterChange(s.id)}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all duration-200",
                        statusFilter === s.id
                          ? "bg-linear-to-br from-leaf to-wheat-deep text-primary-foreground shadow-sm shadow-leaf/30"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <Select value={farmFilter} onValueChange={onFarmFilterChange}>
                  <SelectTrigger
                    size="sm"
                    aria-label="Filter by farm"
                    className="h-9 min-w-32 max-w-44"
                  >
                    <span className="flex min-w-0 items-center gap-1.5">
                      <IconTractor
                        className="size-3.5 shrink-0 text-leaf"
                        strokeWidth={1.85}
                      />
                      <SelectValue />
                    </span>
                  </SelectTrigger>
                  <SelectContent align="end">
                    <SelectItem value="all">All farms</SelectItem>
                    {farms.map((f) => (
                      <SelectItem key={f.id} value={f.id}>
                        {f.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sort} onValueChange={onSortChange}>
                  <SelectTrigger
                    size="sm"
                    aria-label="Sort crops"
                    className="h-9 min-w-38"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {SORT_OPTIONS.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 3 — crop-type chips driven by the lookups */}
            {!typesLoading && orderedTypes.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 border-t border-border/30 pt-2.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  <IconFilter className="size-3" strokeWidth={1.85} />
                  Type
                </span>
                <button
                  type="button"
                  onClick={() => onTypeFilterChange("all")}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    typeFilter === "all"
                      ? "border-transparent bg-foreground/90 text-background shadow-sm"
                      : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
                  )}
                >
                  All
                  <span
                    className={cn(
                      "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                      typeFilter === "all"
                        ? "bg-background/20 text-background"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {typeCounts.all ?? 0}
                  </span>
                </button>
                {orderedTypes.map((t) => (
                  <CropTypeFilterChip
                    key={t.id}
                    typeName={t.name}
                    label={t.displayName || t.name}
                    count={typeCounts[t.id] ?? 0}
                    active={typeFilter === t.id}
                    onClick={() => onTypeFilterChange(t.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ============ Grid region ========================================= */}
      <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {isError ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <ErrorState
                variant="error"
                title="Couldn't load crops"
                message="The crop list failed to load. Check your connection and try again."
                onRetry={refetch}
                retrying={isFetching}
                className="max-w-lg"
              />
            </div>
          ) : isLoading ? (
            <div className={GRID_COLS}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <CropCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyCrops onAdd={handleAdd} canAdd={canManageCrops} />
            </div>
          ) : (
            <div
              key={`crops-${activePage}-${typeFilter}-${farmFilter}-${statusFilter}-${search}-${sort}`}
              className={cn(GRID_COLS, "mt-1")}
            >
              {pagedCrops.map((c, i) => (
                <CropCard
                  key={c.id}
                  crop={c}
                  index={i}
                  onAdvance={() => handleAdvance(c)}
                  onEdit={() => handleEdit(c)}
                  canManage={canManageCrops}
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
              {filtered.length === 1 ? "crop" : "crops"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropsList;
