
import { cn } from "@/lib/utils";

const MetricCell = ({ metric }) => {
  const displayValue = metric.decimals
    ? metric.value.toFixed(metric.decimals)
    : metric.value;
  return (
    <div className="flex flex-col items-center justify-center px-1 text-center first:pl-0 last:pr-0">
      <p
        className={cn(
          "font-heading text-lg font-bold tabular-nums leading-none sm:text-xl",
          metric.accent
        )}
      >
        {displayValue}
      </p>
      <p className="mt-1 text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
        {metric.label}
      </p>
    </div>
  );
}

export default MetricCell;
