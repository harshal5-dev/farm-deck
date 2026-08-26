import HydroSystemArt from "@/features/fields/components/HydroSystemArt";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";

/**
 * HydroSystemCard — a lookup row rendered with the same card design as the
 * farm-type, zone-type and soil-type lookup cards: HydroSystemArt band
 * with a gradient wash and the circular system badge top-left, then the
 * display name, a tagline pill, and the full description. The hydro-system
 * response carries no extra data fields, so the tagline (from the local
 * visual meta) surfaces the system's defining trait the way the zone card
 * surfaces `cultivationMode` and the soil card surfaces retention/drainage.
 * Static (no selection state) with a gentle page-card lift on hover.
 */
const HydroSystemCard = ({ hydroSystemType, meta, index = 0 }) => {
  const Icon = meta.icon;

  return (
    <Reveal
      delay={Math.min(index * 60, 360)}
      duration={500}
      changeKey={hydroSystemType.id}
    >
      <div
        className={cn(
          "group/hydro relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all duration-200",
          "hover:-translate-y-1 hover:border-border hover:bg-card/70 hover:shadow-xl hover:shadow-lagoon/10"
        )}
      >
        {/* Top art band */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden">
          <HydroSystemArt variant={meta.art} className="size-full" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-25 transition-opacity duration-200 group-hover/hydro:opacity-50",
              meta.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          {/* Top-left system icon badge — solid gradient circle */}
          <div className="absolute top-2 left-2">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-white shadow-md ring-2 ring-card",
                `bg-linear-to-br ${meta.gradient}`
              )}
            >
              <Icon className="size-3.5" strokeWidth={2.1} />
            </span>
          </div>
          {/* Top-right system tagline pill */}
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center rounded-full bg-card/70 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border/40 backdrop-blur-sm">
              {meta.tagline}
            </span>
          </div>
        </div>

        {/* Body — full description; the lookups view IS the documentation */}
        <div className="flex flex-1 items-start gap-2 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold tracking-tight text-foreground">
              {hydroSystemType.displayName}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {hydroSystemType.description ?? meta.tagline}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default HydroSystemCard;
