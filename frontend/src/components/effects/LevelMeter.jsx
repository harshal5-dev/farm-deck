import { cn } from "@/lib/utils"

const levelStyles = {
  low: { color: "bg-leaf", text: "text-leaf", pct: 33 },
  medium: { color: "bg-wheat", text: "text-wheat", pct: 66 },
  moderate: { color: "bg-wheat", text: "text-wheat", pct: 55 },
  high: { color: "bg-clay", text: "text-clay", pct: 90 },
  very_high: { color: "bg-red-500", text: "text-red-500", pct: 100 },
  poor: { color: "bg-clay", text: "text-clay", pct: 25 },
  good: { color: "bg-leaf", text: "text-leaf", pct: 75 },
  excellent: { color: "bg-leaf", text: "text-leaf", pct: 100 },
  beginner: { color: "bg-leaf", text: "text-leaf", pct: 25 },
  intermediate: { color: "bg-wheat", text: "text-wheat", pct: 60 },
  advanced: { color: "bg-clay", text: "text-clay", pct: 100 },
}

/** Map a level word to {color, text, pct}. */
export function levelMeta(value) {
  if (!value) return levelStyles.medium
  return levelStyles[value.toLowerCase()] || levelStyles.medium
}

/**
 * LevelMeter — small labeled bar for low/medium/high-style values.
 * `raw` keeps the original DB value (e.g. "very_high") but displays a friendlier label.
 */
export default function LevelMeter({ label, value, icon: Icon, display }) {
  const style = levelMeta(value)
  return (
    <div className="rounded-lg bg-muted/40 p-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {Icon && <Icon className="size-3" strokeWidth={2} />}
        {label}
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full", style.color)} style={{ width: `${style.pct}%` }} />
        </div>
        <span className={cn("text-[11px] font-bold capitalize", style.text)}>
          {display || prettify(value)}
        </span>
      </div>
    </div>
  )
}

function prettify(v) {
  if (!v) return ""
  return String(v).replace(/_/g, " ")
}
