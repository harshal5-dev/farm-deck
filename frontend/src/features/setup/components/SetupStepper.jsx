import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";

/**
 * SetupStepper — the wizard's progress rail. Three work steps
 * (Farm → Fields → Crops) plus a terminal "Done" node. Completed nodes
 * fill with the primary gradient + a check, the current node gets a
 * gradient ring and glow, upcoming stay muted. When the flow reaches
 * the Done node it renders in its victory form — gradient-filled,
 * pulsing — with a "Completed" chip, so finishing is an explicit step
 * of the journey, not just the others turning green.
 *
 * Each node sits centered in its own segment, and the connector runs
 * from this node's center to the next node's center, so the rail is
 * symmetric — equal insets on both sides.
 */
const SetupStepper = ({ steps, current, counts = {} }) => {
  return (
    <div className="flex items-start">
      {steps.map((step, i) => {
        const isDone = i < current;
        const isCurrent = i === current;
        const isVictory = isCurrent && step.id === "done";
        const count = counts[step.id] ?? 0;
        return (
          <div
            key={step.id}
            className="relative flex min-w-0 flex-1 flex-col items-center"
          >
            {/* Connector — absolute, from this node's center to the
                next node's center. Rendered before the node so the
                node's background covers the line where they meet. */}
            {i < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 h-1 w-full overflow-hidden rounded-full bg-muted sm:top-5.5">
                <div
                  className={cn(
                    "h-full rounded-full bg-linear-to-r from-leaf to-lagoon transition-all duration-700",
                    i < current ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}

            {/* Node + label column */}
            <div className="flex w-16 shrink-0 flex-col items-center gap-1.5 sm:w-20">
              <div className="relative">
                {(isCurrent || isVictory) && (
                  <span
                    className={cn(
                      "absolute -inset-1.5 animate-pulse rounded-2xl blur-md",
                      isVictory
                        ? "bg-linear-to-br from-leaf/45 to-lagoon/45"
                        : "bg-linear-to-br from-leaf/30 to-lagoon/30"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-2xl transition-all duration-300 sm:size-11",
                    (isDone || isVictory) &&
                      "bg-linear-to-br from-leaf to-sage-deep text-white shadow-md shadow-leaf/25",
                    isCurrent &&
                      !isVictory &&
                      "bg-card text-leaf ring-2 ring-leaf/60 shadow-sm",
                    !isDone &&
                      !isCurrent &&
                      "border border-dashed border-border/70 bg-muted/30 text-muted-foreground/50"
                  )}
                >
                  {isDone || isVictory ? (
                    <IconCheck className="size-4.5" strokeWidth={2.5} />
                  ) : (
                    <step.icon className="size-4.5" strokeWidth={1.85} />
                  )}
                </span>
              </div>
              {/* Label */}
              <div className="flex flex-col items-center gap-0.5 text-center">
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-wide uppercase sm:text-[11px]",
                    isCurrent || isVictory
                      ? "text-foreground"
                      : isDone
                        ? "text-foreground/80"
                        : "text-muted-foreground/60"
                  )}
                >
                  {step.label}
                </span>
                {isDone && count > 0 && (
                  <span className="rounded-full bg-leaf/12 px-1.5 py-px text-[9px] font-bold text-leaf tabular-nums">
                    {count} added
                  </span>
                )}
                {isCurrent && !isVictory && step.optional && (
                  <span className="rounded-full border border-border/60 bg-muted/40 px-1.5 py-px text-[9px] font-semibold text-muted-foreground">
                    optional
                  </span>
                )}
                {isVictory && (
                  <span className="rounded-full border border-leaf/30 bg-leaf/12 px-1.5 py-px text-[9px] font-bold text-leaf">
                    Completed
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SetupStepper;
