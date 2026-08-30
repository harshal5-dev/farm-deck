import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  IconSearch,
  IconX,
  IconFilter,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
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
  CROP_TYPE_ORDER,
  getCropType,
} from "@/features/crops/constants";
import {
  useActivateCropMutation,
  useInactivateCropMutation,
  useListCropsQuery,
} from "@/features/crops/cropApi";
import { setSelectedCatalogCrop } from "@/features/crops/selectedCatalogCropSlice";
import { buildPageList } from "@/features/crops/lib/format-crops";
import CropCatalogCard from "@/features/crops/components/CropCatalogCard";
import CropCatalogCardSkeleton from "@/features/crops/components/CropCatalogCardSkeleton";
import EmptyCropCatalog from "@/features/crops/components/EmptyCropCatalog";
import CropTypeFilterChip from "@/features/crops/components/CropTypeFilterChip";

const PAGE_SIZE = 6;
const GRID_COLS = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

const SORT_OPTIONS = [
  { id: "recent", label: "Recently updated" },
  { id: "name", label: "Name (A → Z)" },
  { id: "days", label: "Days to harvest" },
];

const CropCatalogView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { canManageCrops } = usePermissions();
  const { data, isLoading, isError, isFetching, refetch } =
    useListCropsQuery();
  const [inactivateCrop] = useInactivateCropMutation();
  const [activateCrop] = useActivateCropMutation();

  const crops = useMemo(() => data?.crops ?? [], [data]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [sort, setSort] = useState("recent");
  const [page, setPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const c = { all: crops.length };
    crops.forEach((crop) => {
      c[crop.category] = (c[crop.category] || 0) + 1;
    });
    return c;
  }, [crops]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = crops.filter((crop) => {
      if (statusFilter === "active" && !crop.isActive) return false;
      if (statusFilter === "archived" && crop.isActive) return false;
      if (categoryFilter !== "all" && crop.category !== categoryFilter)
        return false;
      if (q) {
        const hay = `${crop.name} ${crop.notes ?? ""} ${crop.category}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const sorter = {
      recent: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      name: (a, b) => a.name.localeCompare(b.name),
      days: (a, b) => {
        const da = a.daysToHarvest ?? Number.MAX_SAFE_INTEGER;
        const db = b.daysToHarvest ?? Number.MAX_SAFE_INTEGER;
        return da - db;
      },
    }[sort];
    if (sorter) out = [...out].sort(sorter);
    return out;
  }, [crops, categoryFilter, statusFilter, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);

  const pagedCrops = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, activePage]);

  const resetPage = (setter) => (next) => {
    setter(next);
    setPage(1);
  };

  const handleAdd = () => navigate("/app/crops/new");

  const handleEdit = (crop) => {
    dispatch(setSelectedCatalogCrop(crop));
    navigate("/app/crops/edit-crop");
  };

  const handleToggleActive = async (crop) => {
    try {
      if (crop.isActive) {
        await inactivateCrop(crop.id).unwrap();
        toast.success(`${crop.name} archived`, {
          description:
            "It's hidden from the picker but kept for history.",
        });
      } else {
        await activateCrop(crop.id).unwrap();
        toast.success(`${crop.name} reactivated`, {
          description: "It's back in the cycle picker.",
        });
      }
    } catch (err) {
      toast.error(
        crop.isActive ? "Could not archive crop" : "Could not reactivate crop",
        {
          description: err?.data?.error?.message || "Please try again.",
        }
      );
    }
  };

  const pageItems = buildPageList(activePage, totalPages);
  const startIndex =
    filtered.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(activePage * PAGE_SIZE, filtered.length);

  return (
    <div className="flex flex-col gap-3 lg:h-full lg:min-h-0">
      {/* Header strip — search / status / sort */}
      <Reveal duration={350}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/8 via-wheat/4 to-lagoon/8" />
          <div className="absolute -top-16 -right-10 size-40 rounded-full bg-leaf/12 blur-3xl" />

          <div className="relative flex flex-col gap-3 p-3.5 sm:p-4">
            <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-xs">
                <IconSearch
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                  strokeWidth={1.75}
                />
                <Input
                  value={search}
                  onChange={(e) => resetPage(setSearch)(e.target.value)}
                  placeholder="Search the catalog…"
                  className="pl-9"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => resetPage(setSearch)("")}
                    aria-label="Clear search"
                    className="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <IconX className="size-3.5" strokeWidth={2} />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex h-9 w-fit items-center gap-0.5 rounded-2xl border border-border/50 bg-card/60 p-1 shadow-sm">
                  {[
                    { id: "active", label: "Active" },
                    { id: "archived", label: "Archived" },
                    { id: "all", label: "All" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => resetPage(setStatusFilter)(s.id)}
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

                <Select
                  value={sort}
                  onValueChange={resetPage(setSort)}
                >
                  <SelectTrigger size="sm" aria-label="Sort catalog" className="h-9 min-w-38">
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

            <div className="flex flex-wrap items-center gap-2 border-t border-border/30 pt-2.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                <IconFilter className="size-3" strokeWidth={1.85} />
                Category
              </span>
              <button
                type="button"
                onClick={() => resetPage(setCategoryFilter)("all")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  categoryFilter === "all"
                    ? "border-transparent bg-foreground/90 text-background shadow-sm"
                    : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:bg-card/80 hover:text-foreground"
                )}
              >
                All
                <span
                  className={cn(
                    "ml-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold tabular-nums",
                    categoryFilter === "all"
                      ? "bg-background/20 text-background"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {categoryCounts.all ?? 0}
                </span>
              </button>
              {CROP_TYPE_ORDER.map((cat) =>
                categoryCounts[cat] ? (
                  <CropTypeFilterChip
                    key={cat}
                    category={cat}
                    label={getCropType(cat).label}
                    count={categoryCounts[cat] ?? 0}
                    active={categoryFilter === cat}
                    onClick={() => resetPage(setCategoryFilter)(cat)}
                  />
                ) : null
              )}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Grid region */}
      <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1">
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
          {isError ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <ErrorState
                variant="error"
                title="Couldn't load crops"
                message="The crop catalog failed to load. Check your connection and try again."
                onRetry={refetch}
                retrying={isFetching}
                className="max-w-lg"
              />
            </div>
          ) : isLoading ? (
            <div className={GRID_COLS}>
              {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <CropCatalogCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyCropCatalog onAdd={handleAdd} canAdd={canManageCrops} />
            </div>
          ) : (
            <div
              key={`cat-${activePage}-${categoryFilter}-${statusFilter}-${search}-${sort}`}
              className={cn(GRID_COLS, "mt-1")}
            >
              {pagedCrops.map((c, i) => (
                <CropCatalogCard
                  key={c.id}
                  crop={c}
                  index={i}
                  onEdit={() => handleEdit(c)}
                  onToggleActive={() => handleToggleActive(c)}
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

export default CropCatalogView;