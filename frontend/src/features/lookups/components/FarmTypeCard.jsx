import { FarmTypeArt } from "@/components/effects";
import { Reveal } from "@/components/effects";
import { cn } from "@/lib/utils";

/**
 * FarmTypeCard — display card for a single farm-type entry.
 *
 * Layout mirrors the Add Farm section's FarmTypeCard style:
 *
 *   ┌──────────────────────────────┐
 *   │ ┌──┐                         │
 *   │ │◉ │  FarmTypeArt hero       │  ← hero band (h-32) with art fading
 *   │ └──┘    fades into body      │    down into the card body
 *   │                              │
 *   │ Greenhouse                   │  ← display name (bold, large)
 *   │ Protected cultivation inside │  ← line-clamped description
 *   │ a glass or poly-covered...   │
 *   │                              │
 *   └──────────────────────────────┘
 *
 * Props mirror what `/lookups/farm-types` returns:
 *  - farmType: { id, name, displayName, description }
 *  - meta:     the matching entry from `@/constants/farms` FARM_TYPES map
 *              (provides icon, art variant, gradient, palette tokens)
 *  - index:    stagger delay for the Reveal animation
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
          "group/farm glass-card texture-paper relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500",
          "hover:-translate-y-1 hover:shadow-xl hover:shadow-leaf/10"
        )}
      >
        {/* External tinted bloom on hover — subtle */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-px -z-10 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 group-hover/farm:opacity-60",
            meta.bg
          )}
        />

        {/* Hero band — FarmTypeArt scene + circular icon top-left.
            The art fades down into the card body via a bottom gradient
            so there's no hard line between hero and text. */}
        <div className="relative h-32 w-full shrink-0 overflow-hidden">
          <FarmTypeArt variant={meta.art} className="size-full" />
          {/* Type-tinted wash over the art */}
          <div
            className={cn(
              "pointer-events-none absolute inset-0 bg-gradient-to-br opacity-25",
              meta.gradient
            )}
          />
          {/* Bottom fade — art dissolves into the card body */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent from-20% via-card/60 to-card" />

          {/* Circular icon — top-left, frosted glass with type-tinted ring */}
          <div className="absolute top-3 left-3 z-10">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-full shadow-md backdrop-blur-sm ring-1 ring-inset",
                "bg-white/85 dark:bg-card/85",
                meta.border
              )}
            >
              <Icon className={cn("size-4", meta.text)} strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Body — sits flush under the faded hero band */}
        <div className="relative flex flex-1 flex-col gap-1.5 px-5 pt-1 pb-5">
          <h3 className="font-heading text-base font-bold leading-tight tracking-tight">
            {farmType.displayName}
          </h3>

          {/* Description — line-clamped at 2 lines to match the Add Farm
              picker card; users can see the full description by hovering
              or expanding the card in a future iteration. */}
          <p className="line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">
            {farmType.description}
          </p>
        </div>
      </div>
    </Reveal>
  );
};

export default FarmTypeCard;
