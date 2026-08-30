import { useMemo } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IconArrowLeft, IconScale } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { usePermissions } from "@/features/auth/usePermissions";
import { useListCyclesQuery } from "@/features/crops/cropApi";
import { useCreateHarvestMutation } from "../harvestApi";
import HarvestForm from "../components/harvest-form/HarvestForm";
import { formatYield } from "../lib/format";

const AddHarvest = () => {
  const navigate = useNavigate();
  const { canLogHarvests } = usePermissions();
  const [createHarvest, { isLoading }] = useCreateHarvestMutation();

  const { data: cyclesData, isLoading: cyclesLoading } = useListCyclesQuery();
  // Planned cycles haven't grown anything — nothing to harvest off them.
  const cycles = useMemo(
    () =>
      (cyclesData?.cycles ?? []).filter((c) => c.status !== "planned"),
    [cyclesData]
  );

  if (!canLogHarvests) return <Navigate to="/app/harvests" replace />;

  const handleSubmit = async (values) => {
    try {
      const created = await createHarvest(values).unwrap();
      toast.success("Harvest logged", {
        description: `${created.cropName} · ${formatYield(created.totalYieldGrams) ?? "—"} on ${created.harvestDate}.`,
      });
      navigate("/app/harvests", { replace: true });
    } catch (err) {
      toast.error("Could not log harvest", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col lg:h-full lg:min-h-0">
      <Reveal duration={350}>
        <Link
          to="/app/harvests"
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
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-leaf to-wheat-deep opacity-80" />
          <div className="absolute inset-0 bg-linear-to-br from-leaf to-wheat-deep opacity-30" />
          <div className="absolute -top-16 -right-12 size-48 rounded-full bg-wheat/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-10 size-56 rounded-full bg-leaf/15 blur-3xl" />
          <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

          <div className="relative flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-wheat/30 opacity-60 blur-md" />
                <div className="relative flex size-10 items-center justify-center rounded-2xl bg-linear-to-br from-leaf to-wheat-deep text-white shadow-md ring-1 ring-white/10">
                  <IconScale className="size-5" strokeWidth={1.85} />
                </div>
              </div>
              <div className="min-w-0">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border border-wheat/30 bg-wheat/15 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-wheat-deep uppercase backdrop-blur-sm dark:text-wheat"
                    )}
                  >
                    Harvest
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground/70">
                    New entry
                  </span>
                </div>
                <h1 className="truncate font-heading text-xl font-bold tracking-tight sm:text-2xl">
                  Log a harvest
                </h1>
                <p className="truncate text-[11px] text-muted-foreground sm:text-xs">
                  Record what came off a cycle — yield, grade and price.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate("/app/harvests")}
                disabled={isLoading}
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
              mode="create"
              cycles={cycles}
              onSubmit={handleSubmit}
              onCancel={() => navigate("/app/harvests")}
              submitting={isLoading}
            />
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default AddHarvest;
