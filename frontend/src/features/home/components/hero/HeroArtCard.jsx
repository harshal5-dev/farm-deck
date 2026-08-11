
import { FarmScene } from "@/components/effects";
import { heroMetrics } from "../../constants";
import MetricCell from "./MetricCell";

const HeroArtCard = () => {
  return (
    <div className="relative">
      {/* Soft glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-linear-to-br from-leaf/20 via-sky-warm/15 to-clay/15 opacity-70 blur-2xl"
      />

      <div className="glass-card texture-paper highlight-edge relative h-80 overflow-hidden rounded-3xl ring-1 ring-foreground/5 sm:h-104">
        {/* Decorative contour pattern */}
        <div className="pattern-contour absolute inset-0 opacity-30" />

        {/* Farm scene */}
        <FarmScene className="absolute! inset-0 size-full" />

        {/* Bottom scrim for legibility */}
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/40 to-transparent" />

        {/* Live status panel */}
        <div className="absolute right-4 bottom-4 left-4">
          <div className="rounded-2xl bg-background/85 px-4 py-3.5 shadow-md ring-1 ring-foreground/5 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <p className="text-[10px] font-bold tracking-wider text-leaf uppercase">
                  Live overview
                </p>
              </div>
              <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                v1.0
              </span>
            </div>

            <div className="mt-3 grid grid-cols-4 divide-x divide-foreground/5">
              {heroMetrics.map((m) => (
                <MetricCell key={m.key} metric={m} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroArtCard;
