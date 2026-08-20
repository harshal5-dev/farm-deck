import { getFarmType } from "@/constants/farms";
import { FarmTypeArt } from "@/components/effects";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

const FarmTypeCard = ({ farmTypeId, selected, onSelect, disabled }) => {
  const t = getFarmType(farmTypeId);
  const Icon = t.icon;
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(farmTypeId)}
      disabled={disabled}
      className={cn(
        "group/type relative flex flex-col items-stretch overflow-hidden rounded-2xl border p-0 text-left transition-all duration-200",
        selected
          ? cn("border-transparent shadow-md ring-2", t.ring)
          : "border-border/50 bg-card/40 hover:border-border hover:bg-card/70"
      )}
    >
      {/* Top art band */}
      <div className="relative h-16 w-full overflow-hidden">
        <FarmTypeArt variant={t.art} className="size-full" />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-linear-to-br opacity-30 transition-opacity duration-200",
            selected ? "opacity-50" : "opacity-25",
            t.gradient
          )}
        />
        <div className="absolute inset-0 bg-linear-to-t from-card via-card/30 to-transparent" />
        {/* Top-left type icon chip */}
        <div className="absolute top-2 left-2">
          <span
            className={cn(
              "inline-flex size-7 items-center justify-center rounded-lg shadow-sm ring-1 ring-white/15 ring-inset backdrop-blur",
              t.gradient
            )}
          >
            <Icon className="size-3.5 text-white" strokeWidth={2} />
          </span>
        </div>
        {/* Selected check */}
        {selected && (
          <span
            className={cn(
              "absolute top-2 right-2 flex size-5 items-center justify-center rounded-full text-white shadow-sm ring-2 ring-card",
              `bg-linear-to-br ${t.gradient}`
            )}
          >
            <IconCheck className="size-3" strokeWidth={3} />
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex items-center gap-2 p-2.5">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs font-bold tracking-tight",
              selected ? t.text : "text-foreground"
            )}
          >
            {t.label}
          </p>
          <p className="truncate text-[10px] text-muted-foreground">
            {t.tagline}
          </p>
        </div>
      </div>
    </button>
  );
};

export default FarmTypeCard;
