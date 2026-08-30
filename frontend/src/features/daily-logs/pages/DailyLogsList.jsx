import { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconCalendarStats,
  IconCirclePlus,
  IconDroplet,
  IconLeaf,
  IconPlant2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  useDeleteLogMutation,
  useListLogsQuery,
} from "../dailyLogApi";
import { useListCyclesQuery } from "@/features/crops/cropApi";
import { getZoneRow } from "@/features/fields/mock/zoneDb";
import { getCropType } from "@/features/crops/constants";
import { setSelectedDailyLog } from "../selectedDailyLogSlice";
import { buildPageList, formatDate } from "@/features/farms/lib/format";
import DailyLogRow from "../components/DailyLogRow";
import DailyLogRowSkeleton from "../components/DailyLogRowSkeleton";
import EmptyDailyLogs from "../components/EmptyDailyLogs";
import {
  formatMetric,
  relativeLogDay,
} from "../lib/format";

const PAGE_SIZE = 8;

const DailyLogsList = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { canManageCrops } = usePermissions();

  const { data: cyclesData } = useListCyclesQuery();
  const cycleBase = useMemo(
    () => (cyclesData?.cycles ?? []).find((c) => c.id === cycleId) ?? null,
    [cyclesData, cycleId]
  );

  // The cycle's log_type is denormalised from the zone's cultivation
  // mode — same rule the mock + form use.
  const logType = useMemo(() => {
    const zone = cycleBase ? getZoneRow(cycleBase.zoneId) : null;
    return zone?.zoneTypeName === "soil" ? "soil" : "hydro";
  }, [cycleBase]);

  const { data, isLoading, isError, isFetching, refetch } = useListLogsQuery(
    { cycleId },
    { skip: !cycleId }
  );
  const logs = useMemo(() => data?.logs ?? [], [data]);
  const [deleteLog, { isLoading: deleting }] = useDeleteLogMutation();
  const [page, setPage] = useState(1);

  const crop = cycleBase?.crop ?? null;
  const t = getCropType(crop?.category);

  // Stats — count, latest reading, out-of-target drift, nutrients flag
  const stats = useMemo(() => {
    if (logs.length === 0) {
      return { count: 0, latest: null, driftCount: 0, lastNutrients: false };
    }
    const latest = logs[0];
    let drift = 0;
    ["ph", "ec", "ppm"].forEach((k) => {
      const value = latest[k];
      const range = (() => {
        if (!crop) return null;
        if (k === "ph") return [crop.targetPhMin, crop.targetPhMax];
        if (k === "ec") return [crop.targetEcMin, crop.targetEcMax];
        if (k === "ppm") return [crop.targetPpmMin, crop.targetPpmMax];
        return [null, null];
      })();
      if (!range || (range[0] == null && range[1] == null)) return;
      if (value == null) return;
      const n = Number(value);
      if (Number.isNaN(n)) return;
      if ((range[0] != null && n < range[0]) || (range[1] != null && n > range[1]))
        drift += 1;
    });
    return {
      count: logs.length,
      latest,
      driftCount: drift,
      lastNutrients: latest.nutrientsAdded,
    };
  }, [logs, crop]);

  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));
  const activePage = Math.min(page, totalPages);
  const pagedLogs = useMemo(() => {
    const start = (activePage - 1) * PAGE_SIZE;
    return logs.slice(start, start + PAGE_SIZE);
  }, [logs, activePage]);

  if (!cycleId) return <Navigate to="/app/crops" replace />;
  if (!canManageCrops) return <Navigate to="/app/crops" replace />;
  if (!cycleBase) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <ErrorState
          variant="error"
          title="Cycle not found"
          message="That cycle is no longer in the catalog."
          onRetry={() => navigate("/app/crops")}
          retrying={false}
        />
      </div>
    );
  }

  const pageItems = buildPageList(activePage, totalPages);
  const startIndex = logs.length === 0 ? 0 : (activePage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(activePage * PAGE_SIZE, logs.length);

  const handleAdd = () => navigate(`/app/crops/cycle/${cycleId}/logs/new`);
  const handleEdit = (log) => {
    dispatch(setSelectedDailyLog(log));
    navigate(`/app/crops/cycle/${cycleId}/logs/edit`);
  };
  const handleDelete = async (log) => {
    if (!confirm(`Delete the log for ${log.logDate}? This can't be undone.`)) return;
    try {
      await deleteLog(log.id).unwrap();
      toast.success(`Log deleted`, {
        description: `${formatMetric("ph", log.ph) ?? "—"} · ${formatMetric("ec", log.ec) ?? "—"} reading removed.`,
      });
    } catch (err) {
      toast.error("Could not delete log", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100svh-6.5rem)] lg:overflow-hidden">
      {/* ===== Header ===================================================== */}
      <Reveal duration={400}>
        <div className="glass-card texture-paper highlight-edge relative shrink-0 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-linear-to-br from-leaf/10 via-wheat/5 to-lagoon/10" />
          <div className="absolute -top-16 -right-10 size-48 rounded-full bg-leaf/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-48 rounded-full bg-wheat/12 blur-3xl" />

          <div className="relative flex flex-col gap-3 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-leaf/30 to-wheat/30 opacity-60 blur-md" />
                  <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
                    <IconCalendarStats className="size-5" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigate("/app/crops")}
                      className="group inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground"
                    >
                      <IconArrowLeft
                        className="size-2.5 transition-transform group-hover:-translate-x-0.5"
                        strokeWidth={2.2}
                      />
                      Crops
                    </button>
                    <span className="text-[10px] text-muted-foreground/40">/</span>
                    <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Daily logs
                    </span>
                  </div>
                  <h1 className="truncate font-heading text-lg font-bold tracking-tight sm:text-xl">
                    {cycleBase.name || "Daily logs"}
                  </h1>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                    {crop && (
                      <>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1",
                            t.text
                          )}
                        >
                          <t.icon className="size-3.5" strokeWidth={1.85} />
                          {crop.name}
                        </span>
                        <span className="text-muted-foreground/40">·</span>
                      </>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <IconPlant2 className="size-3.5" strokeWidth={1.85} />
                      {cycleBase.zoneName}
                      {cycleBase.farmName ? ` · ${cycleBase.farmName}` : ""}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-[11px] font-medium">
                      {getLogTypeLabel(logType)}
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
                    Add today's log
                  </Button>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 border-t border-border/30 pt-3 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-leaf" />
                <span className="font-semibold text-foreground tabular-nums">
                  {stats.count}
                </span>{" "}
                {stats.count === 1 ? "log" : "logs"}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1">
                <IconDroplet className="size-3.5 text-lagoon" strokeWidth={1.85} />
                <span className="font-semibold text-foreground tabular-nums">
                  {stats.latest ? formatDate(stats.latest.logDate) : "—"}
                </span>
                {stats.latest && (
                  <span className="text-[10px] text-muted-foreground/70">
                    ({relativeLogDay(stats.latest.logDate)})
                  </span>
                )}
              </span>
              {stats.latest && (
                <>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span
                      className={cn(
                        "size-1.5 rounded-full",
                        stats.driftCount > 0 ? "bg-amber-500" : "bg-emerald-500"
                      )}
                    />
                    <span className="font-semibold text-foreground tabular-nums">
                      {stats.driftCount}
                    </span>{" "}
                    out-of-target
                  </span>
                  {stats.lastNutrients && (
                    <>
                      <span className="text-muted-foreground/40">·</span>
                      <span className="inline-flex items-center gap-1 text-leaf">
                        <IconLeaf className="size-3.5" strokeWidth={2.2} />
                        nutrients added
                      </span>
                    </>
                  )}
                </>
              )}
            </div>
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
                title="Couldn't load logs"
                message="The log list failed to load. Check your connection and try again."
                onRetry={refetch}
                retrying={isFetching}
                className="max-w-lg"
              />
            </div>
          ) : isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <DailyLogRowSkeleton key={i} />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex min-h-64 items-center justify-center py-6">
              <EmptyDailyLogs
                onAdd={handleAdd}
                canAdd={canManageCrops}
              />
            </div>
          ) : (
            <div className="space-y-2">
              {pagedLogs.map((log, i) => (
                <DailyLogRow
                  key={log.id}
                  log={log}
                  index={i}
                  onEdit={() => handleEdit(log)}
                  onDelete={() => handleDelete(log)}
                  canManage={canManageCrops && !deleting}
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
                {logs.length}
              </span>{" "}
              {logs.length === 1 ? "log" : "logs"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/** Label for the denormalised log type — mirrors LOG_TYPES in constants. */
const getLogTypeLabel = (id) => (id === "soil" ? "Soil log" : "Hydroponic log");

export default DailyLogsList;
