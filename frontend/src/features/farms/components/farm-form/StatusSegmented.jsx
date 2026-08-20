import { cn } from "@/lib/utils";
import { FARM_STATUS_META, FARM_STATUS_ORDER } from "@/constants/farms";

/**
 * StatusSegmented — three-way segmented control for the farm lifecycle
 * status (Active / Planning / Archived). Each segment carries a small
 * status dot so the visual cue matches the FarmStatusPill used in cards.
 */
const StatusSegmented = ({ value, onChange, disabled }) => {
  return (
    <div className="inline-flex h-9 w-full items-center gap-0.5 rounded-2xl border border-border/50 bg-card/60 p-1 shadow-sm sm:w-fit">
      {FARM_STATUS_ORDER.map((id) => {
        const s = FARM_STATUS_META[id];
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => !disabled && onChange?.(id)}
            disabled={disabled}
            className={cn(
              "inline-flex h-7 flex-1 items-center justify-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-all duration-200 sm:flex-none",
              active
                ? "bg-linear-to-br from-leaf to-sage-deep text-primary-foreground shadow-sm shadow-leaf/30"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                active ? "bg-primary-foreground/80" : s.dot
              )}
            />
            {s.label}
          </button>
        );
      })}
    </div>
  );
};

export default StatusSegmented;
