import { useEffect, useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { IconArrowLeft, IconScale } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { useListCyclesQuery } from "@/features/crops/cropApi";
import { useUpdateHarvestMutation } from "../harvestApi";
import {
  clearSelectedHarvest,
  selectSelectedHarvest,
} from "../selectedHarvestSlice";
import HarvestForm from "../components/harvest-form/HarvestForm";
import { getGrade } from "../constants";
import { formatDate } from "@/features/farms/lib/format";
import { formatYield } from "../lib/format";

const EditHarvest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const harvest = useSelector(selectSelectedHarvest);
  const [updateHarvest, { isLoading: submitting }] = useUpdateHarvestMutation();
  const { canLogHarvests } = usePermissions();

  const { data: cyclesData, isLoading: cyclesLoading } = useListCyclesQuery();
  // Exclude planned cycles, but always keep the harvest's own cycle
  // selectable even if its status has since changed.
  const cycles = useMemo(
    () =>
      (cyclesData?.cycles ?? []).filter(
        (c) => c.status !== "planned" || c.id === harvest?.cycleId
      ),
    [cyclesData, harvest?.cycleId]
  );

  useEffect(() => {
    if (!harvest) navigate("/app/harvests", { replace: true });
  }, [harvest, navigate]);

  if (!canLogHarvests) return <Navigate to="/app/harvests" replace />;
  if (!harvest) return null;

  const grade = getGrade(harvest.qualityGrade);

  const handleSubmit = async (values) => {
    try {
      const updated = await updateHarvest({ id: harvest.id, ...values }).unwrap();
      dispatch(clearSelectedHarvest());
      toast.success("Harvest updated", {
        description: `${updated.cropName} · ${formatYield(updated.totalYieldGrams) ?? "—"} on ${updated.harvestDate} saved.`,
      });
      navigate("/app/harvests", { replace: true });
    } catch (err) {
      toast.error("Could not update harvest", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const handleCancel = () => {
    dispatch(clearSelectedHarvest());
    navigate("/app/harvests");
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      <Reveal duration={350}>
        <Link
          to="/app/harvests"
          onClick={() => dispatch(clearSelectedHarvest())}
          className="group mb-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Harvests
        </Link>
      </Reveal>

      <Reveal delay={60} duration={450}>
        <div className="glass-card texture-paper highlight-edge relative mb-4 overflow-hidden rounded-2xl">
          <div
            className={cn(
              "absolute inset-x-0 top-0 h-1 bg-linear-to-r opacity-80",
              grade?.gradient ?? "from-leaf to-wheat-deep"
            )}
          />
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-br opacity-30",
              grade?.gradient ?? "from-leaf to-wheat-deep"
            )}
          />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-leaf/15 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-wheat/30 opacity-60 blur-md" />
                <div
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-md ring-1 ring-white/10",
                    grade?.gradient ?? "from-leaf to-wheat-deep"
                  )}
                >
                  <IconScale className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase backdrop-blur-sm",
                      grade?.chip ??
                        "border-wheat/30 bg-wheat/15 text-wheat-deep dark:text-wheat"
                    )}
                  >
                    {grade?.label ?? "Not graded"}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    Editing
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Edit harvest
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  {harvest.cropName} · {formatYield(harvest.totalYieldGrams) ?? "—"} on{" "}
                  {formatDate(harvest.harvestDate)}.
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
                Loading cycles…
              </p>
            </div>
          ) : (
            <HarvestForm
              mode="edit"
              cycles={cycles}
              defaultValues={harvest}
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

export default EditHarvest;
