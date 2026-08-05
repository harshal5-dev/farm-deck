import { cn } from "@/lib/utils";
import { SoilTypeLevelStyles } from "../constants";

const SoilTypeLevelMeter = ({ label, value, icon: Icon }) => {
  const style =
    SoilTypeLevelStyles[value?.toLowerCase()] || SoilTypeLevelStyles.medium;
  return (
    <div className="rounded-lg bg-muted/40 p-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
        {Icon && <Icon className="size-3" strokeWidth={2} />}
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full", style.color)}
            style={{ width: `${style.pct}%` }}
          />
        </div>
        <span className={cn("text-[11px] font-bold capitalize", style.text)}>
          {value}
        </span>
      </div>
    </div>
  );
};

export default SoilTypeLevelMeter;
