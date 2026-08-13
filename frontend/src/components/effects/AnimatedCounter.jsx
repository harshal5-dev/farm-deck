import { useEffect, useRef, useState } from "react"

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * AnimatedCounter — counts from 0 to `value` once it mounts (and re-runs if
 * `value` changes), using requestAnimationFrame with an ease-out curve.
 *
 * `format` is an optional function `(n) => string` applied to the displayed
 * value, e.g. for suffixes, decimals, or locale formatting.
 */
export default function AnimatedCounter({
  value,
  duration = 600,
  decimals = 0,
  format,
  className,
}) {
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const target = Number(value) || 0

    const animate = (ts) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOutCubic(progress)
      setDisplay(target * eased)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(target)
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rafRef.current)
      startRef.current = null
    }
  }, [value, duration])

  const rendered = format ? format(display) : display.toFixed(decimals)

  return <span className={className}>{rendered}</span>
}
