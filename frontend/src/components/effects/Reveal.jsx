import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

/**
 * Reveal — fades + slides its children in. Two modes:
 *
 *  - `trigger="mount"` (default): plays once on mount (and re-plays when
 *    `changeKey` changes). Good for content already in view on load.
 *  - `trigger="scroll"`: stays hidden until scrolled into view, using an
 *    IntersectionObserver. Good for long pages with sections far down.
 *
 * Use `delay` (ms) to stagger items in a list for a nice cascade.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 350,
  as: Tag = "div",
  changeKey,
  trigger = "mount",
  threshold = 0.15,
  once = true,
  ...props
}) {
  const [shown, setShown] = useState(false)
  const firstRun = useRef(true)
  const ref = useRef(null)

  // Scroll mode: observe and reveal when the element enters the viewport.
  useEffect(() => {
    if (trigger !== "scroll") return
    const node = ref.current
    if (!node) return

    // Fallback: if IntersectionObserver isn't available, just show it.
    if (typeof IntersectionObserver === "undefined") {
      setShown(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          if (once) observer.unobserve(node)
        } else if (!once) {
          setShown(false)
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [trigger, threshold, once])

  // Mount mode: play on mount + whenever changeKey changes.
  useEffect(() => {
    if (trigger !== "mount") return
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
      ref={trigger === "scroll" ? ref : undefined}
      className={cn(
        "transition-all ease-out will-change-transform",
        shown
          ? "translate-y-0 opacity-100 blur-0"
          : "translate-y-2 opacity-0 blur-[1px]",
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
