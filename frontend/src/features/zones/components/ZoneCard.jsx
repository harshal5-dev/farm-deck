import { useState } from "react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import {
  IconCalendarPlus,
  IconCircleOff,
  IconHistory,
  IconNote,
  IconPencil,
  IconRuler2,
  IconRotate,
  IconTractor,
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
import { getZoneType } from "../constants";
import { formatAge, formatArea, formatDate, formatRelative, formatLiters } from "../lib/format";
import ZoneTypeArt from "./ZoneTypeArt";
import { ZoneTypePill, ZoneStatusPill, ZoneActivePill } from "./pills";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** One cell of the KPI strip: colored icon, bold value, tiny label. */
const StatCell = ({ icon: Icon, value, label, tone }) => (
  <div className="flex min-w-0 flex-col items-center gap-0 px-2 py-1.5 text-center">
    <Icon className={cn("size-3.5 shrink-0", tone)} strokeWidth={1.85} />
    <span className="w-full truncate text-xs font-bold tabular-nums">
      {value}
    </span>
    <span className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
      {label}
    </span>
  </div>
);

/** Tiny rounded chip for cultivation detail facts (retention, slots…). */
const DetailChip = ({ children, tone }) => (
  <span
    className={cn(
      "inline-flex max-w-full items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[10px] font-semibold",
      tone || "border-border/50 bg-muted/35 text-muted-foreground"
    )}
  >
    {children}
  </span>
);

/**
 * ZoneCard — compact list card. A short illustrated ZoneTypeArt hero
 * (kept free of tags so the art breathes; only the active/inactive
 * pill sits on it), the identity tile overlapping it, then a single
 * pills row (type + container status + age), the KPI strip (area ·
 * cultivation detail · added), mode-specific detail chips and an
 * optional notes teaser above the footer action bar.
 */
