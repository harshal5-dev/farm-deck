
import { useState, useRef, useCallback, useEffect } from "react";
import { navLinks } from "./constants";

const SECTION_IDS = navLinks.map((l) => l.id);

export function useActiveSection() {
  const [activeId, setActiveId] = useState(null);

  const ratios = useRef({});
  const recompute = useCallback(() => {
    let bestId = null;
    let bestRatio = 0;
    for (const id of SECTION_IDS) {
      const r = ratios.current[id] ?? 0;
      if (r > bestRatio) {
        bestRatio = r;
        bestId = id;
      }
    }
    setActiveId(bestId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }
        recompute();
      },
      {
        rootMargin: "-20% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [recompute]);

  return activeId;
}
