import {
  IconBeach,
  IconDroplet,
  IconLeaf,
  IconSun,
  IconClockHour4,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getCropType } from "../../constants";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
} from "../../lib/crop";
import CropTypeArt from "../CropTypeArt";
import { CropTypePill } from "../pills";

/**
 * Live identity preview for the catalog form — mirrors the cycle
 * preview layout (hero band, centred identity tile, bottom summary)
 * but emphasises target ranges instead of the sow→harvest timeline,
 * because the catalog is the variety library, not a planting.
 */
const CropCatalogPreview = ({ crop }) => {
  const t = getCropType(crop.category);
  const TypeIcon = t.icon;

  const displayName = (crop.name || "").trim() || "New crop";

  const phRange = formatPhRange(crop.targetPhMin, crop.targetPhMax);
  const ecRange = formatEcRange(crop.targetEcMin, crop.targetEcMax);
  const ppmRange = formatPpmRange(crop.targetPpmMin, crop.targetPpmMax);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full lg:max-h-[70svh]">
      {/* Hero band */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <CropTypeArt variant={t.category} className="size-full" />
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

      <div className="relative flex min-h-0 w-full flex-1 flex-col px-5 pt-0 pb-5">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-6 top-6 bottom-16 rounded-full bg-linear-to-b opacity-[0.08] blur-3xl",
            t.gradient
          )}
        />

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="-mt-9 flex flex-col items-center text-center">
            <div className="relative">
              <div
                className={cn(
                  "absolute -inset-3 rounded-full opacity-60 blur-xl",
                  t.bg
                )}
              />
              <div
                className={cn(
                  "relative size-20 rounded-full bg-linear-to-br p-[3px] shadow-lg",
                  t.gradient
                )}
              >
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-background/95 backdrop-blur-sm">
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-80",
                      t.bgSoft
                    )}
                  />
                  <div className="absolute inset-x-4 top-1.5 h-1/2 rounded-[100%] bg-linear-to-b from-white/40 to-transparent" />
                  <TypeIcon
                    className={cn("relative size-9 drop-shadow-sm", t.text)}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-3 max-w-full truncate font-heading text-base font-bold tracking-tight">
              {displayName}
            </h3>
            <p className="mt-0.5 max-w-full truncate text-xs text-muted-foreground">
              {t.tagline}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <CropTypePill typeName={crop.category} />
              {crop.daysToHarvest != null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <IconClockHour4
                    className="size-2.5 text-clay-deep dark:text-clay"
                    strokeWidth={2.4}
                  />
                  {crop.daysToHarvest} days
                </span>
              )}
              {crop.lightHoursPerDay != null && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <IconSun
                    className="size-2.5 text-wheat-deep dark:text-wheat"
                    strokeWidth={2.4}
                  />
                  {crop.lightHoursPerDay} h/day
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Target ranges footer */}
        <div className="relative mt-6 grid w-full grid-cols-3 gap-1.5 rounded-xl bg-muted/40 px-2 py-2 backdrop-blur-sm">
          <PreviewTarget
            icon={IconDroplet}
            label="pH"
            value={phRange ?? "—"}
            accent="lagoon"
          />
          <PreviewTarget
            icon={IconLeaf}
            label="EC"
            value={ecRange ?? "—"}
            accent="leaf"
          />
          <PreviewTarget
            icon={IconBeach}
            label="PPM"
            value={ppmRange ?? "—"}
            accent="wheat"
          />
        </div>
      </div>
    </div>
  );
};

const TONE = {
  lagoon: {
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
  },
  leaf: { text: "text-leaf", bg: "bg-leaf/12" },
  wheat: { text: "text-wheat-deep dark:text-wheat", bg: "bg-wheat/15" },
};

const PreviewTarget = ({ icon: Icon, label, value, accent = "leaf" }) => {
  const tone = TONE[accent];
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-md",
          tone.bg,
          tone.text
        )}
      >
        <Icon className="size-3" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[8.5px] font-bold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="truncate text-[10px] font-semibold tracking-tight tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
};

export default CropCatalogPreview;