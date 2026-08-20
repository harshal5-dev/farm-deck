import { cn } from "@/lib/utils";
import { FarmTypeArt } from "@/components/effects";
import { getFarmType, getSoilType } from "@/constants/farms";
import { FarmStatusPill, FarmTypePill } from "../pills";

const FarmIdentityPreview = ({
  name,
  location,
  farmType,
  soilType,
  status,
  sizeAcres,
}) => {
  const t = getFarmType(farmType);
  const soil = getSoilType(soilType);
  const TypeIcon = t.icon;
  const displayName = (name || "").trim() || "New farm";
  const displayLocation = (location || "").trim() || "Location not set";
  const acres = sizeAcres === "" || sizeAcres == null ? 0 : Number(sizeAcres);

  return (
    <div className="relative flex items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full">
      {/* Top hero band — live FarmTypeArt preview that reacts to the
          selected farmType so the form feels alive as you click between
          cards. */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <FarmTypeArt variant={t.art} className="size-full" />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-30",
            t.gradient
          )}
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center px-5 pt-0 pb-5">
        {/* Identity cluster overlaps the hero band */}
        <div className="-mt-9 flex flex-col items-center text-center">
          <div className="relative">
            <div
              className={cn(
                "absolute -inset-2 rounded-full opacity-70 blur-md",
                t.bg
              )}
            />
            <div
              className={cn(
                "relative flex size-[72px] items-center justify-center overflow-hidden rounded-full bg-background shadow-md ring-2 ring-card",
                t.ring
              )}
            >
              <FarmTypeArt variant={t.art} className="size-full" />
              <span
                className={cn(
                  "absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-linear-to-br text-white shadow-md ring-2 ring-background",
                  t.gradient
                )}
              >
                <TypeIcon className="size-3.5" strokeWidth={2} />
              </span>
            </div>
          </div>

          <h3 className="mt-3 truncate font-heading text-base font-bold tracking-tight">
            {displayName}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {displayLocation}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
            <FarmTypePill farmType={farmType} />
            <FarmStatusPill status={status} />
          </div>

          <div className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-md",
                  t.bg
                )}
              >
                <TypeIcon className={cn("size-3", t.text)} strokeWidth={2} />
              </span>
              <span className="font-semibold tracking-tight">{acres || 0} ac</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span
                className={cn(
                  "inline-flex size-5 items-center justify-center rounded-md bg-clay/12 text-clay-deep dark:text-clay"
                )}
              >
                <span className="font-mono text-[9px] font-bold">S</span>
              </span>
              <span className="font-semibold tracking-tight">{soil.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmIdentityPreview;
