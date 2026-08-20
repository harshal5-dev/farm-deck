import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import { FarmTypeArt } from "@/components/effects";
import {
  IconCalendar,
  IconLayersIntersect,
  IconPlant2,
  IconScale,
} from "@tabler/icons-react";
import { getFarmType } from "@/constants/farms";
import { formatAcres, formatDate, formatNumber } from "../lib/format";
import { FarmTypePill, FarmStatusPill } from "./pills";
import FarmIconArt from "./FarmIconArt";
import FarmActionMenu from "./FarmActionMenu";
import FarmStatTile from "./FarmStatTile";

const FarmCard = ({
  farm,
  index,
  onView,
  onDelete,
  onEdit,
  canManage = true,
}) => {
  const t = getFarmType(farm.farmType);
  const TypeIcon = t.icon;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onView?.();
    }
  };

  return (
    <Reveal
      delay={Math.min(index * 50, 400)}
      duration={500}
      changeKey={farm.id}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${farm.name}`}
        onClick={onView}
        onKeyDown={handleKeyDown}
        className="group/farm glass-card texture-paper highlight-edge relative flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-leaf/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {/* External type-tinted bloom on hover */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px -z-10 rounded-3xl opacity-0 blur-2xl transition-opacity duration-500 group-hover/farm:opacity-100",
            t.bg
          )}
        />

        {/* Subtle type-tinted background wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.05] transition-opacity duration-500 group-hover/farm:opacity-[0.1]",
            t.gradient
          )}
        />

        {/* Large type-icon watermark in the background corner */}
        <TypeIcon
          className="pointer-events-none absolute -right-8 -bottom-8 size-44 text-foreground/[0.035] transition-all duration-700 group-hover/farm:scale-110 group-hover/farm:rotate-6 group-hover/farm:text-foreground/6"
          strokeWidth={1}
        />

        {/* Hero art band — the per-type FarmTypeArt fills the top strip */}
        <div className="relative h-24 shrink-0 overflow-hidden">
          <FarmTypeArt variant={t.art} className="size-full" />
          {/* gradient scrim for legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />
          {/* thin gradient accent strip on the very top */}
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          {/* Type icon chip in the top-left */}
          <div className="absolute top-3 left-3">
            <div
              className={cn(
                "relative flex size-9 items-center justify-center rounded-xl shadow-md ring-1 ring-white/15 ring-inset backdrop-blur",
                t.gradient
              )}
            >
              <TypeIcon className="size-4 text-white" strokeWidth={2} />
            </div>
          </div>
          {/* Status pill in the top-right */}
          <div className="absolute top-3 right-3">
            <FarmStatusPill status={farm.status} />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col p-5">
          {/* Identity row: icon left, name+meta center, action menu right */}
          <div className="flex items-start gap-3">
            <FarmIconArt farm={farm} size="lg" />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                <h3 className="min-w-0 wrap-break-word font-heading text-sm font-bold tracking-tight">
                  {farm.name}
                </h3>
              </div>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                {farm.location || "Location not set"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <FarmTypePill farmType={farm.farmType} size="xs" />
                <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/40 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-muted-foreground uppercase">
                  <IconLayersIntersect className="size-2.5" strokeWidth={2.2} />
                  {formatAcres(farm.sizeAcres)} ac
                </span>
              </div>
            </div>

            {/* Action menu on the far right — stops propagation so it
                doesn't open the dialog. Hidden entirely for roles that
                can't manage farms; the card stays clickable so the
                details dialog still works for read-only viewers. */}
            {canManage && (
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <FarmActionMenu
                  farm={farm}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  canManage={canManage}
                />
              </div>
            )}
          </div>

          {/* Stat tiles */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <FarmStatTile
              icon={IconLayersIntersect}
              label="Fields"
              value={formatNumber(farm.fieldsCount)}
              accent="leaf"
            />
            <FarmStatTile
              icon={IconPlant2}
              label="Crops"
              value={formatNumber(farm.cropsCount)}
              accent="sage"
            />
            <FarmStatTile
              icon={IconScale}
              label="Yield"
              value={`${formatNumber(farm.yieldKg)} kg`}
              accent="wheat"
            />
            <FarmStatTile
              icon={IconCalendar}
              label="Established"
              value={formatDate(farm.establishedAt)}
              accent="sky"
            />
          </div>

          {/* Footer — manager + description teaser */}
          <div className="mt-auto flex items-center gap-1.5 border-t border-border/30 pt-3 text-[11px] text-muted-foreground">
            <TypeIcon
              className={cn("size-3.5 shrink-0", t.text)}
              strokeWidth={1.85}
            />
            <span className="truncate">
              {farm.managerName
                ? `Managed by ${farm.managerName}`
                : t.description}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default FarmCard;
