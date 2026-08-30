import {
  IconBasket,
  IconCalendarEvent,
  IconCash,
  IconCoin,
  IconScale,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { getGrade } from "../../constants";
import { formatDate } from "@/features/farms/lib/format";
import CropTypeArt from "@/features/crops/components/CropTypeArt";
import {
  formatMoney,
  formatPricePerKg,
  formatYield,
  gramsToKgHint,
} from "../../lib/format";

/**
 * Live identity preview for the harvest form — crop-family hero art,
 * a grade medal badge, the harvest date, and the headline numbers
 * (yield / revenue / price) updating as the grower types.
 */
const HarvestIdentityPreview = ({
  cycle,
  harvestDate,
  totalYieldGrams,
  qualityGrade,
  soldPricePerKg,
  notes,
}) => {
  const grade = getGrade(qualityGrade);
  const GradeIcon = grade?.icon ?? IconBasket;
  const cropCategory = cycle?.cropCategory ?? "leafy_green";

  const yieldFmt = formatYield(
    totalYieldGrams > 0 ? totalYieldGrams : null
  );
  const yieldHint = gramsToKgHint(totalYieldGrams);
  const priceFmt = formatPricePerKg(soldPricePerKg);
  // Mirror the service-side computation for the live preview.
  const revenue =
    soldPricePerKg != null && totalYieldGrams > 0
      ? (Number(totalYieldGrams) / 1000) * Number(soldPricePerKg)
      : null;
  const revenueFmt = formatMoney(revenue);

  const notesText = (notes || "").trim();

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full lg:max-h-[70svh]">
      {/* Hero — crop-family art so the preview rhymes with the cycle. */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <CropTypeArt variant={cropCategory} className="size-full" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-leaf/30 to-wheat-deep/30 opacity-30" />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
          <div
            className={cn(
              "absolute inset-0 bg-linear-to-r",
              grade?.gradient ?? "from-leaf to-wheat-deep"
            )}
          />
        </div>
      </div>

      <div className="relative flex min-h-0 w-full flex-1 flex-col px-5 pt-0 pb-5">
        <div
          className={cn(
            "pointer-events-none absolute inset-x-6 top-6 bottom-16 rounded-full bg-linear-to-b opacity-[0.08] blur-3xl",
            grade?.gradient ?? "from-leaf to-wheat-deep"
          )}
        />

        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="-mt-9 flex flex-col items-center text-center">
            <div className="relative">
              <div
                className={cn(
                  "absolute -inset-3 rounded-full opacity-60 blur-xl bg-linear-to-br",
                  grade?.gradient ?? "from-leaf to-wheat-deep"
                )}
              />
              <div
                className={cn(
                  "relative size-20 rounded-full p-[3px] shadow-lg bg-linear-to-br",
                  grade?.gradient ?? "from-leaf to-wheat-deep"
                )}
              >
                <div className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-background/95 backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-full bg-wheat/8 opacity-80" />
                  <div className="absolute inset-x-4 top-1.5 h-1/2 rounded-[100%] bg-linear-to-b from-white/40 to-transparent" />
                  <GradeIcon
                    className={cn(
                      "relative size-9 drop-shadow-sm",
                      grade?.text ?? "text-wheat-deep dark:text-wheat"
                    )}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
            </div>

            <h3 className="mt-3 max-w-full truncate font-heading text-base font-bold tracking-tight">
              {cycle?.cropName || "Harvest"}
            </h3>
            <p className="mt-0.5 max-w-full truncate text-xs text-muted-foreground">
              {cycle?.cycleName || "Pick a cycle"}
              {cycle?.zoneName ? ` · ${cycle.zoneName}` : ""}
            </p>

            {/* Date chip */}
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border/40 bg-card/60 px-3 py-1 text-xs font-semibold tracking-tight">
              <IconCalendarEvent
                className="size-3.5 text-muted-foreground"
                strokeWidth={1.85}
              />
              <span>
                {harvestDate ? formatDate(harvestDate) : "Pick a date"}
              </span>
            </div>

            {/* Headline numbers */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              {yieldFmt && (
                <PreviewChip icon={IconScale} label="Yield" value={yieldFmt} />
              )}
              {revenueFmt && (
                <PreviewChip icon={IconCash} label="Rev" value={revenueFmt} />
              )}
              {priceFmt && (
                <PreviewChip icon={IconCoin} label="Price" value={priceFmt} />
              )}
              {!yieldFmt && !revenueFmt && (
                <span className="text-[10px] font-medium text-muted-foreground/70">
                  Enter the yield to see the numbers
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer — big stat + notes */}
        <div className="relative mt-6 flex w-full flex-col gap-1.5">
          <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted/40 px-2 py-2 backdrop-blur-sm">
            <FooterStat
              icon={IconScale}
              label="Yield"
              value={yieldFmt ?? "—"}
              hint={yieldHint}
            />
            <FooterStat
              icon={IconCash}
              label="Revenue"
              value={revenueFmt ?? "—"}
            />
            <FooterStat
              icon={IconCoin}
              label="Price"
              value={priceFmt ?? "—"}
            />
          </div>

          {notesText && (
            <p className="mt-1 line-clamp-2 rounded-lg border border-border/30 bg-card/60 px-3 py-2 text-[11px] text-muted-foreground">
              “{notesText}”
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const TONE = {
  leaf: { text: "text-leaf" },
  wheat: { text: "text-wheat-deep dark:text-wheat" },
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

const FooterStat = ({ icon: Icon, label, value, hint }) => (
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
        {hint && (
          <span className="ml-1 font-medium text-muted-foreground/60">
            {hint}
          </span>
        )}
      </p>
    </div>
  </div>
);

export default HarvestIdentityPreview;
