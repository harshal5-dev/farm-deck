import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import {
  IconHistory,
  IconLayoutGrid,
  IconNote,
  IconPencil,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { getCropType, CROP_NEXT_ACTION } from "../constants";
import { formatDate, formatRelative } from "../lib/format-crops";
import { cycleProgress, cycleDayLabel, relativeDays } from "../lib/crop";
import CropTypeArt from "./CropTypeArt";
import { CropTypePill, CropStatusPill } from "./pills";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** Bar colour by lifecycle outcome. */
const barTone = (status) => {
  if (status === "harvested") return "bg-emerald-500";
  if (status === "failed") return "bg-red-500/70";
  if (status === "cancelled") return "bg-muted-foreground/40";
  return "bg-linear-to-r from-leaf to-sage-deep";
};

/** Accent classes for the quick-advance button, keyed by target status. */
const advanceTone = {
  sown: "border-lagoon/30 bg-lagoon/12 text-lagoon-deep hover:bg-lagoon/22 dark:text-lagoon",
  growing: "border-leaf/30 bg-leaf/12 text-leaf hover:bg-leaf/22",
  harvest_ready:
    "border-amber-500/30 bg-amber-500/12 text-amber-700 hover:bg-amber-500/22 dark:text-amber-400",
  harvested:
    "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 hover:bg-emerald-500/22 dark:text-emerald-400",
};

/**
 * CropCard — compact list card for one crop cycle. A short illustrated
 * CropTypeArt hero with the lifecycle status pill on it, the identity
 * tile overlapping it, a pills row (type + quantity), and the cycle
 * timeline strip (sown → expected harvest with a progress bar and
 * "Day X of Y"). The footer carries the one-click happy-path advance
 * ("Mark sown", "Complete harvest"…) plus edit.
 */
const CropCard = ({
  crop,
  index,
  onAdvance,
  onEdit,
  canManage = true,
}) => {
  const cropType = crop.cropType; // decorated lookup row from the list
  const t = getCropType(cropType?.name);
  const TypeIcon = t.icon;
  const isTerminal = !CROP_NEXT_ACTION[crop.status];
  const next = CROP_NEXT_ACTION[crop.status];

  const progress = cycleProgress(crop);
  const dayLabel = cycleDayLabel(crop);

  const startLabel =
    crop.status === "planned"
      ? `Sows ${formatDate(crop.sowDatePlanned)}`
      : `Sown ${formatDate(crop.sowDateActual || crop.sowDatePlanned)}`;
  const endLabel = crop.harvestDateActual
    ? `Harvested ${formatDate(crop.harvestDateActual)}`
    : crop.harvestDateExpected
      ? `Expected ${formatDate(crop.harvestDateExpected)}`
      : null;
  const endHint = relativeDays(
    crop.harvestDateActual || crop.harvestDateExpected
  );
  const hasTimeline = Boolean(
    crop.sowDatePlanned || crop.sowDateActual || endLabel
  );

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={crop.id}
    >
      <div className="group/crop glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/15">
        {/* Subtle type-tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity duration-300 group-hover/crop:opacity-[0.08]",
            t.gradient
          )}
        />

        {/* Hero band — illustrated scene; the lifecycle status is the
            one glanceable state, so it lives on the art. */}
        <div className="relative h-16 shrink-0 overflow-hidden">
          <CropTypeArt
            variant={t.category}
            className={cn(
              "size-full transition-transform duration-700 group-hover/crop:scale-105",
              isTerminal && "opacity-75 saturate-50"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          <div className="absolute top-2.5 right-3">
            <CropStatusPill status={crop.status} />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col px-4 pb-2.5">
          {/* Identity — gradient type tile overlapping the hero */}
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
                {crop.name}
              </h3>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <IconLayoutGrid
                  className="size-3.5 shrink-0"
                  strokeWidth={1.85}
                />
                <span className="truncate">
                  {crop.zoneName}
                  {crop.farmName ? ` · ${crop.farmName}` : ""}
                </span>
              </p>
            </div>
          </div>

          {/* Type + quantity pills */}
          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1.5">
            <CropTypePill typeName={cropType?.name} size="xs" />
            {crop.quantity != null && (
              <span className="inline-flex items-center rounded-full border border-border/50 bg-muted/35 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                {crop.quantity} {crop.quantityUnit}
              </span>
            )}
          </div>

          {/* Cycle timeline — sow → harvest with progress */}
          {hasTimeline && (
            <div className="mt-2 rounded-xl border border-border/30 bg-muted/25 px-3 py-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {startLabel}
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
                      barTone(crop.status)
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
          {crop.notes && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <IconNote
                className={cn("size-3.5 shrink-0", t.text)}
                strokeWidth={1.85}
              />
              <span className="truncate">{crop.notes}</span>
            </p>
          )}
        </div>

        {/* Footer — updated + happy-path advance + edit */}
        <div className="relative flex items-center justify-between gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
          <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <IconHistory className="size-3.5 shrink-0" strokeWidth={1.85} />
            <span className="truncate">
              Updated {formatRelative(crop.updatedAt)}
            </span>
          </span>

          {canManage && (
            <div className="flex shrink-0 items-center gap-2">
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
                aria-label={`Edit ${crop.name}`}
                title="Edit crop"
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

export default CropCard;
