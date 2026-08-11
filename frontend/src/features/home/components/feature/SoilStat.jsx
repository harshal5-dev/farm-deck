import { cn } from "@/lib/utils";


const SoilStat = ({ icon: Icon, label, value, tone }) => {
  return (
    <div className="rounded-lg bg-background/50 px-2 py-2 ring-1 ring-foreground/5">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3.5", tone)} strokeWidth={1.85} />
        <span className="text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
          {label}
        </span>
      </div>
      <p className="mt-0.5 font-heading text-sm font-bold tabular-nums">
        {value}
      </p>
    </div>
  );
}

export default SoilStat;
