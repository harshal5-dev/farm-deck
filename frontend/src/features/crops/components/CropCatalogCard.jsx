import {
  IconBeach,
  IconDroplet,
  IconLeaf,
  IconPencil,
  IconPower,
  IconSun,
  IconClockHour4,
  IconHistory,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/effects";
import { CropTypePill } from "./pills";
import CropTypeArt from "./CropTypeArt";
import { getCropType } from "../constants";
import {
  formatEcRange,
  formatPhRange,
  formatPpmRange,
  formatLightRange,
} from "../lib/crop";
import { formatRelative } from "../lib/format-crops";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/**
 * CatalogCard — one row per crop variety in the `crops` table. Shows
 * the category art, name + tagline, the target condition ranges (pH /
 * EC / PPM / light / days-to-harvest) and lifecycle meta (created,
 * updated). The footer carries edit + activate/inactivate so the
 * catalog is fully manageable from this card.
 */
const CropCatalogCard = ({
  crop,
  index,
  onEdit,
  onToggleActive,
  canManage = true,
}) => {
  const t = getCropType(crop.category);
  const TypeIcon = t.icon;

  const phRange = formatPhRange(crop.targetPhMin, crop.targetPhMax);
  const ecRange = formatEcRange(crop.targetEcMin, crop.targetEcMax);
  const ppmRange = formatPpmRange(crop.targetPpmMin, crop.targetPpmMax);
  const lightRange = formatLightRange(
    crop.lightHoursPerDay,
    crop.lightHoursPerDay
  );

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={crop.id}
    >
      <div className="group/cat glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/15">
        {/* Tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity duration-300 group-hover/cat:opacity-[0.08]",
            t.gradient
          )}
        />

        {/* Hero band */}
        <div className="relative h-16 shrink-0 overflow-hidden">
          <CropTypeArt
            variant={crop.category}
            className={cn(
              "size-full transition-transform duration-700 group-hover/cat:scale-105",
              !crop.isActive && "opacity-70 saturate-50"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          <div className="absolute top-2.5 right-3 flex items-center gap-1.5">
            <CropTypePill typeName={crop.category} size="xs" />
          </div>
          {!crop.isActive && (
            <div className="absolute top-2.5 left-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/60 px-2 py-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase backdrop-blur-sm">
                Archived
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col px-4 pb-2.5">
          {/* Identity — overlapping tile */}
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
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Target ranges grid — pH / EC / PPM / Light / Days */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 rounded-xl border border-border/30 bg-muted/25 p-2">
            <CatalogTargetRow
              icon={IconDroplet}
              label="pH"
              value={phRange ?? "—"}
              accent="lagoon"
            />
            <CatalogTargetRow
              icon={IconLeaf}
              label="EC"
              value={ecRange ?? "—"}
              accent="leaf"
            />
            <CatalogTargetRow
              icon={IconBeach}
              label="PPM"
              value={ppmRange ?? "—"}
              accent="wheat"
            />
            <CatalogTargetRow
              icon={IconSun}
              label="Light"
              value={
                crop.lightHoursPerDay != null
                  ? `${crop.lightHoursPerDay} h/day`
                  : lightRange ?? "—"
              }
              accent="wheat"
            />
            <div className="col-span-2 flex items-center gap-2 rounded-lg border border-border/30 bg-card/50 px-2 py-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-clay/15 text-clay-deep dark:text-clay">
                <IconClockHour4 className="size-3" strokeWidth={2} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[8.5px] font-bold tracking-wider text-muted-foreground/70 uppercase">
                  Days to harvest
                </p>
                <p className="truncate text-[10px] font-semibold tracking-tight tabular-nums">
                  {crop.daysToHarvest != null
                    ? `${crop.daysToHarvest} days`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Notes teaser */}
          {crop.notes && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <span className={cn("size-1.5 shrink-0 rounded-full", t.dot)} />
              <span className="truncate">{crop.notes}</span>
            </p>
          )}
        </div>

        {/* Footer — updated + edit + activate/inactivate */}
        <div className="relative flex items-center justify-between gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
          <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <IconHistory className="size-3.5 shrink-0" strokeWidth={1.85} />
            <span className="truncate">
              Updated {formatRelative(crop.updatedAt)}
            </span>
          </span>

          {canManage && (
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                onClick={onToggleActive}
                aria-label={
                  crop.isActive
                    ? `Archive ${crop.name}`
                    : `Reactivate ${crop.name}`
                }
                title={crop.isActive ? "Archive crop" : "Reactivate crop"}
                className={cn(
                  iconAction,
                  crop.isActive
                    ? "bg-muted/55 text-muted-foreground hover:bg-muted hover:text-foreground"
                    : "bg-leaf/12 text-leaf hover:bg-leaf/22"
                )}
              >
                <IconPower className="size-4" strokeWidth={1.85} />
              </button>
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

const TONE = {
  lagoon: {
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
  },
  leaf: { text: "text-leaf", bg: "bg-leaf/12" },
  wheat: { text: "text-wheat-deep dark:text-wheat", bg: "bg-wheat/15" },
};

const CatalogTargetRow = ({ icon: Icon, label, value, accent = "leaf" }) => {
  const tone = TONE[accent];
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border/30 bg-card/50 px-2 py-1.5">
      <span
        className={cn(
          "flex size-5 shrink-0 items-center justify-center rounded-md",
          tone.bg,
          tone.text
        )}
      >
        <Icon className="size-3" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
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

export default CropCatalogCard;