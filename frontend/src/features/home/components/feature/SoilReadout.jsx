
import SoilStat from "./SoilStat";
import { IconDroplet, IconBolt, IconFlask } from "@tabler/icons-react";

const SoilReadout = () => {
  const value = 6.4;
  const min = 4.5;
  const max = 8.5;
  const pct = ((value - min) / (max - min)) * 100;
  const idealStart = ((6.0 - min) / (max - min)) * 100;
  const idealEnd = ((7.0 - min) / (max - min)) * 100;

  return (
    <div className="mt-5 space-y-3">
      <div className="grid grid-cols-3 gap-2">
        <SoilStat icon={IconDroplet} label="pH" value="6.4" tone="text-leaf" />
        <SoilStat icon={IconBolt} label="EC" value="1.4" tone="text-sky-warm" />
        <SoilStat
          icon={IconFlask}
          label="Drainage"
          value="Good"
          tone="text-clay-deep dark:text-clay"
        />
      </div>
      <div>
        <div className="relative h-2 overflow-hidden rounded-full bg-muted/60">
          {/* ideal band */}
          <div
            className="absolute inset-y-0 bg-leaf/25"
            style={{ left: `${idealStart}%`, right: `${100 - idealEnd}%` }}
          />
          {/* marker */}
          <div
            className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-leaf bg-background shadow-sm"
            style={{ left: `${pct}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between font-mono text-[9px] text-muted-foreground">
          <span>4.5</span>
          <span className="text-leaf">ideal 6.0–7.0</span>
          <span>8.5</span>
        </div>
      </div>
    </div>
  );
}

export default SoilReadout;
