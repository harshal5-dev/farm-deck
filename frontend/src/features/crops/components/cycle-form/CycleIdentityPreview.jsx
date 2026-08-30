import {
  IconBasket,
  IconClockHour4,
  IconLayoutGrid,
  IconLeaf,
  IconSun,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getCropType } from "../../constants";
import CropTypeArt from "../CropTypeArt";
import {
  CropStatusPill,
  CropTypePill,
  GrowthStagePill,
} from "../pills";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
} from "../../lib/crop";
import { formatDate } from "../../lib/format-crops";

/**
 * Live identity preview for the cycle form — mirrors the catalog
 * preview layout (hero band, centred identity cluster, bottom
 * targets strip) but swaps the timeline summary for a sow →
 * expected → harvest row and shows the plant count.
 */
const CycleIdentityPreview = ({
  name,
  crop,
  zoneName,
  status,
  growthStage,
  plantCount,
  dateSeeded,
  expectedHarvest,
  actualHarvestDate,
}) => {
  const t = getCropType(crop?.category);
  const TypeIcon = t.icon;

  const displayName = (name || "").trim() || "New cycle";
  const cropName = crop?.name ?? "Pick a crop";

  const phRange = crop ? formatPhRange(crop.targetPhMin, crop.targetPhMax) : null;
  const ecRange = crop ? formatEcRange(crop.targetEcMin, crop.targetEcMax) : null;
  const ppmRange = crop
    ? formatPpmRange(crop.targetPpmMin, crop.targetPpmMax)
    : null;
  const hasTargets = Boolean(phRange || ecRange || ppmRange);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full lg:max-h-[70svh]">
      {/* Hero band */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <CropTypeArt
          variant={crop?.category ?? "leafy_green"}
          className="size-full"
        />
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
            <p className="mt-0.5 flex max-w-full items-center gap-1 truncate text-xs text-muted-foreground">
              <IconLayoutGrid className="size-3.5 shrink-0" strokeWidth={1.85} />
              <span className="truncate">
                {zoneName || "No field selected"}
              </span>
            </p>
            <p className="mt-1 text-[11px] font-medium text-foreground/70">
              {cropName}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <CropTypePill typeName={crop?.category} />
              <CropStatusPill status={status} />
              <GrowthStagePill stage={growthStage} size="xs" />
              {plantCount && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  <IconLeaf className="size-2.5 text-leaf" strokeWidth={2.4} />
                  {plantCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sow / expected / harvest summary */}
        <div className="relative mt-6 flex w-full items-center justify-between gap-1 rounded-xl bg-muted/40 px-2 py-2 text-[11px] backdrop-blur-sm">
          <MiniStat
            icon={IconLeaf}
            label="Sow"
            value={dateSeeded ? formatDate(dateSeeded) : "—"}
            tone="leaf"
          />
          <span className="text-muted-foreground/40">→</span>
          <MiniStat
            icon={IconBasket}
            label="Expected"
            value={expectedHarvest ? formatDate(expectedHarvest) : "—"}
            tone="wheat"
          />
          <span className="text-muted-foreground/40">→</span>
          <MiniStat
            icon={IconSun}
            label="Harvest"
            value={actualHarvestDate ? formatDate(actualHarvestDate) : "—"}
            tone="amber"
          />
        </div>

        {/* Targets strip — only when a catalog crop is picked */}
        {hasTargets && (
          <div className="relative mt-2 grid w-full grid-cols-3 gap-1.5 rounded-xl bg-muted/30 px-2 py-2 backdrop-blur-sm">
            <PreviewTarget
              icon={IconLeaf}
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
              icon={IconClockHour4}
              label="PPM"
              value={ppmRange ?? "—"}
              accent="wheat"
            />
          </div>
        )}
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
  amber: { text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-500/12" },
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

const MiniStat = ({ icon: Icon, label, value, tone = "leaf" }) => {
  const t = TONE[tone];
  return (
    <div className="flex min-w-0 flex-1 items-center gap-1.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md",
          t.bg,
          t.text
        )}
      >
        <Icon className="size-3" strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[8.5px] font-bold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="truncate text-[10px] font-semibold tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default CycleIdentityPreview;