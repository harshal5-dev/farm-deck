import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * AnimatedNumber — count up to a target value when scrolled into view.
 * Used for stat counters on the home page.
 */
const AnimatedNumber = ({
  value,
  suffix = "",
  prefix = "",
  duration = 800,
  className,
}) => {
  const supportsObserver =
    typeof IntersectionObserver !== "undefined";
  const [display, setDisplay] = useState(supportsObserver ? 0 : value);
  const ref = useRef(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!supportsObserver) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        const start = performance.now();
        const easeOut = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const t = Math.min(1, (now - start) / duration);
          setDisplay(Math.round(value * easeOut(t)));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, duration, supportsObserver]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default AnimatedNumber;
