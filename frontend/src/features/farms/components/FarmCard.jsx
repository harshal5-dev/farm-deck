import { useState } from "react";
import { Reveal, FarmTypeArt } from "@/components/effects";
import { cn } from "@/lib/utils";
import {
  IconCalendarPlus,
  IconChartDots,
  IconCircleOff,
  IconHistory,
  IconMapPin,
  IconNote,
  IconPencil,
  IconRuler2,
  IconRotate,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getFarmType } from "@/constants/farms";
import {
  formatArea,
  formatCoords,
  formatDate,
  formatRelative,
} from "../lib/format";
import { FarmTypePill, FarmStatusPill } from "./pills";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** One cell of the KPI strip: colored icon, bold value, tiny label. */
const StatCell = ({ icon: Icon, value, label, tone }) => (
  <div className="flex min-w-0 flex-col items-center gap-0.5 px-2 py-2 text-center">
    <Icon className={cn("size-3.5 shrink-0", tone)} strokeWidth={1.85} />
    <span className="w-full truncate text-xs font-bold tabular-nums">
      {value}
    </span>
    <span className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
      {label}
    </span>
  </div>
);

/**
 * FarmCard — tall list card. Deep FarmTypeArt hero band, a large
 * gradient type tile overlapping it, roomier type, and a divided KPI
 * strip (area · coordinates · added) above the footer action bar.
 */
const FarmCard = ({
  farm,
  index,
  onDeactivate,
  onActivate,
  onEdit,
  canManage = true,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const t = getFarmType(farm.farmType);
  const TypeIcon = t.icon;
  const coords = formatCoords(farm.latitude, farm.longitude, 2);

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={farm.id}
    >
      <div className="group/farm glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/20">
        {/* Subtle type-tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity duration-300 group-hover/farm:opacity-[0.08]",
            t.gradient
          )}
        />

        {/* Hero band — per-type FarmTypeArt with a scrim + accent strip */}
        <div className="relative h-20 shrink-0 overflow-hidden">
          <FarmTypeArt
            variant={t.art}
            className={cn(
              "size-full transition-transform duration-700 group-hover/farm:scale-105",
              !farm.isActive && "opacity-60 saturate-50"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          {/* Status pill in the top-right */}
          <div className="absolute top-3 right-3">
            <FarmStatusPill active={farm.isActive} />
          </div>
          <div className="absolute top-3 left-3">
            <FarmTypePill farmType={farm.farmType} size="sm" />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col px-4 pb-3">
          {/* Identity — large gradient type tile overlapping the hero */}
          <div className="flex items-end gap-2.5">
            <div
              className={cn(
                "relative -mt-6 flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br text-white shadow-lg ring-[3px] ring-card",
                t.gradient
              )}
            >
              <TypeIcon className="size-5.5" strokeWidth={1.85} />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <h3 className="min-w-0 truncate font-heading text-base font-bold tracking-tight">
                {farm.name}
              </h3>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <IconMapPin className="size-3.5 shrink-0" strokeWidth={1.85} />
                <span className="truncate">
                  {farm.location || "Location not set"}
                </span>
              </p>
            </div>
          </div>

          {/* KPI strip — area · coordinates · added */}
          <div className="mt-3 grid grid-cols-3 divide-x divide-border/40 rounded-xl border border-border/30 bg-muted/25">
            <StatCell
              icon={IconRuler2}
              value={formatArea(farm.totalArea, farm.areaUnit)}
              label="Area"
              tone="text-leaf"
            />
            <StatCell
              icon={IconChartDots}
              value={coords || "Not pinned"}
              label="Coords"
              tone="text-sky-warm"
            />
            <StatCell
              icon={IconCalendarPlus}
              value={formatDate(farm.createdAt)}
              label="Added"
              tone="text-wheat-deep dark:text-wheat"
            />
          </div>

          {/* Notes teaser */}
          {farm.notes && (
            <p className="mt-2.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <IconNote
                className={cn("size-3.5 shrink-0", t.text)}
                strokeWidth={1.85}
              />
              <span className="truncate">{farm.notes}</span>
            </p>
          )}
        </div>

        {/* Footer — updated + icon-only colored actions */}
        <div className="relative flex items-center justify-between gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-2">
          <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <IconHistory className="size-3.5 shrink-0" strokeWidth={1.85} />
            <span className="truncate">
              Updated {formatRelative(farm.updatedAt)}
            </span>
          </span>

          {canManage && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${farm.name}`}
                title="Edit farm"
                className={cn(
                  iconAction,
                  "bg-sky-warm/12 text-sky-warm hover:bg-sky-warm/22 hover:-translate-y-px"
                )}
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
              {farm.isActive ? (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  aria-label={`Deactivate ${farm.name}`}
                  title="Deactivate farm"
                  className={cn(
                    iconAction,
                    "bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:-translate-y-px"
                  )}
                >
                  <IconCircleOff className="size-4" strokeWidth={1.85} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onActivate}
                  aria-label={`Reactivate ${farm.name}`}
                  title="Reactivate farm"
                  className={cn(
                    iconAction,
                    "bg-leaf/12 text-leaf hover:bg-leaf/22 hover:-translate-y-px"
                  )}
                >
                  <IconRotate className="size-4" strokeWidth={1.85} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Deactivate confirmation */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent showCloseButton={false} size="sm" className="p-0">
            <DialogHeader className="p-5 pb-3">
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
                  <IconCircleOff className="size-5" strokeWidth={1.85} />
                </span>
                <div className="min-w-0">
                  <DialogTitle>Deactivate this farm?</DialogTitle>
                  <DialogDescription className="mt-1">
                    <span className="font-semibold text-foreground">
                      {farm.name}
                    </span>{" "}
                    will be marked inactive and filtered out of the active list.
                    The record stays intact for history and reporting.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="border-border/40 bg-muted/20 px-5 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  setConfirmOpen(false);
                  onDeactivate?.();
                }}
                className="gap-1.5 bg-red-500 text-white shadow-sm hover:bg-red-500/90"
              >
                <IconCircleOff className="size-3.5" strokeWidth={1.85} />
                Deactivate farm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Reveal>
  );
};

export default FarmCard;
