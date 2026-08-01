import { FarmTypeArt } from "@/components/effects";
import { Card } from "@/components/ui/card";
import { typeMeta } from "@/constant/global";
import { Badge } from "@/components/ui/badge";
import { IconBulb, IconCoin, IconDropletFilled } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const FarmTypeCard = ({ type }) => {
  const meta = typeMeta[type.name] || typeMeta.outdoor;
  const Icon = meta.icon;

  const infoRows = [
    {
      icon: IconBulb,
      label: "Key Considerations",
      value: type.keyConsiderations,
      chip: meta.bg,
      text: meta.text,
    },
    {
      icon: IconDropletFilled,
      label: "Ideal Systems",
      value: type.idealHydroSystems,
      chip: "bg-sky-warm/15",
      text: "text-sky-warm",
    },
    {
      icon: IconCoin,
      label: "Setup Costs",
      value: type.commonSetupCosts,
      chip: "bg-wheat/20",
      text: "text-wheat",
    },
  ];

  return (
    <Card
      className={cn(
        "glass-card texture-paper highlight-edge group relative overflow-hidden py-0 transition-shadow duration-200 hover:shadow-xl",
        meta.glow
      )}
    >
      {/* Illustration banner */}
      <div className="relative h-28 overflow-hidden">
        <div
          className={cn("absolute inset-0 bg-linear-to-br", meta.gradient)}
        />
        <FarmTypeArt variant={type.name} className="relative size-full" />
        {/* icon chip overlapping the banner */}
        <div
          className={cn(
            "absolute -bottom-5 left-5 flex size-12 items-center justify-center rounded-2xl ring-4 ring-card",
            meta.bg
          )}
        >
          <Icon className={cn("size-6", meta.text)} strokeWidth={1.7} />
        </div>
        {/* type tag top-right */}
        <Badge
          variant={meta.color}
          className="absolute top-3 right-3 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-sm"
        >
          {type.name}
        </Badge>
      </div>

      {/* Title + description */}
      <div className="px-5 pt-3 pb-4">
        <h3 className="font-heading text-lg font-bold tracking-tight">
          {type.displayName}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
          {type.description}
        </p>

        {/* Info rows */}
        <div className="mt-4 space-y-2.5">
          {infoRows.map((row) => {
            const RowIcon = row.icon;
            return (
              <div key={row.label} className="rounded-xl p-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-md",
                      row.chip
                    )}
                  >
                    <RowIcon
                      className={cn("size-3.5", row.text)}
                      strokeWidth={2}
                    />
                  </span>
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                    {row.label}
                  </span>
                </div>
                <p className="mt-1 pl-8 text-[12.5px] leading-relaxed text-muted-foreground">
                  {row.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default FarmTypeCard;