const ZoneCard = ({
  zone,
  index,
  onDeactivate,
  onActivate,
  onEdit,
  canManage = true,
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const zoneType = zone.zoneType; // decorated lookup row from the list
  const t = getZoneType(zoneType?.name);
  const TypeIcon = t.icon;
  const isSoil = zoneType?.cultivationMode === "soil";
  const isHydro = zoneType?.cultivationMode === "hydro";

  const detailLabel = isSoil ? "Soil" : isHydro ? "System" : "Detail";
  const detailValue = isSoil
    ? zone.soilType?.displayName ?? "—"
    : isHydro
      ? zone.hydroSystemType?.displayName ?? "—"
      : "—";
  const detailTone = isSoil
    ? "text-wheat-deep dark:text-wheat"
    : "text-lagoon-deep dark:text-lagoon";

  const statusAge = zone.statusChangedAt ? formatAge(zone.statusChangedAt) : null;

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={zone.id}
    >
      <div className="group/zone glass-card texture-paper highlight-edge relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-lagoon/15">
        {/* Subtle type-tinted wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-[0.04] transition-opacity duration-300 group-hover/zone:opacity-[0.08]",
            t.gradient
          )}
        />

        {/* Hero band — per-type ZoneTypeArt scene, kept clean of tags
            (the type lives in the pills row below) so the illustration
            breathes. Active/inactive stays top-right as the one
            glanceable state on the art. */}
        <div className="relative h-16 shrink-0 overflow-hidden">
          <ZoneTypeArt
            variant={t.art}
            className={cn(
              "size-full transition-transform duration-700 group-hover/zone:scale-105",
              !zone.isActive && "opacity-60 saturate-50"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div className={cn("absolute inset-0 bg-linear-to-r", t.gradient)} />
          </div>
          {/* Status pill in the top-right */}
          <div className="absolute top-2.5 right-3">
            <ZoneActivePill active={zone.isActive} />
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
                {zone.name}
              </h3>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <IconTractor className="size-3.5 shrink-0" strokeWidth={1.85} />
                <span className="truncate">
                  {zone.farmName || "Unknown farm"}
                </span>
              </p>
            </div>
          </div>

          {/* Type + container status + age — one compact pills row */}
          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1.5">
            <ZoneTypePill typeName={zoneType?.name} size="xs" />
            <ZoneStatusPill status={zone.zoneStatus} />
            {statusAge && (
              <span className="truncate text-[10px] font-medium text-muted-foreground/80">
                for {statusAge}
              </span>
            )}
          </div>

          {/* KPI strip — area · cultivation detail · added */}
          <div className="mt-2 grid grid-cols-3 divide-x divide-border/40 rounded-xl border border-border/30 bg-muted/25">
            <StatCell
              icon={IconRuler2}
              value={formatArea(zone.area, zone.areaUnit)}
              label="Area"
              tone="text-leaf"
            />
            <StatCell
              icon={TypeIcon}
              value={detailValue}
              label={detailLabel}
              tone={detailTone}
            />
            <StatCell
              icon={IconCalendarPlus}
              value={formatDate(zone.createdAt)}
              label="Added"
              tone="text-wheat-deep dark:text-wheat"
            />
          </div>

          {/* Cultivation detail chips — soil behaviour / hydro rig */}
          <div className="mt-2 flex min-h-5 flex-wrap items-center gap-1.5">
            {isSoil && zone.soilType && (
              <>
                <DetailChip tone="border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-400">
                  {zone.soilType.waterRetention} retention
                </DetailChip>
                <DetailChip tone="border-wheat/30 bg-wheat/10 text-wheat-deep dark:text-wheat">
                  {zone.soilType.drainage} drainage
                </DetailChip>
              </>
            )}
            {isHydro && (
              <>
                {zone.hydroSystemTypeDetails?.growMedium && (
                  <DetailChip tone="border-lagoon/30 bg-lagoon/10 text-lagoon-deep dark:text-lagoon">
                    {zone.hydroSystemTypeDetails.growMedium}
                  </DetailChip>
                )}
                {zone.hydroSystemTypeDetails?.reservoirVolumeLiters != null && (
                  <DetailChip>
                    {formatLiters(zone.hydroSystemTypeDetails.reservoirVolumeLiters)}
                  </DetailChip>
                )}
                {zone.hydroSystemTypeDetails?.numberOfSlots != null && (
                  <DetailChip>
                    {zone.hydroSystemTypeDetails.numberOfSlots} slots
                  </DetailChip>
                )}
                {!zone.hydroSystemTypeDetails?.growMedium &&
                  zone.hydroSystemTypeDetails?.reservoirVolumeLiters == null &&
                  zone.hydroSystemTypeDetails?.numberOfSlots == null && (
                    <DetailChip>No rig details yet</DetailChip>
                  )}
              </>
            )}
            {!isSoil && !isHydro && (
              <DetailChip>
                Mode details coming soon
              </DetailChip>
            )}
          </div>

          {/* Notes teaser */}
          {zone.notes && (
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <IconNote
                className={cn("size-3.5 shrink-0", t.text)}
                strokeWidth={1.85}
              />
              <span className="truncate">{zone.notes}</span>
            </p>
          )}
        </div>

        {/* Footer — updated + icon-only colored actions */}
        <div className="relative flex items-center justify-between gap-2 border-t border-border/40 bg-muted/25 px-3.5 py-1.5">
          <span className="inline-flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <IconHistory className="size-3.5 shrink-0" strokeWidth={1.85} />
            <span className="truncate">
              Updated {formatRelative(zone.updatedAt)}
            </span>
          </span>

          {canManage && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Edit ${zone.name}`}
                title="Edit field"
                className={cn(
                  iconAction,
                  "bg-sky-warm/12 text-sky-warm hover:bg-sky-warm/22 hover:-translate-y-px"
                )}
              >
                <IconPencil className="size-4" strokeWidth={1.85} />
              </button>
              {zone.isActive ? (
                <button
                  type="button"
                  onClick={() => setConfirmOpen(true)}
                  aria-label={`Deactivate ${zone.name}`}
                  title="Deactivate field"
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
                  aria-label={`Reactivate ${zone.name}`}
                  title="Reactivate field"
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
                  <DialogTitle>Deactivate this field?</DialogTitle>
                  <DialogDescription className="mt-1">
                    <span className="font-semibold text-foreground">
                      {zone.name}
                    </span>{" "}
                    will be marked inactive and filtered out of the active
                    list. Its name frees up for reuse, and the record stays
                    intact for history.
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
                Deactivate field
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Reveal>
  );
};

export default ZoneCard;
