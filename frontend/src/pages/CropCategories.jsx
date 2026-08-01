import { Link } from "react-router-dom";
import {
  IconArrowLeft,
  IconFlask,
  IconBolt,
  IconSun,
  IconTemperature,
  IconClock,
  IconWashMachine,
  IconSeedling,
  IconCalendar,
  IconChartScatter,
} from "@tabler/icons-react";
import { cropCategories } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useMockLoading } from "@/lib/use-mock-loading";
import { Badge } from "@/components/ui/badge";
import {
  Reveal,
  CropCategoryArt,
  SoilTypeCardSkeleton,
} from "@/components/effects";
import LevelMeter, { levelMeta } from "@/components/effects/LevelMeter";
import ResourceExplorer from "@/components/layout/ResourceExplorer";

const meta = {
  leaf: {
    gradient: "from-leaf/25 via-leaf/10 to-transparent",
    bg: "bg-leaf/15",
    text: "text-leaf",
  },
  wheat: {
    gradient: "from-wheat/25 via-wheat/10 to-transparent",
    bg: "bg-wheat/20",
    text: "text-wheat",
  },
  clay: {
    gradient: "from-clay/25 via-clay/10 to-transparent",
    bg: "bg-clay/15",
    text: "text-clay",
  },
  violet: {
    gradient: "from-violet-500/25 via-violet-500/10 to-transparent",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
  },
  sky: {
    gradient: "from-sky-warm/25 via-sky-warm/10 to-transparent",
    bg: "bg-sky-warm/15",
    text: "text-sky-warm",
  },
};

function InfoBlock({
  label,
  value,
  icon: Icon,
  chip = "bg-muted/50",
  text = "text-muted-foreground",
}) {
  return (
    <div className="rounded-xl p-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-md",
            chip
          )}
        >
          <Icon className={cn("size-3.5", text)} strokeWidth={2} />
        </span>
        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </span>
      </div>
      <p className="mt-1 pl-8 text-[12.5px] leading-relaxed text-muted-foreground">
        {value}
      </p>
    </div>
  );
}

function RangeChip({ label, value, icon: Icon, chip, text }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          chip
        )}
      >
        <Icon className={cn("size-3.5", text)} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className="text-xs font-bold tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function CropCategoryCard({ category }) {
  const m = meta[category.color] || meta.leaf;

  return (
    <div className="glass-card texture-paper highlight-edge group relative overflow-hidden rounded-2xl py-0 transition-shadow duration-200 hover:shadow-xl">
      {/* Art banner */}
      <div className="relative h-28 overflow-hidden">
        <div className={cn("absolute inset-0 bg-gradient-to-br", m.gradient)} />
        <CropCategoryArt
          variant={category.name}
          className="relative size-full"
        />
        {/* icon chip */}
        <div
          className={cn(
            "absolute -bottom-5 left-5 flex size-12 items-center justify-center rounded-2xl ring-4 ring-card",
            m.bg
          )}
        >
          <IconSeedling className={cn("size-6", m.text)} strokeWidth={1.7} />
        </div>
        {/* cycle tag */}
        <Badge className="absolute top-3 right-3 bg-background/70 px-2.5 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-sm">
          <IconCalendar className="mr-1 size-3" strokeWidth={2} />
          {category.growthDurationDays} day cycle
        </Badge>
      </div>

      <div className="px-5 pt-8 pb-4">
        <h3 className="font-heading text-lg font-bold tracking-tight">
          {category.displayName}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {category.description}
        </p>

        {/* nutrient ranges */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <RangeChip
            label="pH Range"
            value={`${category.typicalPhMin}–${category.typicalPhMax}`}
            icon={IconFlask}
            chip="bg-leaf/15"
            text="text-leaf"
          />
          <RangeChip
            label="EC (mS/cm)"
            value={`${category.typicalEcMin}–${category.typicalEcMax}`}
            icon={IconBolt}
            chip="bg-sky-warm/15"
            text="text-sky-warm"
          />
          <RangeChip
            label="PPM"
            value={`${category.typicalPpmMin}–${category.typicalPpmMax}`}
            icon={IconFlask}
            chip="bg-wheat/20"
            text="text-wheat"
          />
          <RangeChip
            label="Temp (°C)"
            value={category.temperatureRangeC}
            icon={IconTemperature}
            chip="bg-clay/15"
            text="text-clay"
          />
        </div>

        {/* light meter + hours */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <LevelMeter
            label="Light Need"
            value={category.lightRequirement}
            icon={IconSun}
            display={category.lightRequirement}
          />
          <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-2.5 py-2">
            <IconClock
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.7}
            />
            <div>
              <p className="text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                Photoperiod
              </p>
              <p className="text-xs font-bold">
                {category.lightHoursPerDay} hrs/day
              </p>
            </div>
          </div>
        </div>

        {/* info blocks */}
        <div className="mt-4 space-y-2">
          <InfoBlock
            label="Best Systems"
            value={category.bestSystems}
            icon={IconWashMachine}
            chip="bg-sky-warm/15"
            text="text-sky-warm"
          />
          <InfoBlock
            label="Harvest Method"
            value={category.harvestMethod}
            icon={IconChartScatter}
            chip="bg-leaf/15"
            text="text-leaf"
          />
          <InfoBlock
            label="Example Crops"
            value={category.exampleCrops}
            icon={IconSeedling}
            chip="bg-wheat/20"
            text="text-wheat"
          />
        </div>
      </div>
    </div>
  );
}

export default function CropCategories() {
  const loading = useMockLoading(700);

  const renderListItem = ({ item, active, onSelect }) => {
    const m = meta[item.color] || meta.leaf;
    return (
      <button
        key={item.id}
        onClick={() => onSelect(item.id)}
        className={cn(
          "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150",
          active ? "bg-leaf/10 ring-1 ring-inset ring-leaf/20" : "hover:bg-muted/50"
        )}
      >
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-lg", m.bg)}>
          <IconSeedling className={cn("size-5", m.text)} strokeWidth={1.85} />
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn("truncate text-sm font-semibold", active ? "text-foreground" : "text-foreground/80")}>
            {item.displayName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            pH {item.typicalPhMin}–{item.typicalPhMax} · {item.growthDurationDays}d cycle
          </p>
        </div>
        {active && <span className="size-2 shrink-0 rounded-full bg-leaf" />}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <Reveal duration={450}>
        <div>
          <Link
            to="/app/crops"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft className="size-4" strokeWidth={1.75} />
            Back to Crops
          </Link>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-leaf/15 text-leaf ring-1 ring-leaf/20 ring-inset">
                <IconSeedling className="size-6" strokeWidth={1.7} />
              </div>
              <div>
                <h1 className="font-heading text-2xl font-bold tracking-tight">
                  Crop Categories
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse all crop categories on the left — click any to see its
                  full profile. No scrolling required.
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full border border-border/50 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              {cropCategories.length} categories
            </span>
          </div>
        </div>
      </Reveal>

      <ResourceExplorer
        items={cropCategories}
        isLoading={loading}
        skeletonCount={7}
        renderListItem={renderListItem}
        renderDetail={(item) => <CropCategoryCard category={item} />}
        ListSkeleton={() => (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="size-9 animate-pulse rounded-lg bg-muted" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-32 animate-pulse rounded bg-muted" />
            </div>
          </div>
        )}
        DetailSkeleton={() => <SoilTypeCardSkeleton />}
        emptyState="No crop categories found."
      />
    </div>
  );
}
