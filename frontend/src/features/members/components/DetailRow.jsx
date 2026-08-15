
import { cn } from "@/lib/utils";

const DetailRow = ({ icon: Icon, label, value, accent, roleMeta }) => {
  const valueClass = cn(
    "truncate text-xs font-semibold tabular-nums",
    accent === "amber" && "text-amber-700 dark:text-amber-400",
    accent === "role" && roleMeta?.text
  );
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 px-3 py-2.5">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-lg",
          accent === "role"
            ? roleMeta?.bg
            : "bg-background/60 text-muted-foreground/80"
        )}
      >
        <Icon className="size-3.5" strokeWidth={1.85} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
          {label}
        </p>
        <p className={valueClass}>{value}</p>
      </div>
    </div>
  );
}

export default DetailRow;
