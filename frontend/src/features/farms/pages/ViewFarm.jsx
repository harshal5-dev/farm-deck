import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Reveal, FarmTypeArt } from "@/components/effects";
import { cn } from "@/lib/utils";
import {
  IconArrowLeft,
  IconCalendarPlus,
  IconChartDots,
  IconLayoutGrid,
  IconMapPin,
  IconNote,
  IconPencil,
  IconRuler2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorState from "@/components/ui/error-state";
import { usePermissions } from "@/features/auth/usePermissions";
import { getFarmType } from "@/constants/farms";
import { formatArea, formatCoords, formatDate } from "../lib/format";
import { selectSelectedFarm, clearSelectedFarm } from "../selectedFarmSlice";
import { useGetFarmDetailsQuery } from "../farmApi";
import {
  useListZonesByFarmQuery,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
} from "@/features/zones/zoneApi";
import ZoneCard from "@/features/zones/components/ZoneCard";
import EmptyZones from "@/features/zones/components/EmptyZones";

/** Stat tile for the hero strip. */
const StatTile = ({ icon: Icon, tone, value, label }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-0.5 rounded-xl border border-border/40 bg-muted/25 px-3 py-2.5">
    <span className={cn("flex size-7 items-center justify-center rounded-lg border", tone)}>
      <Icon className="size-3.5" strokeWidth={1.85} />
    </span>
    <span className="truncate pt-1 font-heading text-sm font-bold tabular-nums">
      {value}
    </span>
    <span className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
      {label}
    </span>
  </div>
);

const ViewFarm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const farm = useSelector(selectSelectedFarm);
  const { canManageFarms } = usePermissions();

  const {
    data: details,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetFarmDetailsQuery({ id: farm?.id }, { skip: !farm });

  const { data: zoneTypes = [] } = useListZoneTypesQuery();
  const { data: soilTypes = [] } = useListSoilTypesQuery();
  const { data: hydroSystemTypes = [] } = useListHydroSystemTypesQuery();
  // transformResult unwraps the envelope to { zones, active, … } — the
  // array itself lives on .zones.
  const {
    data: farmZonesPage,
    isLoading: zonesLoading,
  } = useListZonesByFarmQuery(farm?.id, { skip: !farm });
  const farmZones = farmZonesPage?.zones ?? [];

  if (!farm) return <Navigate to="/app/farms" replace />;

  const t = getFarmType(details?.farmTypeName ?? farm.farmTypeName);
  const TypeIcon = t.icon;
  const coords = formatCoords(
    details?.latitude ?? farm.latitude,
    details?.longitude ?? farm.longitude,
    3
  );
  const stats = details?.stats;
  const modeCounts = stats?.fieldsByCultivationMode ?? {};

  // Decorate the farm's fields so ZoneCard gets its lookup rows.
  const typeById = new Map(zoneTypes.map((x) => [x.id, x]));
  const soilById = new Map(soilTypes.map((x) => [x.id, x]));
  const hydroById = new Map(hydroSystemTypes.map((x) => [x.id, x]));
  const decorated = farmZones.map((z) => ({
    ...z,
    zoneType: typeById.get(z.zoneTypeId),
    soilType: z.soilTypeDetails ? soilById.get(z.soilTypeDetails.soilTypeID) : null,
    hydroSystemType: z.hydroSystemTypeDetails
      ? hydroById.get(z.hydroSystemTypeDetails.hydroSystemTypeID)
      : null,
  }));

  const MODE_CHIPS = [
    {
      id: "soil",
      label: "Soil",
      count: modeCounts.soil ?? 0,
      chip: "border-wheat/30 bg-wheat/10 text-clay-deep dark:text-wheat",
    },
    {
      id: "hydro",
      label: "Hydro",
      count: modeCounts.hydro ?? 0,
      chip: "border-lagoon/30 bg-lagoon/10 text-lagoon-deep dark:text-lagoon",
    },
    {
      id: "other",
      label: "Other",
      count: modeCounts.other ?? 0,
      chip: "border-iris/30 bg-iris/10 text-iris-deep dark:text-iris",
    },
  ];

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app/farms"
          onClick={() => dispatch(clearSelectedFarm())}
          className="group mb-3 inline-flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Farms
        </Link>
      </Reveal>

      {/* ===== Hero ===== */}
      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 shrink-0 overflow-hidden rounded-2xl">
          <div className={cn("absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80", t.gradient)} />
          <div className="relative h-28 w-full overflow-hidden">
            <FarmTypeArt variant={t.art} className="size-full" />
            <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
          </div>

          <div className="relative flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:pb-5">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cn(
                  "relative -mt-10 flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg ring-[3px] ring-card",
                  "bg-linear-to-br",
                  t.gradient
                )}
              >
                <TypeIcon className="size-6" strokeWidth={1.85} />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm",
                      t.border,
                      t.bg,
                      t.text
                    )}
                  >
                    {details?.farmTypeDisplayName || farm.farmTypeDisplayName}
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase",
                      (details?.isActive ?? farm.isActive)
                        ? "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400"
                        : "border-border/60 bg-muted/40 text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        (details?.isActive ?? farm.isActive) ? "bg-emerald-500" : "bg-muted-foreground/50"
                      )}
                    />
                    {(details?.isActive ?? farm.isActive) ? "Active" : "Inactive"}
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  {details?.name ?? farm.name}
                </h1>
                <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex min-w-0 items-center gap-1">
                    <IconMapPin className="size-3.5 shrink-0" strokeWidth={1.85} />
                    <span className="truncate">
                      {details?.location ?? farm.location ?? "Location not set"}
                    </span>
                  </span>
                  {coords && (
                    <span className="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums">
                      <IconChartDots className="size-3.5 shrink-0 text-sky-warm" strokeWidth={1.85} />
                      {coords}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {canManageFarms && (
              <Button
                size="sm"
                className="shrink-0 gap-1.5"
                onClick={() => navigate("/app/farms/edit")}
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
                Edit farm
              </Button>
            )}
          </div>
        </div>
      </Reveal>

      {/* ===== KPI strip ===== */}
      <Reveal delay={120} duration={450}>
        <div className="mb-4 grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
          <StatTile
            icon={IconRuler2}
            tone="border-leaf/25 bg-leaf/10 text-leaf"
            value={formatArea(details?.totalArea ?? farm.totalArea, details?.areaUnit ?? farm.areaUnit)}
            label="Farm area"
          />
          <StatTile
            icon={IconLayoutGrid}
            tone="border-lagoon/25 bg-lagoon/10 text-lagoon-deep dark:text-lagoon"
            value={
              stats
                ? `${stats.activeFields}/${stats.totalFields}`
                : "—"
            }
            label="Fields active"
          />
          <StatTile
            icon={IconChartDots}
            tone="border-sky-warm/25 bg-sky-warm/10 text-sky-warm"
            value={stats ? `${stats.areaUtilizationPct}%` : "—"}
            label="Area in fields"
          />
          <StatTile
            icon={IconCalendarPlus}
            tone="border-wheat/30 bg-wheat/10 text-wheat-deep dark:text-wheat"
            value={formatDate(details?.createdAt ?? farm.createdAt)}
            label="Added"
          />
        </div>
      </Reveal>

      {/* ===== Mode split + notes ===== */}
      <Reveal delay={160} duration={450}>
        <div className="mb-4 grid shrink-0 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
            <p className="mb-2.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              Cultivation mix
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {MODE_CHIPS.map((m) => (
                <span
                  key={m.id}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                    m.chip
                  )}
                >
                  {m.label}
                  <span className="font-bold tabular-nums">{m.count}</span>
                </span>
              ))}
              {stats?.totalFields === 0 && (
                <span className="text-xs text-muted-foreground/70 italic">
                  No fields yet
                </span>
              )}
            </div>
            {stats && stats.totalFields > 0 && (
              <div className="mt-3">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-leaf to-lagoon transition-all duration-700"
                    style={{ width: `${Math.max(3, stats.areaUtilizationPct)}%` }}
                  />
                </div>
                <p className="mt-1.5 text-[10px] text-muted-foreground/70">
                  {formatArea(stats.areaAllocated, stats.areaUnit)} of{" "}
                  {formatArea(details.totalArea, details.areaUnit)} allocated to fields
                </p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/40 bg-card/40 p-4">
            <p className="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              <IconNote className="size-3" strokeWidth={1.85} />
              Notes
            </p>
            <p
              className={cn(
                "line-clamp-4 text-xs leading-relaxed",
                (details?.notes ?? farm.notes)
                  ? "text-foreground/85"
                  : "text-muted-foreground/55 italic"
              )}
            >
              {details?.notes ??
                farm.notes ??
                "No notes yet — crops, water source, anything worth remembering…"}
            </p>
          </div>
        </div>
      </Reveal>

      {/* ===== Fields on this farm ===== */}
      <Reveal delay={200} duration={500}>
        <div className="mb-2.5 flex shrink-0 items-center justify-between">
          <h2 className="font-heading text-base font-bold tracking-tight">
            Fields on this farm
            {stats && (
              <span className="ml-2 text-xs font-semibold text-muted-foreground tabular-nums">
                {stats.totalFields}
              </span>
            )}
          </h2>
        </div>
      </Reveal>

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
        {isError ? (
          <div className="flex min-h-64 items-center justify-center py-6">
            <ErrorState
              variant="error"
              title="Couldn't load farm details"
              message="The farm details failed to load. Check your connection and try again."
              onRetry={refetch}
              retrying={isFetching}
              className="max-w-lg"
            />
          </div>
        ) : isLoading || zonesLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        ) : decorated.length === 0 ? (
          <div className="flex min-h-56 items-center justify-center py-4">
            <EmptyZones
              onAdd={() => navigate("/app/fields/new")}
              canAdd={canManageFarms}
            />
          </div>
        ) : (
          <div className="grid gap-4 pb-1 sm:grid-cols-2 lg:grid-cols-3">
            {decorated.map((z, i) => (
              <ZoneCard key={z.id} zone={z} index={i} canManage={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFarm;
