
import { AnimatedNumber } from "@/components/effects";
import { cn } from "@/lib/utils";

const StatTile = ({ value, suffix, label }) => {
  return (
    <div
      className={cn(
        "glass-card relative overflow-hidden rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5"
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-leaf/40 to-transparent"
      />
      <p className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export default StatTile;
