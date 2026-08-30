import {
  IconCloudRain,
  IconDroplets,
  IconFlask,
  IconGrain,
  IconTemperature,
} from "@tabler/icons-react";
import {
  IconBucketDroplet,
  IconCalendarEvent,
  IconDroplet,
  IconLeaf,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getLogType, getWaterLevel } from "../constants";
import { formatDate } from "@/features/farms/lib/format";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
} from "@/features/crops/lib/crop";
import {
  formatMetric,
  isMetricInRange,
  relativeLogDay,
} from "../lib/format";

/**
 * DailyLogRow — one log rendered as a horizontal card with a date
 * column on the left and the readings laid out as a series of small
 * chips on the right. Readings that fall outside the catalog crop's
 * target ranges show a small amber dot so the grower can spot
 * drift at a glance.
 */
const DailyLogRow = ({
  log,
  index,
  onEdit,
  onDelete,
  canManage = true,
}) => {
  const t = getLogType(log.logType);
  const TypeIcon = t.icon;
  const crop = log.crop;
  const water = getWaterLevel(log.waterLevelStatus);

  const phInRange = isMetricInRange("ph", log.ph, crop);
  const ecInRange = isMetricInRange("ec", log.ec, crop);
  const ppmInRange = isMetricInRange("ppm", log.ppm, crop);

  const phTarget = crop ? formatPhRange(crop.targetPhMin, crop.targetPhMax) : null;
  const ecTarget = crop ? formatEcRange(crop.targetEcMin, crop.targetEcMax) : null;
  const ppmTarget = crop
    ? formatPpmRange(crop.targetPpmMin, crop.targetPpmMax)
    : null;

  // Universal metrics always render.
  const chips = [
    { key: "ph", metricKey: "ph", icon: IconDroplet, label: "pH", value: log.ph, target: phTarget, inRange: phInRange, tone: "lagoon" },
    { key: "ec", metricKey: "ec", icon: IconFlask, label: "EC", value: log.ec, target: ecTarget, inRange: ecInRange, tone: "leaf" },
    { key: "ppm", metricKey: "ppm", icon: IconGrain, label: "PPM", value: log.ppm, target: ppmTarget, inRange: ppmInRange, tone: "wheat" },
  ];

  // Type-specific chips appended below the universal ones — only
  // those with a value get rendered.
  if (log.logType === "hydro") {
    chips.push({ key: "waterTempC", metricKey: "waterTempC", icon: IconTemperature, label: "Water", value: log.waterTempC, tone: "lagoon" });
    if (water) {
      chips.push({ key: "waterLevel", icon: IconBucketDroplet, label: "Level", value: water.label, tone: "clay", isCustomChip: true });
    }
  } else {
    chips.push({ key: "airTempC", metricKey: "airTempC", icon: IconTemperature, label: "Air", value: log.airTempC, tone: "wheat" });
    chips.push({ key: "humidityPercent", metricKey: "humidityPercent", icon: IconDroplets, label: "RH", value: log.humidityPercent, tone: "sky" });
    chips.push({ key: "soilMoisture", metricKey: "soilMoisture", icon: IconLeaf, label: "VWC", value: log.soilMoisture, tone: "leaf" });
    if (log.rainfallMm != null) {
      chips.push({ key: "rainfallMm", metricKey: "rainfallMm", icon: IconCloudRain, label: "Rain", value: log.rainfallMm, tone: "sky" });
    }
  }

  return (
    <Reveal delay={Math.min(index * 30, 180)} duration={400} changeKey={log.id}>
      <div className="group/log glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl border border-border/40 transition-all duration-200 hover:shadow-md">
        {/* Tinted wash by log type */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity group-hover/log:opacity-[0.08]",
            t.gradient
          )}
        />
        {/* Left accent strip */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-1 bg-linear-to-b",
            t.gradient
          )}
        />

        <div className="relative flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4">
          {/* Date + log type column */}
          <div className="flex shrink-0 items-center gap-3 sm:w-44 sm:flex-col sm:items-start sm:gap-1.5">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg text-white shadow-sm ring-1 ring-card bg-linear-to-br",
                  t.gradient
                )}
              >
                <TypeIcon className="size-4" strokeWidth={2.1} />
              </span>
              <span className="sm:hidden">
                <span className="font-heading text-sm font-bold tracking-tight">
                  {formatDate(log.logDate)}
                </span>
                <span className="ml-2 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  {relativeLogDay(log.logDate)}
                </span>
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-1.5">
                <IconCalendarEvent
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={1.85}
                />
                <p className="font-heading text-sm font-bold tracking-tight">
                  {formatDate(log.logDate)}
                </p>
              </div>
              <p className="ml-5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {relativeLogDay(log.logDate)}
              </p>
              <p className="ml-5 mt-1 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {t.label}
              </p>
            </div>
          </div>

          {/* Readings chips */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {chips.map(({ key, ...chip }) => (
                <MetricChip key={key} {...chip} />
              ))}
              {log.nutrientsAdded && (
                <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-leaf uppercase">
                  <IconLeaf className="size-2.5" strokeWidth={2.4} />
                  Nutrients
                </span>
              )}
            </div>

            {log.observation && (
              <p className="mt-2 line-clamp-2 text-[11px] text-muted-foreground/90">
                “{log.observation}”
              </p>
            )}
          </div>

          {/* Actions */}
          {canManage && (
            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start sm:flex-col">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit log for ${log.logDate}`}
                title="Edit log"
                className="inline-flex size-8 items-center justify-center rounded-lg bg-sky-warm/12 text-sky-warm transition-all hover:-translate-y-px hover:bg-sky-warm/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete log for ${log.logDate}`}
                title="Delete log"
                className="inline-flex size-8 items-center justify-center rounded-lg bg-muted/55 text-muted-foreground transition-all hover:-translate-y-px hover:bg-red-500/15 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 dark:hover:text-red-400"
              >
                <IconTrash className="size-4" strokeWidth={1.85} />
              </button>
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
};

const CHIP_TONE = {
  lagoon: {
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
    border: "border-lagoon/30",
  },
  leaf: {
    text: "text-leaf",
    bg: "bg-leaf/12",
    border: "border-leaf/30",
  },
  wheat: {
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15",
    border: "border-wheat/30",
  },
  clay: {
    text: "text-clay-deep dark:text-clay",
    bg: "bg-clay/12",
    border: "border-clay/30",
  },
  sky: {
    text: "text-sky-warm",
    bg: "bg-sky-warm/12",
    border: "border-sky-warm/30",
  },
};

const MetricChip = ({
  icon: Icon,
  label,
  metricKey,
  value,
  target,
  inRange,
  tone = "leaf",
  isCustomChip = false,
}) => {
  if (value === null || value === undefined || value === "") return null;
  const t = CHIP_TONE[tone] ?? CHIP_TONE.leaf;
  const formatted = isCustomChip ? value : formatMetric(metricKey, value);
  // When the metric is in-range we keep the tone; out-of-range gets
  // an amber wash + dot so it stands out without screaming.
  const drift = inRange === false;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold tracking-tight",
        drift ? "border-amber-500/30 bg-amber-500/10" : cn(t.border, t.bg)
      )}
      title={target ? `target ${target}` : undefined}
    >
      <Icon
        className={cn(
          "size-3 shrink-0",
          drift ? "text-amber-700 dark:text-amber-400" : t.text
        )}
        strokeWidth={2.1}
      />
      <span
        className={cn(
          "text-[9px] font-bold tracking-wider uppercase",
          drift ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground/70"
        )}
      >
        {label}
      </span>
      <span className="tabular-nums">
        {formatted}
      </span>
      {drift && (
        <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
      )}
    </span>
  );
};

export default DailyLogRow;