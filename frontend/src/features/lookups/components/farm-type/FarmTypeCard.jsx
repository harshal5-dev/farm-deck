import { Reveal, FarmTypeArt } from "@/components/effects";
import { cn } from "@/lib/utils";

/**
 * FarmTypeCard — a lookup row rendered with the same card design as the
 * add-farm form's type picker: FarmTypeArt band with a gradient wash and
 * the circular type badge top-left, then the display name and a clamped
 * description. Static (no selection state) with a gentle page-card lift
 * on hover; full description shows via the native tooltip.
 */
const FarmTypeCard = ({ farmType, meta, index = 0 }) => {
  const Icon = meta.icon;

  return (
    <Reveal
      delay={Math.min(index * 60, 360)}
      duration={500}
      changeKey={farmType.id}
    >
      <div
        className={cn(
          "group/farm relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card/40 transition-all duration-200",
          "hover:-translate-y-1 hover:border-border hover:bg-card/70 hover:shadow-xl hover:shadow-leaf/10"
        )}
      >
        {/* Top art band */}
        <div className="relative h-24 w-full shrink-0 overflow-hidden">
          <FarmTypeArt variant={meta.art} className="size-full" />
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-linear-to-br opacity-25 transition-opacity duration-200 group-hover/farm:opacity-50",
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
        </div>

        {/* Body — full description; the lookups view IS the documentation */}
        <div className="flex flex-1 items-start gap-2 p-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold tracking-tight text-foreground">
              {farmType.displayName}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {farmType.description}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
};

export default FarmTypeCard;
