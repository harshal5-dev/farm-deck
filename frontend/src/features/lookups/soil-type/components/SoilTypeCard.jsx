import { cn } from "@/lib/utils";
import { SoilTypeArt } from "@/components/effects";
import { Badge } from "@/components/ui/badge";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconDroplet,
  IconDropletFilled,
  IconDropletOff,
  IconFeather,
  IconFlask,
  IconFlower,
  IconGauge,
  IconLeaf,
  IconMountain,
  IconPlant,
  IconSeeding,
  IconTrees,
} from "@tabler/icons-react";
import { soilTypeMeta } from "../constants";
import SoilTypeLevelMeter from "./SoilTypeLevelMeter";
import InfoBlock from "./InfoBlock";

const soilIcons = {
  loamy: IconPlant,
  sandy: IconDropletOff,
  sandy_loam: IconFlower,
  clay: IconDropletFilled,
  clay_loam: IconSeeding,
  silt: IconFeather,
  chalky: IconMountain,
  peaty: IconTrees,
};

const SoilTypeCard = ({ type }) => {
  const meta = soilTypeMeta[type.name] || soilTypeMeta.loamy;
  const SoilIcon = soilIcons[type.name] || IconPlant;

  return (
    <div className="glass-card texture-paper highlight-edge group relative overflow-hidden rounded-2xl py-0 transition-shadow duration-200 hover:shadow-xl">
      {/* Art banner */}
      <div className="relative h-28 overflow-hidden">
        <div
          className={cn("absolute inset-0 bg-linear-to-br", meta.gradient)}
        />
        <SoilTypeArt variant={type.name} className="relative size-full" />
        {/* overlapping icon chip */}
        <div
          className={cn(
            "absolute -bottom-5 left-5 flex size-12 items-center justify-center rounded-2xl ring-4 ring-card",
            meta.bg
          )}
        >
          <SoilIcon className={cn("size-6", meta.text)} strokeWidth={1.7} />
        </div>
        {/* pH tag */}
        <Badge className="absolute top-3 right-3 bg-background/70 px-2.5 py-0.5 font-mono text-[10px] font-bold text-foreground backdrop-blur-sm">
          pH {type.phRange}
        </Badge>
      </div>

      <div className="px-5 pt-8 pb-4">
        <h3 className="font-heading text-lg font-bold tracking-tight">
          {type.displayName}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {type.description}
        </p>

        {/* Level meters */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <SoilTypeLevelMeter
            label="Water"
            value={type.waterRetention}
            icon={IconDroplet}
          />
          <SoilTypeLevelMeter
            label="Drainage"
            value={type.drainage}
            icon={IconGauge}
          />
          <SoilTypeLevelMeter
            label="Nutrients"
            value={type.nutrientRetention}
            icon={IconFlask}
          />
          <div className="flex flex-col justify-center rounded-lg bg-muted/40 p-2">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
              <IconDroplet className="size-3" strokeWidth={2} />
              Acidity
            </div>
            <span className="mt-1 font-mono text-[13px] font-bold text-foreground">
              {type.phRange}
            </span>
          </div>
        </div>

        {/* Text info blocks */}
        <div className="mt-4 space-y-2">
          <InfoBlock
            label="Best For"
            value={type.bestFor}
            icon={IconLeaf}
            chip="bg-leaf/15"
            text="text-leaf"
          />
          <InfoBlock
            label="Challenges"
            value={type.challenges}
            icon={IconAlertTriangle}
            chip="bg-clay/15"
            text="text-clay"
          />
          <InfoBlock
            label="Amendments"
            value={type.amendmentsNeeded}
            icon={IconCircleCheck}
            chip="bg-sky-warm/15"
            text="text-sky-warm"
          />
        </div>
      </div>
    </div>
  );
};

export default SoilTypeCard;
