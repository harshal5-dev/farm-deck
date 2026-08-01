import { cn } from "@/lib/utils";

const InfoBlock = ({
  label,
  value,
  icon: Icon,
  chip = "bg-muted/50",
  text = "text-muted-foreground",
}) => {
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
};

export default InfoBlock;
