import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Reveal — fades + slides its children in on mount (and whenever `changeKey`
 * changes) using tw-animate-css utilities. Use `delay` (ms) to stagger items.
 *
 * It re-runs the entrance whenever `changeKey` changes, which lets us animate
 * lists/views back in when a filter or tab switches. Each child in a list can
 * pass an incrementing delay for a nice cascade.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 500,
  as: Tag = "div",
  changeKey,
  ...props
}) {
  const [shown, setShown] = useState(false)
  const firstRun = useRef(true)

  useEffect(() => {
    // Re-run the entrance animation on every changeKey change.
    if (!firstRun.current) {
      setShown(false)
    }
    firstRun.current = false

    const t = setTimeout(() => setShown(true), 16)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeKey])

  return (
    <Tag
      className={cn(
        "transition-all ease-out will-change-transform",
        shown
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-3 opacity-0 blur-[2px]",
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
