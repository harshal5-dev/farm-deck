import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconCirclePlus,
  IconSearch,
  IconX,
  IconLayoutGrid,
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
import { getAreaUnitFactor } from "@/constants/farms";
import { usePermissions } from "@/features/auth/usePermissions";
import { ZONE_TYPE_ORDER } from "../constants";
import {
  useListZonesQuery,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
  useListFarmsForPickerQuery,
  useInactivateZoneMutation,
  useActivateZoneMutation,
} from "../zoneApi";
import { setSelectedZone } from "../selectedZoneSlice";
import { buildPageList } from "../lib/format";
import ZoneCard from "../components/ZoneCard";
import ZoneCardSkeleton from "../components/ZoneCardSkeleton";
import EmptyFields from "../components/EmptyFields";
import ZoneTypeFilterChip from "../components/ZoneTypeFilterChip";

const PAGE_SIZE = 6;
const GRID_COLS = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

const STATUS_OPTIONS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "inactive", label: "Inactive" },
];

const SORT_OPTIONS = [
  { id: "recent", label: "Recently updated" },
  { id: "name", label: "Name (A → Z)" },
  { id: "size", label: "Largest area" },
  { id: "newest", label: "Newest added" },
];

const FieldsList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data,
    isLoading,
    isError,
    isFetching,
    refetch,
  } = useListZonesQuery();
  const { zones = [], active = 0, inactive = 0, total = 0 } = data ?? {};
  const [inactivateZone] = useInactivateZoneMutation();
  const [activateZone] = useActivateZoneMutation();
  const { canViewFields, canManageFields } = usePermissions();

  const { data: zoneTypes = [], isLoading: typesLoading } =
    useListZoneTypesQuery();
  const { data: soilTypes = [] } = useListSoilTypesQuery();
  const { data: hydroSystemTypes = [] } = useListHydroSystemTypesQuery();
  const { data: farms = [] } = useListFarmsForPickerQuery();

  const [typeFilter, setTypeFilter] = useState("all");
  const [farmFilter, setFarmFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  // Decorate each zone with its resolved lookup rows so cards never
  // re-derive them (same pattern as the farms list).
  const decorated = useMemo(() => {
    const typeById = new Map(zoneTypes.map((t) => [t.id, t]));
    const soilById = new Map(soilTypes.map((s) => [s.id, s]));
    const hydroById = new Map(hydroSystemTypes.map((h) => [h.id, h]));
    return zones.map((z) => ({
      ...z,
      zoneType: typeById.get(z.zoneTypeId),
      soilType: z.soilDetails ? soilById.get(z.soilDetails.soilTypeId) : null,
      hydroSystemType: z.hydroDetails
        ? hydroById.get(z.hydroDetails.hydroSystemTypeId)
        : null,
    }));
  }, [zones, zoneTypes, soilTypes, hydroSystemTypes]);

  // Zone-type rows ordered like the visual config (unknown types last).
  const orderedTypes = useMemo(() => {
    const rank = (name) => {
      const idx = ZONE_TYPE_ORDER.indexOf(name);
      return idx === -1 ? ZONE_TYPE_ORDER.length : idx;
    };
    return [...zoneTypes].sort((a, b) =>
      rank(a.name) === rank(b.name)
        ? a.displayName.localeCompare(b.displayName)
        : rank(a.name) - rank(b.name)
    );
  }, [zoneTypes]);

  const typeCounts = useMemo(() => {
    const counts = { all: decorated.length };
    decorated.forEach((z) => {
      counts[z.zoneTypeId] = (counts[z.zoneTypeId] || 0) + 1;
    });
    return counts;
  }, [decorated]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = decorated.filter((z) => {
      if (typeFilter !== "all" && z.zoneTypeId !== typeFilter) return false;
      if (farmFilter !== "all" && z.farmId !== farmFilter) return false;
      if (statusFilter === "active" && !z.isActive) return false;
      if (statusFilter === "inactive" && z.isActive) return false;
      if (q) {
        const hay = `${z.name} ${z.farmName ?? ""} ${z.notes ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorter = {
      recent: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      name: (a, b) => a.name.localeCompare(b.name),
      size: (a, b) =>
        (b.area || 0) * getAreaUnitFactor(b.areaUnit) -
        (a.area || 0) * getAreaUnitFactor(a.areaUnit),
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    }[sort];
    if (sorter) out = [...out].sort(sorter);
    return out;
  }, [decorated, typeFilter, farmFilter, statusFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);

  const pagedZones = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, activePage]);

  // Permission gate — bounce anyone without `fields.view` back to the
  // dashboard.
  if (!canViewFields) return <Navigate to="/app" replace />;

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

  const handleAdd = () => navigate("/app/fields/new");

  const handleEdit = (z) => {
    dispatch(setSelectedZone(z));
    navigate("/app/fields/edit");
  };

  const handleDeactivate = async (zone) => {
    try {
      await inactivateZone(zone.id).unwrap();
      toast.success("Field deactivated", {
        description: `${zone.name} is now marked inactive.`,
      });
    } catch (err) {
      toast.error("Could not deactivate field", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleActivate = async (zone) => {
    try {
      await activateZone(zone.id).unwrap();
      toast.success("Field reactivated", {
        description: `${zone.name} is back in the active list.`,
      });
    } catch (err) {
      // Most likely the 409: another active field took this name while
      // it was archived (uq_zones_farm_name_live).
      toast.error("Could not reactivate field", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ============ Compact header ===================================== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-lagoon/10 via-leaf/5 to-sky-warm/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-lagoon/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-leaf/12 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:p-5">
            {/* Row 1 — title + counts | actions */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-lagoon/30 to-leaf/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-lagoon to-lagoon-deep text-white shadow-md ring-1 ring-white/10">
                    <IconLayoutGrid className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <h1 className="font-heading text-lg font-bold tracking-tight sm:text-xl">
                    Fields
                  </h1>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {active}
                      </span>{" "}
                      active
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-muted-foreground/40" />
                      <span className="font-semibold text-foreground tabular-nums">
                        {inactive}
                      </span>{" "}
                      inactive
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="font-semibold text-foreground tabular-nums">
                        {total}
                      </span>{" "}
                      total
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {canManageFields && (
                  <Button
                    onClick={handleAdd}
                    size="sm"
                    className="gap-1.5 shadow-md shadow-lagoon/25"
                  >
                    <IconCirclePlus className="size-4" strokeWidth={1.85} />
                    Add field
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
                  placeholder="Search by name, farm or notes…"
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
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onStatusFilterChange(s.id)}
                      className={cn(
                        "inline-flex h-7 items-center gap-1.5 rounded-xl px-2.5 text-xs font-semibold transition-all duration-200",
                        statusFilter === s.id
                          ? "bg-linear-to-br from-lagoon to-lagoon-deep text-primary-foreground shadow-sm shadow-lagoon/30"
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
                    aria-label="Sort fields"
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

            {/* Row 3 — zone-type chips driven by the lookups */}
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
                  <ZoneTypeFilterChip
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
                title="Couldn't load fields"
                message="The field list failed to load. Check your connection and try again."
                onRetry={refetch}
                retrying={isFetching}
                className="max-w-lg"
              />
            </div>
          ) : isLoading ? (
            <div className={GRID_COLS}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <ZoneCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyFields onAdd={handleAdd} canAdd={canManageFields} />
            </div>
          ) : (
            <div
              key={`zones-${activePage}-${typeFilter}-${farmFilter}-${statusFilter}-${search}-${sort}`}
              className={cn(GRID_COLS, "mt-1")}
            >
              {pagedZones.map((z, i) => (
                <ZoneCard
                  key={z.id}
                  zone={z}
                  index={i}
                  onDeactivate={() => handleDeactivate(z)}
                  onActivate={() => handleActivate(z)}
                  onEdit={() => handleEdit(z)}
                  canManage={canManageFields}
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
              {filtered.length === 1 ? "field" : "fields"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FieldsList;
