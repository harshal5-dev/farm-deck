import { useNavigate } from "react-router-dom";
import {
  IconCheck,
  IconConfetti,
  IconLayoutGrid,
  IconPlant2,
  IconTractor,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/** Summary chip for the finale — gradient icon + label. */
const SummaryChip = ({ icon: Icon, label, tone, gradient }) => (
  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-3 py-1.5 text-xs font-semibold backdrop-blur-sm">
    <span
      className={cn(
        "inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-linear-to-br text-white",
        gradient
      )}
    >
      <Icon className="size-3" strokeWidth={2.2} />
    </span>
    <span className={cn("truncate", tone)}>{label}</span>
  </span>
);

/**
 * SetupSuccess — the wizard finale. Everything was saved
 * progressively, so this screen only celebrates and routes.
 */
const SetupSuccess = ({ farm, zones, crops }) => {
  const navigate = useNavigate();

  return (
    <div className="glass-card texture-paper highlight-edge relative w-full max-w-2xl overflow-hidden rounded-3xl py-14 text-center">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-leaf/10 via-wheat/6 to-lagoon/10" />
      <div className="absolute -top-16 left-1/2 size-64 -translate-x-1/2 rounded-full bg-leaf/15 blur-3xl" />
      <div className="pattern-contour absolute inset-0 opacity-40 mix-blend-soft-light" />

      <div className="relative flex flex-col items-center gap-4 px-6">
        <div className="relative">
          <div className="absolute -inset-2 animate-glow-pulse rounded-3xl bg-linear-to-br from-leaf/40 to-lagoon/40 blur-lg" />
          <div className="relative flex size-16 items-center justify-center rounded-3xl bg-linear-to-br from-leaf to-sage-deep text-white shadow-lg ring-1 ring-white/10">
            <IconConfetti className="size-8" strokeWidth={1.6} />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
            {farm.name} is ready
          </h2>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            Everything is saved. Your fields are live, and your first crops
            are on the calendar — go watch them grow.
          </p>
        </div>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <SummaryChip
            icon={IconTractor}
            label={farm.name}
            tone="text-foreground"
            gradient="from-leaf to-sage-deep"
          />
          <SummaryChip
            icon={IconLayoutGrid}
            label={`${zones.length} ${zones.length === 1 ? "field" : "fields"}`}
            tone="text-lagoon-deep dark:text-lagoon"
            gradient="from-lagoon to-lagoon-deep"
          />
          {crops.length > 0 && (
            <SummaryChip
              icon={IconPlant2}
              label={`${crops.length} ${crops.length === 1 ? "crop" : "crops"} planned`}
              tone="text-wheat-deep dark:text-wheat"
              gradient="from-wheat to-clay-deep"
            />
          )}
        </div>

        <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row">
          <Button
            onClick={() => navigate("/app/fields")}
            className="gap-2 shadow-md shadow-leaf/25"
          >
            <IconCheck className="size-4" strokeWidth={2} />
            View your fields
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/app/crops")}
            className="gap-2"
          >
            <IconPlant2 className="size-4" strokeWidth={1.85} />
            Go to Crops
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SetupSuccess;
