import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * AnimatedBar — a progress bar whose fill grows from 0 to `pct` after mount.
 * Re-runs whenever `pct` changes (e.g. when a filter changes the data).
 */
export default function AnimatedBar({ pct, color, className, trackClassName }) {
  const [width, setWidth] = useState(0)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      // Grow from 0 on first paint.
      const t = requestAnimationFrame(() => setWidth(pct))
      mounted.current = true
      return () => cancelAnimationFrame(t)
    }
    setWidth(pct)
  }, [pct])

  return (
    <div
      className={cn(
        "relative h-1.5 w-full overflow-hidden rounded-full bg-muted",
        trackClassName
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out",
          color
        )}
        style={{ width: `${Math.min(Math.max(width, 0), 100)}%` }}
      />
    </div>
  )
}
