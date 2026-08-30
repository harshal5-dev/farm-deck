import { useEffect, useMemo } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IconArrowLeft, IconCalendarStats } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { useListCyclesQuery } from "@/features/crops/cropApi";
import { useUpdateLogMutation } from "../dailyLogApi";
import { getZoneRow } from "@/features/fields/mock/zoneDb";
import DailyLogForm from "../components/daily-log-form/DailyLogForm";
import {
  clearSelectedDailyLog,
  selectSelectedDailyLog,
} from "../selectedDailyLogSlice";
import { getLogType } from "../constants";

const EditDailyLog = () => {
  const { cycleId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const log = useSelector(selectSelectedDailyLog);
  const [updateLog, { isLoading: submitting }] = useUpdateLogMutation();
  const { canManageCrops } = usePermissions();

  const { data: cyclesData, isLoading: cyclesLoading } =
    useListCyclesQuery();
  const cycleBase = useMemo(
    () => (cyclesData?.cycles ?? []).find((c) => c.id === cycleId) ?? null,
    [cyclesData, cycleId]
  );

  const zone = cycleBase ? getZoneRow(cycleBase.zoneId) : null;
  const logType = (() => {
    if (!zone) return "hydro";
    if (zone.zoneTypeName === "soil") return "soil";
    return "hydro";
  })();
  const cycle = cycleBase ? { ...cycleBase, logType } : null;

  useEffect(() => {
    if (!log) navigate(`/app/crops/cycle/${cycleId}/logs`, { replace: true });
  }, [log, cycleId, navigate]);

  if (!cycleId) return <Navigate to="/app/crops" replace />;
  if (!canManageCrops) return <Navigate to="/app/crops" replace />;

  if (!log) return null;

  const t = getLogType(log.logType ?? logType);

  const handleSubmit = async (values) => {
    try {
      const updated = await updateLog({ id: log.id, ...values }).unwrap();
      dispatch(clearSelectedDailyLog());
      toast.success("Log updated", {
        description: `${updated.logDate} reading saved.`,
      });
      navigate(`/app/crops/cycle/${cycleId}/logs`, { replace: true });
    } catch (err) {
      toast.error("Could not update log", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedDailyLog());
    navigate(`/app/crops/cycle/${cycleId}/logs`);
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      <Reveal duration={350}>
        <Link
          to={`/app/crops/cycle/${cycleId}/logs`}
          onClick={() => dispatch(clearSelectedDailyLog())}
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Daily logs
        </Link>
      </Reveal>

      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
              t.gradient
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-30",
              t.gradient
            )}
          />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-leaf/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-wheat/15 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div
                  className={cn(
                    "absolute -inset-1 rounded-2xl opacity-60 blur-md",
                    t.bg
                  )}
                />
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ring-1 ring-white/10",
                    t.gradient
                  )}
                >
                  <IconCalendarStats className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm",
                      t.border,
                      t.bg,
                      t.text
                    )}
                  >
                    {t.label} log
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    Editing
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit daily log
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Update the {log.logDate} reading for{" "}
                  {cycleBase?.crop?.name ?? "this cycle"} on{" "}
                  {cycleBase?.zoneName ?? "the field"}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                disabled={submitting}
                className="gap-1.5"
              >
                <IconArrowLeft className="size-3.5" strokeWidth={1.85} />
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={140} duration={500}>
        <div className="glass-card texture-paper highlight-edge flex flex-col rounded-2xl p-4 sm:p-5 lg:min-h-0 lg:flex-1 lg:overflow-hidden">
          {cyclesLoading ? (
            <div className="grid h-64 place-items-center">
              <p className="text-sm text-muted-foreground">
                Loading cycle…
              </p>
            </div>
          ) : (
            <DailyLogForm
              mode="edit"
              cycle={cycle}
              defaultValues={log}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              submitting={submitting}
            />
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default EditDailyLog;