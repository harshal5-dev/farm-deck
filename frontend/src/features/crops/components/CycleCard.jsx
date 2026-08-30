import {
  IconCalendarStats,
  IconDroplet,
  IconHistory,
  IconLayoutGrid,
  IconLeaf,
  IconNote,
  IconPencil,
  IconSun,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CROP_NEXT_ACTION,
  getCropType,
} from "../constants";
import {
  cycleProgress,
  cycleDayLabel,
  formatEcRange,
  formatPhRange,
  formatPpmRange,
  relativeDays,
} from "../lib/crop";
import { formatDate, formatRelative } from "../lib/format-crops";
import CropTypeArt from "./CropTypeArt";
import {
  CropStatusPill,
  CropTypePill,
  GrowthStagePill,
} from "./pills";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** Bar colour by lifecycle outcome. */
const barTone = (status) => {
  if (status === "completed" || status === "harvested")
    return "bg-emerald-500";
  if (status === "failed") return "bg-red-500/70";
  if (status === "cancelled") return "bg-muted-foreground/40";
  return "bg-linear-to-r from-leaf to-sage-deep";
};

/** Accent classes for the quick-advance button, keyed by target status. */
const advanceTone = {
  seeding:
    "border-lagoon/30 bg-lagoon/12 text-lagoon-deep hover:bg-lagoon/22 dark:text-lagoon",
  growing: "border-leaf/30 bg-leaf/12 text-leaf hover:bg-leaf/22",
  flowering:
    "border-wheat/30 bg-wheat/15 text-wheat-deep hover:bg-wheat/22 dark:text-wheat",
  harvested:
    "border-amber-500/30 bg-amber-500/12 text-amber-700 hover:bg-amber-500/22 dark:text-amber-400",
  completed:
    "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/22 dark:text-emerald-400",
};

/**
 * Compact CycleCard — one row per planting cycle. Cropped illustration
 * for the cultivar's category, status + growth stage pills, an
 * identity tile with the catalog crop's name and field, a targets
 * strip (pH / EC / PPM / days) sourced from the catalog crop, and a
 * sow → harvest progress bar with a "Day X of Y" badge. The footer
 * carries the one-click happy-path advance + edit.
 */
