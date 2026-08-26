import ZoneTypeArt from "@/features/fields/components/ZoneTypeArt";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";

const MODE_LABELS = {
  soil: "Soil cultivation",
  hydro: "Hydroponic",
  other: "Specialised",
};

/**
 * ZoneTypeCard — a lookup row rendered with the same card design as the
 * farm-type lookup card and the add-zone form's type picker: ZoneTypeArt
 * band with a gradient wash and the circular type badge top-left, then
 * the display name, a cultivation-mode pill, and the full description.
 * Static (no selection state) with a gentle page-card lift on hover.
 */
const ZoneTypeCard = ({ zoneType, meta, index = 0 }) => {
  const Icon = meta.icon;
  const modeLabel = MODE_LABELS[zoneType.cultivationMode] ?? "Specialised";

  return (
    <Reveal
      delay={Math.min(index * 60, 360)}
      duration={500}
      changeKey={zoneType.id}
    >
      <div
        className={cn(
          "group/zone relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all duration-200",
          "hover:-translate-y-1 hover:border-border hover:bg-card/70 hover:shadow-xl hover:shadow-leaf/10"
        )}
      >
        {/* Top art band */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden">
          <ZoneTypeArt variant={meta.art} className="size-full" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-25 transition-opacity duration-200 group-hover/zone:opacity-50",
              meta.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          {/* Top-left type icon badge — solid gradient circle */}
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
          {/* Top-right cultivation-mode pill */}
          <div className="absolute top-2 right-2">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ring-1 ring-inset backdrop-blur-sm",
                "bg-card/70 text-muted-foreground ring-border/40"
              )}
            >
              {modeLabel}
            </span>
          </div>
        </div>

        {/* Body — full description; the lookups view IS the documentation */}
        <div className="flex flex-1 items-start gap-2 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold tracking-tight text-foreground">
              {zoneType.displayName}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {zoneType.description ?? meta.tagline}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default ZoneTypeCard;
