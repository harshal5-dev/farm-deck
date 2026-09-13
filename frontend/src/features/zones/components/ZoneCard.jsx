import { useState } from "react";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";
import {
  IconCalendarPlus,
  IconChevronDown,
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
import { getZoneType, getZoneStatus } from "../constants";
import {
  formatAge,
  formatArea,
  formatDate,
  formatLiters,
  formatRelative,
  humanizeToken,
} from "../lib/format";
import ZoneTypeArt from "./ZoneTypeArt";

const iconAction =
  "inline-flex size-8 items-center justify-center rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50";

/** Compact glanceable stat — small tinted icon chip + bold value. */
const StatTile = ({ chip, icon: Icon, value, label }) => (
  <div className="flex min-w-0 items-center gap-2 rounded-xl border border-border/40 bg-muted/20 px-2 py-1.5 transition-colors duration-300 group-hover/zone:border-border/60">
    <span
      className={cn(
        "flex size-7 shrink-0 items-center justify-center rounded-lg border",
        chip
      )}
    >
      <Icon className="size-3.5" strokeWidth={1.85} />
    </span>
    <div className="min-w-0 flex-1">
      <p className="truncate text-xs leading-tight font-bold tabular-nums">
        {value}
      </p>
      <p className="truncate text-[9px] leading-tight font-semibold tracking-wider text-muted-foreground/70 uppercase">
        {label}
      </p>
    </div>
  </div>
);

/** One label → value line inside the cultivation panel. */
const SpecRow = ({ label, value }) => (
  <div className="flex items-baseline justify-between gap-3 text-[11px] leading-5">
    <span className="shrink-0 font-medium text-muted-foreground/80">
      {label}
    </span>
    <span className="min-w-0 truncate text-right font-semibold text-foreground">
      {value}
    </span>
  </div>
);

/**
 * ZoneCard — compact list card. A clean ZoneTypeArt banner, the type
 * tile overlapping it with name + a live dot, the farm · status meta
 * line, then a stat duo: Area plus either the cultivation accordion
 * trigger (soil profile / hydro setup — the spec rows stay collapsed
 * until the trigger is clicked) or, for types without a detail section
 * yet, the added date. Optional notes teaser above the footer bar.
 * Inactive zones get the muted dashed treatment so they read clearly
 * as archived at a glance.
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
  const [detailsOpen, setDetailsOpen] = useState(false);

  const zoneType = zone.zoneType; // decorated lookup row from the list
  const t = getZoneType(zoneType?.name);
  const TypeIcon = t.icon;
  const isSoil = zoneType?.cultivationMode === "soil";
  const isHydro = zoneType?.cultivationMode === "hydro";
  const live = zone.isActive;
  const hasDetails = isSoil || isHydro;

  // zoneStatus is a mock-era field the API doesn't carry (yet) — hide the
  // status segment entirely instead of defaulting every card to "Idle".
  const statusMeta = zone.zoneStatus ? getZoneStatus(zone.zoneStatus) : null;
  const statusAge = zone.statusChangedAt
    ? formatAge(zone.statusChangedAt)
    : null;

  const panelTitle = isSoil ? "Soil profile" : "Hydro setup";

  // Spec rows revealed by the accordion — soil behaviour / hydro rig.
  // Tokens (retention, drainage, media) are humanized for display.
  const specRows = [];
  if (isSoil) {
    specRows.push(["Soil", zone.soilType?.displayName ?? "Not set"]);
    if (zone.soilType?.waterRetention)
      specRows.push([
        "Retention",
        humanizeToken(zone.soilType.waterRetention),
      ]);
    if (zone.soilType?.drainage)
      specRows.push(["Drainage", humanizeToken(zone.soilType.drainage)]);
  } else if (isHydro) {
    const d = zone.hydroSystemTypeDetails;
    specRows.push(["System", zone.hydroSystemType?.displayName ?? "Not set"]);
    if (d?.growMedium) specRows.push(["Medium", humanizeToken(d.growMedium)]);
    if (d?.reservoirVolumeLiters != null)
      specRows.push(["Reservoir", formatLiters(d.reservoirVolumeLiters)]);
    if (d?.numberOfSlots != null)
      specRows.push(["Slots", String(d.numberOfSlots)]);
  }
  const hasExtras = specRows.length > 1;

  return (
    <Reveal
      delay={Math.min(index * 40, 240)}
      duration={400}
      changeKey={zone.id}
    >
      <div
        className={cn(
          "group/zone relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300",
          live
            ? cn(
                "glass-card texture-paper highlight-edge hover:-translate-y-1 hover:shadow-xl",
                t.glow
              )
            : "border border-dashed border-border/70 bg-muted/25 backdrop-blur-sm hover:border-border hover:shadow-md"
        )}
      >
        {/* Subtle type-tinted wash — inactive cards keep a trace of it */}
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br transition-opacity duration-300",
            live
              ? cn("opacity-[0.04] group-hover/zone:opacity-[0.08]", t.gradient)
              : cn("opacity-[0.015] grayscale", t.gradient)
          )}
        />

        {/* Hero band — a clean per-type scene; the gradient tile below
            carries the type, so the art stays free of any chips. */}
        <div className="relative h-16 shrink-0 overflow-hidden">
          <ZoneTypeArt
            variant={t.art}
            className={cn(
              "size-full transition-transform duration-700",
              live ? "group-hover/zone:scale-105" : "opacity-40 grayscale"
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-1 overflow-hidden">
            <div
              className={cn(
                "absolute inset-0 bg-linear-to-r",
                live
                  ? t.gradient
                  : "from-muted-foreground/40 to-muted-foreground/20"
              )}
            />
          </div>
        </div>

        {/* Body */}
        <div className="relative flex flex-1 flex-col px-3.5 pb-2.5">
          {/* Identity — gradient type tile overlapping the hero, with a
              live dot beside the name as the only state marker. */}
          <div className="flex items-end gap-2.5">
            <div
              className={cn(
                "relative -mt-4 flex size-10 shrink-0 items-center justify-center rounded-xl text-white shadow-lg ring-[3px] ring-card",
                live
                  ? cn("bg-linear-to-br", t.gradient)
                  : "bg-linear-to-br from-muted-foreground/55 to-muted-foreground/35 shadow-none"
              )}
            >
              <TypeIcon className="size-5" strokeWidth={1.85} />
            </div>
            <div className="min-w-0 flex-1 pb-0.5">
              <h3
                className={cn(
                  "flex min-w-0 items-center gap-1.5 font-heading text-base font-bold tracking-tight",
                  !live && "text-muted-foreground"
                )}
              >
                <span className="truncate">{zone.name}</span>
                {live && (
                  <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
                )}
              </h3>
              <p className="mt-0.5 flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <IconTractor
                  className="size-3.5 shrink-0" strokeWidth={1.85}
                />
                <span className="truncate">
                  {zone.farmName || "Unknown farm"}
                </span>
                {statusMeta && (
                  <>
                    <span className="shrink-0 text-muted-foreground/40">·</span>
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <span
                        className={cn("size-1.5 rounded-full", statusMeta.dot)}
                      />
                      {statusMeta.label}
                      {statusAge && (
                        <span className="text-muted-foreground/70">
                          {statusAge}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Stat duo — area · accordion trigger (or added date) */}
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <StatTile
              chip="border-leaf/25 bg-leaf/10 text-leaf"
              icon={IconRuler2}
              value={formatArea(zone.area, zone.areaUnit)}
              label="Area"
            />
            {hasDetails ? (
              <button
                type="button"
                onClick={() => setDetailsOpen((o) => !o)}
                aria-expanded={detailsOpen}
                title={`${detailsOpen ? "Hide" : "Show"} ${panelTitle.toLowerCase()} details`}
                className={cn(
                  "flex min-w-0 items-center gap-2 rounded-xl border px-2 py-1.5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  detailsOpen
                    ? cn(t.border, t.bgSoft)
                    : "border-border/40 bg-muted/20 hover:border-border/60 group-hover/zone:border-border/60"
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-lg border",
                    isSoil
                      ? "border-wheat/30 bg-wheat/10 text-wheat-deep dark:text-wheat"
                      : "border-lagoon/30 bg-lagoon/10 text-lagoon-deep dark:text-lagoon"
                  )}
                >
                  <TypeIcon className="size-3.5" strokeWidth={1.85} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs leading-tight font-bold">
                    {panelTitle}
                  </span>
                  <span className="block truncate text-[9px] leading-tight font-semibold tracking-wider text-muted-foreground/70 uppercase">
                    {detailsOpen ? "Hide" : "Details"}
                  </span>
                </span>
                <IconChevronDown
                  className={cn(
                    "size-3.5 shrink-0 text-muted-foreground transition-transform duration-300",
                    detailsOpen && "rotate-180"
                  )}
                  strokeWidth={1.85}
                />
              </button>
            ) : (
              <StatTile
                chip="border-wheat/30 bg-wheat/10 text-wheat-deep dark:text-wheat"
                icon={IconCalendarPlus}
                value={formatDate(zone.createdAt)}
                label="Added"
              />
            )}
          </div>

          {/* Cultivation details — collapsed until the trigger is
              clicked; the grid-rows swap animates the height smoothly. */}
          {hasDetails && (
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                detailsOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div
                  className={cn(
                    "mt-2 space-y-0.5 rounded-xl border p-2",
                    live
                      ? cn(t.border, t.bgSoft)
                      : "border-border/40 bg-muted/15"
                  )}
                >
                  {specRows.map(([label, value]) => (
                    <SpecRow key={label} label={label} value={value} />
                  ))}
                  {!hasExtras && (
                    <p className="pt-0.5 text-[10px] text-muted-foreground/60 italic">
                      No extra details yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Types without a detail section yet keep a quiet teaser */}
          {!hasDetails && (
            <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/70 italic">
              <TypeIcon
                className={cn(
                  "size-3.5 shrink-0",
                  live ? t.text : "text-muted-foreground/60"
                )}
                strokeWidth={1.85}
              />
              Mode-specific details coming soon
            </p>
          )}

          {/* Notes teaser */}
          {zone.notes && (
            <p className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground/80">
              <IconNote
                className={cn(
                  "size-3.5 shrink-0",
                  live ? t.text : "text-muted-foreground/60"
                )}
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