const CycleCard = ({
  cycle,
  index,
  onAdvance,
  onEdit,
  onViewLogs,
  canManage = true,
}) => {
  const category = cycle?.cropCategory ?? "other";
  const t = getCropType(category);
  const TypeIcon = t.icon;

  const isTerminal = !CROP_NEXT_ACTION[cycle.status];
  const next = CROP_NEXT_ACTION[cycle.status];

  const progress = cycleProgress(cycle);
  const dayLabel = cycleDayLabel(cycle);

  const startLabel = cycle.dateSeeded
    ? `Seeded ${formatDate(cycle.dateSeeded)}`
    : cycle.expectedHarvest
      ? `Plan · seed ${formatRelative(cycle.dateSeeded)}`
      : null;
  const endLabel = cycle.actualHarvestDate
    ? `Harvested ${formatDate(cycle.actualHarvestDate)}`
    : cycle.expectedHarvest
      ? `Expected ${formatDate(cycle.expectedHarvest)}`
      : null;
  const endHint = relativeDays(
    cycle.actualHarvestDate || cycle.expectedHarvest
  );
  const hasTimeline = Boolean(cycle.dateSeeded || endLabel);

  // Catalog target ranges — drives the targets strip.
  const crop = cycle.crop;
  const phRange = crop ? formatPhRange(crop.targetPhMin, crop.targetPhMax) : null;
  const ecRange = crop ? formatEcRange(crop.targetEcMin, crop.targetEcMax) : null;
  const ppmRange = crop
    ? formatPpmRange(crop.targetPpmMin, crop.targetPpmMax)
    : null;
  const hasTargets = Boolean(phRange || ecRange || ppmRange);

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={cycle.id}
    >
      <div className="group/cycle glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/15">
        {/* Subtle category-tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity duration-300 group-hover/cycle:opacity-[0.08]",
            t.gradient
          )}
        />

        {/* Hero band — illustrated scene; the lifecycle status is the
            one glanceable state, so it lives on the art. */}
        <div className="relative h-16 shrink-0 overflow-hidden">
          <CropTypeArt
            variant={category}
            className={cn(
              "size-full transition-transform duration-700 group-hover/cycle:scale-105",
              isTerminal && "opacity-75 saturate-50"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          <div className="absolute top-2.5 right-3 flex flex-col items-end gap-1">
            <CropStatusPill status={cycle.status} />
            <GrowthStagePill stage={cycle.growthStage} size="xs" />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col px-4 pb-2.5">
          {/* Identity — gradient category tile overlapping the hero */}
          <div className="flex items-end gap-2.5">
            <div
              className={cn(
                "relative -mt-5 flex size-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ring-[3px] ring-card",
                t.gradient
              )}
            >
              <TypeIcon className="size-5" strokeWidth={1.85} />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <h3 className="min-w-0 truncate font-heading text-base font-bold tracking-tight">
                {cycle.cropName ?? "Crop"}
              </h3>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <IconLayoutGrid
                  className="size-3.5 shrink-0"
                  strokeWidth={1.85}
                />
                <span className="truncate">
                  {cycle.zoneName}
                  {cycle.farmName ? ` · ${cycle.farmName}` : ""}
                </span>
              </p>
            </div>
          </div>

          {/* Category + plant count pills */}
          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1.5">
            <CropTypePill typeName={category} size="xs" />
            {cycle.plantCount != null && (
              <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/35 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                <IconLeaf className="mr-1 size-2.5 text-leaf" strokeWidth={2.2} />
                {cycle.plantCount.toLocaleString()} plants
              </span>
            )}
          </div>

          {/* Catalog target strip — pH / EC / PPM */}
          {hasTargets && (
            <div className="mt-2 grid grid-cols-3 gap-1.5 rounded-xl border border-border/30 bg-muted/25 px-2 py-2">
              {phRange && (
                <TargetCell
                  icon={IconDroplet}
                  label="pH"
                  value={phRange}
                  accent="lagoon"
                />
              )}
              {ecRange && (
                <TargetCell
                  icon={IconLeaf}
                  label="EC"
                  value={ecRange}
                  accent="leaf"
                />
              )}
              {ppmRange && (
                <TargetCell
                  icon={IconSun}
                  label="PPM"
                  value={ppmRange}
                  accent="wheat"
                />
              )}
            </div>
          )}

          {/* Cycle timeline — seed → harvest with progress */}
          {hasTimeline && (
            <div className="mt-2 rounded-xl border border-border/30 bg-muted/25 px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {startLabel ?? "No seed date"}
                </span>
                <span className="truncate text-[10px] font-semibold text-muted-foreground">
                  {endLabel ?? "No harvest date"}
                  {endHint && !isTerminal && (
                    <span className="font-medium text-muted-foreground/60">
                      {" "}
                      · {endHint}
                    </span>
                  )}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      barTone(cycle.status)
                    )}
                    style={{
                      width: `${Math.round((progress ?? 0) * 100)}%`,
                    }}
                  />
                </div>
                {dayLabel && (
                  <span className="shrink-0 text-[9px] font-bold tracking-wide text-muted-foreground/70 tabular-nums uppercase">
                    {dayLabel}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Notes teaser */}
          {cycle.notes && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <IconNote
                className={cn("size-3.5 shrink-0", t.text)}
                strokeWidth={1.85}
              />
              <span className="truncate">{cycle.notes}</span>
            </p>
          )}
        </div>

        {/* Footer — updated + happy-path advance + edit + logs */}
        <div className="relative flex items-center justify-between gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
          <button
            type="button"
            onClick={onViewLogs}
            aria-label={`View daily logs for ${cycle.cropName ?? "cycle"}`}
            className="group inline-flex min-w-0 items-center gap-1 rounded-md px-1 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <IconHistory className="size-3.5 shrink-0" strokeWidth={1.85} />
            <span className="truncate">
              Updated {formatRelative(cycle.updatedAt)}
            </span>
            <IconCalendarStats
              className="size-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.85}
            />
          </button>

          {canManage && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={onViewLogs}
                aria-label={`View daily logs for ${cycle.cropName ?? "cycle"}`}
                title="View daily logs"
                className={cn(
                  iconAction,
                  "bg-leaf/10 text-leaf hover:bg-leaf/22 hover:-translate-y-px"
                )}
              >
                <IconCalendarStats className="size-4" strokeWidth={1.85} />
              </button>
              {next && (
                <Button
                  type="button"
                  size="sm"
                  onClick={onAdvance}
                  className={cn(
                    "h-7 gap-1 rounded-lg border px-2.5 text-[11px] font-semibold shadow-none",
                    advanceTone[next.to]
                  )}
                >
                  <next.icon className="size-3.5" strokeWidth={2} />
                  {next.label}
                </Button>
              )}
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${cycle.cropName ?? "cycle"}`}
                title="Edit cycle"
                className={cn(
                  iconAction,
                  "bg-sky-warm/12 text-sky-warm hover:bg-sky-warm/22 hover:-translate-y-px"
                )}
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};

/** One cell of the catalog targets strip — tiny icon + label + value. */
const TargetCell = ({ icon: Icon, label, value, accent = "lagoon" }) => {
  const tones = {
    lagoon: "text-lagoon-deep dark:text-lagoon",
    leaf: "text-leaf",
    wheat: "text-wheat-deep dark:text-wheat",
  };
  const bgTones = {
    lagoon: "bg-lagoon/12",
    leaf: "bg-leaf/12",
    wheat: "bg-wheat/15",
  };
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md",
          bgTones[accent],
          tones[accent]
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

export default CycleCard;