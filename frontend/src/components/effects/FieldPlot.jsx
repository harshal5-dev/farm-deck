import { cn } from "@/lib/utils"

/**
 * FieldPlot — a tiny top-down "farm map": a grid of field zones colored by
 * their status (or gray if inactive). Purely decorative + glanceable. Pass a
 * list of statuses; it tiles them into a plot. Seeds deterministically so it
 * stays stable across renders.
 */
const statusColor = {
  seeding: "var(--sky-warm)",
  growing: "var(--leaf)",
  flowering: "var(--clay)",
  harvested: "var(--wheat)",
  completed: "var(--sage-deep)",
  failed: "var(--destructive)",
}

export default function FieldPlot({
  statuses = [],
  className,
  cols = 4,
}) {
  // Pad to a full grid with empty plots so the map looks balanced.
  const total = Math.max(statuses.length, cols)
  const rows = Math.ceil(total / cols)
  const cells = []
  for (let i = 0; i < rows * cols; i++) {
    cells.push(statuses[i] || null)
  }

  return (
    <div
      className={cn(
        "grid gap-1 rounded-lg bg-soil/10 p-1.5 ring-1 ring-inset ring-soil/15",
        className
      )}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
      aria-hidden="true"
    >
      {cells.map((s, i) => (
        <div
          key={i}
          className={cn(
            "aspect-square rounded-[3px] transition-all duration-300",
            s ? "animate-in fade-in zoom-in-50" : ""
          )}
          style={{
            backgroundColor: s ? statusColor[s] : "color-mix(in oklch, var(--soil) 14%, transparent)",
            opacity: s ? 0.85 : 0.5,
            animationDelay: `${i * 25}ms`,
            animationFillMode: "both",
          }}
        />
      ))}
    </div>
  )
}
