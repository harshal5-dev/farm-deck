import {
  IconCloudRain,
  IconDroplet,
  IconDroplets,
  IconFlask,
  IconGrain,
  IconLeaf,
  IconTemperature,
} from "@tabler/icons-react";
import {
  IconBucketDroplet,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  WATER_LEVEL_META,
  getLogType,
} from "../../constants";
import { formatDate } from "@/features/farms/lib/format";
import { formatMetric, relativeLogDay } from "../../lib/format";
import CropTypeArt from "@/features/crops/components/CropTypeArt";

/**
 * Live identity preview for the daily-log form. Shows the log type
 * badge, the selected date with a relative hint, the universal
 * readings as they come in, the level/nutrients toggle, and any
 * observation text. The hero band uses the cycle's crop category
 * art so it visually rhymes with the cycle it belongs to.
 */
const LogIdentityPreview = ({
  logType,
  logDate,
  ph,
  ec,
  ppm,
  waterTempC,
  airTempC,
  humidityPercent,
  soilMoisture,
  rainfallMm,
  waterLevelStatus,
  nutrientsAdded,
  observation,
  cycle,
}) => {
  const t = getLogType(logType);
  const TypeIcon = t.icon;
  const cropCategory = cycle?.cropCategory ?? "leafy_green";

  const phFmt = formatMetric("ph", ph);
  const ecFmt = formatMetric("ec", ec);
  const ppmFmt = formatMetric("ppm", ppm);

  const observationText = (observation || "").trim();

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full lg:max-h-[70svh]">
      {/* Hero — uses the cycle's crop family art so the preview
          visually rhymes with the cycle card. */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <CropTypeArt variant={cropCategory} className="size-full" />
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
                  "relative size-20 rounded-full p-[3px] shadow-lg bg-linear-to-br",
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
              {cycle?.name || cycle?.cropName || "Daily log"}
            </h3>
            <p className="mt-0.5 max-w-full truncate text-xs text-muted-foreground">
              {t.label} reading on {cycle?.zoneName ?? "this cycle"}
            </p>

            {/* Date + relative hint */}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-3 py-1 text-xs font-semibold tracking-tight">
              <IconCalendarEvent
                className="size-3.5 text-muted-foreground"
                strokeWidth={1.85}
              />
              <span>{logDate ? formatDate(logDate) : "Pick a date"}</span>
              {logDate && (
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  · {relativeLogDay(logDate)}
                </span>
              )}
            </div>

            {/* Pills — readings + status */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {phFmt && <PreviewChip icon={IconDroplet} label="pH" value={phFmt} />}
              {ecFmt && <PreviewChip icon={IconFlask} label="EC" value={ecFmt} />}
              {ppmFmt && (
                <PreviewChip icon={IconGrain} label="PPM" value={ppmFmt} />
              )}
              {nutrientsAdded && (
                <span className="inline-flex items-center gap-1 rounded-full border border-leaf/30 bg-leaf/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-leaf uppercase">
                  <IconLeaf className="size-2.5" strokeWidth={2.4} />
                  Nutrients
                </span>
              )}
              {waterLevelStatus && WATER_LEVEL_META[waterLevelStatus] && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                    WATER_LEVEL_META[waterLevelStatus].chip
                  )}
                >
                  <IconBucketDroplet className="size-2.5" strokeWidth={2.4} />
                  {WATER_LEVEL_META[waterLevelStatus].label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer — type-specific mini stats + observation */}
        <div className="relative mt-6 flex w-full flex-col gap-1.5">
          {logType === "hydro" ? (
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/40 px-2 py-2 backdrop-blur-sm">
              <FooterStat
                icon={IconTemperature}
                label="Water"
                value={formatMetric("waterTempC", waterTempC) ?? "—"}
              />
              <FooterStat
                icon={IconFlask}
                label="EC"
                value={formatMetric("ec", ec) ?? "—"}
              />
              <FooterStat
                icon={IconGrain}
                label="PPM"
                value={formatMetric("ppm", ppm) ?? "—"}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-muted/40 px-2 py-2 backdrop-blur-sm">
              <FooterStat
                icon={IconTemperature}
                label="Air"
                value={formatMetric("airTempC", airTempC) ?? "—"}
              />
              <FooterStat
                icon={IconDroplets}
                label="RH"
                value={formatMetric("humidityPercent", humidityPercent) ?? "—"}
              />
              <FooterStat
                icon={IconLeaf}
                label="VWC"
                value={formatMetric("soilMoisture", soilMoisture) ?? "—"}
              />
              <FooterStat
                icon={IconCloudRain}
                label="Rain"
                value={formatMetric("rainfallMm", rainfallMm) ?? "—"}
              />
            </div>
          )}

          {observationText && (
            <p className="mt-1 line-clamp-2 rounded-lg border border-border/30 bg-card/60 px-3 py-2 text-[11px] text-muted-foreground">
              “{observationText}”
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TONE = {
  lagoon: { text: "text-lagoon-deep dark:text-lagoon", bg: "bg-lagoon/12" },
  leaf: { text: "text-leaf", bg: "bg-leaf/12" },
  wheat: { text: "text-wheat-deep dark:text-wheat", bg: "bg-wheat/15" },
};

const PreviewChip = ({ icon: Icon, label, value, accent = "leaf" }) => {
  const tone = TONE[accent] ?? TONE.leaf;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/60 px-2 py-0.5 text-[10px] font-semibold tracking-tight">
      <Icon className={cn("size-2.5", tone.text)} strokeWidth={2.4} />
      <span className="text-muted-foreground/80">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
};

const FooterStat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-1.5">
    <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-leaf/12 text-leaf">
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

export default LogIdentityPreview;