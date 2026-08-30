import {
  IconCalendarEvent,
  IconCash,
  IconCoin,
  IconPencil,
  IconScale,
  IconTrash,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { getGrade } from "../constants";
import { formatDate } from "@/features/farms/lib/format";
import {
  formatMoney,
  formatPricePerKg,
  formatYield,
} from "../lib/format";

/**
 * HarvestRow — one harvest rendered as a horizontal card. The left
 * column carries the date + grade medal; the middle lays the yield /
 * revenue / price chips on a tinted wash keyed to the grade tone;
 * the right holds edit/delete. Revenue is the service-computed value
 * (yield kg × price) and renders as the standout chip when present.
 */
const HarvestRow = ({
  harvest,
  index,
  onEdit,
  onDelete,
  canManage = true,
}) => {
  const grade = getGrade(harvest.qualityGrade);
  const GradeIcon = grade?.icon;
  const tone = grade?.gradient ?? "from-leaf to-wheat-deep";

  const chips = [
    {
      key: "yield",
      icon: IconScale,
      label: "Yield",
      value: formatYield(harvest.totalYieldGrams),
      strong: true,
      tone: "leaf",
    },
  ];
  if (harvest.totalRevenue != null) {
    chips.push({
      key: "revenue",
      icon: IconCash,
      label: "Revenue",
      value: formatMoney(harvest.totalRevenue),
      strong: true,
      tone: "wheat",
    });
  }
  if (harvest.soldPricePerKg != null) {
    chips.push({
      key: "price",
      icon: IconCoin,
      label: "Price",
      value: formatPricePerKg(harvest.soldPricePerKg),
      tone: "sky",
    });
  }

  return (
    <Reveal delay={Math.min(index * 30, 180)} duration={400} changeKey={harvest.id}>
      <div className="group/hv glass-card texture-paper highlight-edge relative overflow-hidden rounded-2xl border border-border/40 transition-all duration-200 hover:shadow-md">
        {/* Grade-tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.05] transition-opacity group-hover/hv:opacity-[0.09]",
            tone
          )}
        />
        <div className={cn("pointer-events-none absolute inset-y-0 left-0 w-1 bg-linear-to-b", tone)} />

        <div className="relative flex flex-col gap-3 p-3 sm:flex-row sm:items-start sm:gap-4 sm:p-4">
          {/* Date + grade column */}
          <div className="flex shrink-0 items-center gap-3 sm:w-44 sm:flex-col sm:items-start sm:gap-1.5">
            <div className="flex items-center gap-2">
              {grade ? (
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-lg text-white shadow-sm bg-linear-to-br",
                    grade.gradient
                  )}
                  title={grade.description}
                >
                  <GradeIcon className="size-4" strokeWidth={2.1} />
                </span>
              ) : (
                <span className="flex size-8 items-center justify-center rounded-lg bg-muted/60 text-muted-foreground shadow-sm">
                  <IconScale className="size-4" strokeWidth={2.1} />
                </span>
              )}
              <span className="sm:hidden">
                <span className="font-heading text-sm font-bold tracking-tight">
                  {formatDate(harvest.harvestDate)}
                </span>
                {grade && (
                  <span className={cn("ml-2 text-[10px] font-bold", grade.text)}>
                    {grade.label}
                  </span>
                )}
              </span>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-baseline gap-1.5">
                <IconCalendarEvent
                  className="size-3.5 text-muted-foreground"
                  strokeWidth={1.85}
                />
                <p className="font-heading text-sm font-bold tracking-tight">
                  {formatDate(harvest.harvestDate)}
                </p>
              </div>
              {grade ? (
                <p className={cn("ml-5 text-[10px] font-bold tracking-wider uppercase", grade.text)}>
                  {grade.label}
                </p>
              ) : (
                <p className="ml-5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                  Not graded
                </p>
              )}
              <p className="ml-5 mt-1 truncate text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {harvest.cropName}
              </p>
            </div>
          </div>

          {/* Yield / revenue / price chips */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap gap-1.5">
              {chips.map(({ key, ...chip }) => (
                <MetricChip key={key} {...chip} />
              ))}
            </div>

            <p className="mt-2 flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground">
              <span className="truncate">
                {harvest.cycleName}
                {" · "}
                {harvest.zoneName}
                {harvest.farmName ? ` · ${harvest.farmName}` : ""}
              </span>
            </p>

            {harvest.notes && (
              <p className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground/90">
                “{harvest.notes}”
              </p>
            )}
          </div>

          {/* Actions */}
          {canManage && (
            <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-start sm:flex-col">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit harvest for ${harvest.harvestDate}`}
                title="Edit harvest"
                className="inline-flex size-8 items-center justify-center rounded-lg bg-sky-warm/12 text-sky-warm transition-all hover:-translate-y-px hover:bg-sky-warm/22 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Delete harvest for ${harvest.harvestDate}`}
                title="Delete harvest"
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
  sky: {
    text: "text-sky-warm",
    bg: "bg-sky-warm/12",
    border: "border-sky-warm/30",
  },
};

const MetricChip = ({
  icon: Icon,
  label,
  value,
  tone = "leaf",
  strong = false,
}) => {
  if (value === null || value === undefined || value === "") return null;
  const t = CHIP_TONE[tone] ?? CHIP_TONE.leaf;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-tight",
        strong && "text-[12px]",
        t.border,
        t.bg
      )}
    >
      <Icon className={cn("size-3 shrink-0", t.text)} strokeWidth={2.1} />
      <span className="text-[9px] font-bold tracking-wider text-muted-foreground/70 uppercase">
        {label}
      </span>
      <span className="tabular-nums">{value}</span>
    </span>
  );
};

export default HarvestRow;
