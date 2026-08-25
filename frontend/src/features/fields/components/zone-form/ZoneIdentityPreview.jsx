import { cn } from "@/lib/utils";
import { IconTractor } from "@tabler/icons-react";
import { getAreaUnit } from "@/constants/farms";
import { getZoneType } from "../../constants";
import ZoneTypeArt from "../ZoneTypeArt";
import { ZoneTypePill, ZoneStatusPill } from "../pills";

/**
 * Live identity preview for the zone form, driven by watched form
 * values — mirrors FarmIdentityPreview's layout (hero band, centered
 * avatar cluster, bottom summary) so the two forms feel native to
 * each other.
 */
const ZoneIdentityPreview = ({
  name,
  farmName,
  zoneTypeName,
  zoneStatus,
  area,
  areaUnit,
}) => {
  const t = getZoneType(zoneTypeName);
  const TypeIcon = t.icon;
  const displayName = (name || "").trim() || "New field";
  const displayFarm = (farmName || "").trim() || "No farm selected";
  const unit = getAreaUnit(areaUnit);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full lg:max-h-[70svh]">
      {/* Top hero band — live ZoneTypeArt preview that reacts to the
          selected zone type so the form feels alive as you click between
          cards. */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <ZoneTypeArt variant={t.art} className="size-full" />
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

      {/* Body — identity cluster centered, summary at the bottom */}
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
              {/* Avatar — gradient shell around a frosted-glass core */}
              <div
                className={cn(
                  "relative size-20 rounded-full bg-linear-to-br p-[3px] shadow-lg",
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
              {displayName}
            </h3>
            <p className="mt-0.5 flex max-w-full items-center gap-1 truncate text-xs text-muted-foreground">
              <IconTractor className="size-3.5 shrink-0" strokeWidth={1.85} />
              <span className="truncate">{displayFarm}</span>
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <ZoneTypePill typeName={zoneTypeName} />
              <ZoneStatusPill status={zoneStatus} />
            </div>
          </div>
        </div>

        {/* Area summary — anchored to the bottom of the card */}
        <div className="relative mt-6 flex w-full items-center justify-between gap-2 rounded-xl bg-muted/40 px-3 py-2 text-[11px] backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span
              className={cn(
                "inline-flex size-5 items-center justify-center rounded-md",
                t.bg
              )}
            >
              <TypeIcon className={cn("size-3", t.text)} strokeWidth={2} />
            </span>
            <span className="font-semibold tracking-tight">
              {area !== "" && area != null && !Number.isNaN(Number(area))
                ? `${Number(area)} ${unit.label}`
                : "Size not set"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-flex size-5 items-center justify-center rounded-md bg-leaf/12 text-leaf">
              <IconTractor className="size-3" strokeWidth={2} />
            </span>
            <span className="font-semibold tracking-tight">
              {farmName ? "On a farm" : "No farm"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoneIdentityPreview;
