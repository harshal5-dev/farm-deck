import { IconMapPin } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FarmTypeArt } from "@/components/effects";
import { getAreaUnit, getFarmType } from "@/constants/farms";
import { FarmTypePill } from "../pills";

/**
 * Live identity preview for the farm form, driven by watched form
 * values. Mirrors the new farms payload: name + location text, the
 * selected farm type (by name, for styling), the optional pin, and
 * total area with its unit. Per docs/GEOLOCATION_DESIGN.md coordinates
 * are never rendered back as numbers — only a pinned/not-pinned state.
 *
 * Full-height card on desktop: the identity cluster centers in the
 * space under the hero band while the area/pin summary anchors to the
 * bottom, so the left column stays balanced next to the tall form.
 */
const FarmIdentityPreview = ({
  name,
  location,
  farmTypeName,
  latitude,
  longitude,
  totalArea,
  areaUnit,
}) => {
  const t = getFarmType(farmTypeName);
  const TypeIcon = t.icon;
  const displayName = (name || "").trim() || "New farm";
  const displayLocation = (location || "").trim() || "Location not set";
  const hasPin =
    latitude !== "" &&
    latitude != null &&
    longitude !== "" &&
    longitude != null;
  const area = totalArea === "" || totalArea == null ? null : Number(totalArea);
  const unit = getAreaUnit(areaUnit);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/40 p-0 shadow-sm backdrop-blur lg:h-full">
      {/* Top hero band — live FarmTypeArt preview that reacts to the
          selected farm type so the form feels alive as you click between
          cards. */}
      <div className="relative h-32 w-full shrink-0 overflow-hidden">
        <FarmTypeArt variant={t.art} className="size-full" />
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

      {/* Body — cluster centered in the leftover height, summary at the
          bottom edge */}
      <div className="relative flex min-h-0 w-full flex-1 flex-col px-5 pt-0 pb-5">
        {/* Soft type-tinted glow filling the space behind the cluster */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-6 top-6 bottom-16 rounded-full bg-linear-to-b opacity-[0.08] blur-3xl",
            t.gradient
          )}
        />

        {/* Identity cluster — vertically centered; the -mt pull keeps it
            visually connected to the hero band at natural height */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <div className="-mt-9 flex flex-col items-center text-center">
            <div className="relative">
              {/* Type-tinted halo behind the avatar */}
              <div
                className={cn(
                  "absolute -inset-3 rounded-full opacity-60 blur-xl",
                  t.bg
                )}
              />

              {/* Avatar — gradient shell around a frosted-glass core with
                  the type icon in its accent color. The inner tint wash +
                  top specular shine keep it feeling like a polished app
                  icon in both light and dark themes. */}
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
            <p className="mt-0.5 max-w-full truncate text-xs text-muted-foreground">
              {displayLocation}
            </p>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <FarmTypePill farmType={farmTypeName} />
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase",
                  hasPin
                    ? "border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-400"
                    : "border-border/50 bg-muted/40 text-muted-foreground"
                )}
              >
                <IconMapPin className="size-2.5" strokeWidth={2.2} />
                {hasPin ? "Pinned" : "No pin"}
              </span>
            </div>
          </div>
        </div>

        {/* Area / pin summary — anchored to the bottom of the card */}
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
              {area != null && !Number.isNaN(area)
                ? `${area} ${unit.label}`
                : "Size not set"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="inline-flex size-5 items-center justify-center rounded-md bg-clay/12 text-clay-deep dark:text-clay">
              <IconMapPin className="size-3" strokeWidth={2} />
            </span>
            <span className="font-semibold tracking-tight">
              {hasPin ? "On the map" : "No coordinates"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmIdentityPreview;
