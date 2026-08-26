import { SoilTypeArt } from "@/components/effects";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";

/**
 * SoilTypeCard — a lookup row rendered with the same card design as the
 * farm-type and zone-type lookup cards: SoilTypeArt band with a gradient
 * wash and the circular texture badge top-left, then the display name, a
 * pair of water-retention / drainage pills, and the full description.
 * Static (no selection state) with a gentle page-card lift on hover.
 */
const SoilTypeCard = ({ soilType, meta, index = 0 }) => {
  const Icon = meta.icon;

  return (
    <Reveal
      delay={Math.min(index * 60, 360)}
      duration={500}
      changeKey={soilType.id}
    >
      <div
        className={cn(
          "group/soil relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all duration-200",
          "hover:-translate-y-1 hover:border-border hover:bg-card/70 hover:shadow-xl hover:shadow-leaf/10"
        )}
      >
        {/* Top art band */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden">
          <SoilTypeArt variant={meta.art} className="size-full" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-25 transition-opacity duration-200 group-hover/soil:opacity-50",
              meta.gradient
            )}
          />
          <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
          {/* Top-left texture icon badge — solid gradient circle */}
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
        </div>

        {/* Body — name, character pills, full description */}
        <div className="flex flex-1 flex-col gap-2 p-3">
          <p className="text-sm font-bold tracking-tight text-foreground">
            {soilType.displayName}
          </p>

          {/* Water retention + drainage character pills */}
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border/40">
              <span className="size-1 rounded-full bg-lagoon" />
              {soilType.waterRetention} retention
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-muted/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground ring-1 ring-inset ring-border/40">
              <span className="size-1 rounded-full bg-leaf" />
              {soilType.drainage} drainage
            </span>
          </div>

          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {soilType.description ?? meta.description}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

export default SoilTypeCard;
