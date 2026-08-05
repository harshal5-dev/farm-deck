export const SoilTypeLevelStyles = {
  low: { color: "bg-clay", text: "text-clay", pct: 33 },
  "low-medium": { color: "bg-amber-400", text: "text-amber-600 dark:text-amber-400", pct: 42 },
  medium: { color: "bg-wheat", text: "text-wheat", pct: 66 },
  moderate: { color: "bg-wheat", text: "text-wheat", pct: 55 },
  "medium-high": { color: "bg-leaf/60", text: "text-leaf", pct: 80 },
  high: { color: "bg-leaf", text: "text-leaf", pct: 100 },
  poor: { color: "bg-clay", text: "text-clay", pct: 25 },
  good: { color: "bg-leaf", text: "text-leaf", pct: 75 },
  excellent: { color: "bg-leaf", text: "text-leaf", pct: 100 },
};

export const soilTypeMeta = {
  loamy: {
    gradient: "from-leaf/25 via-leaf/10 to-transparent",
    bg: "bg-leaf/15",
    text: "text-leaf",
  },
  sandy: {
    gradient: "from-amber-500/25 via-amber-400/10 to-transparent",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
  },
  sandy_loam: {
    gradient: "from-wheat/25 via-wheat/10 to-transparent",
    bg: "bg-wheat/15",
    text: "text-wheat",
  },
  clay: {
    gradient: "from-clay/25 via-clay/10 to-transparent",
    bg: "bg-clay/15",
    text: "text-clay",
  },
  clay_loam: {
    gradient: "from-rose-500/20 via-rose-400/8 to-transparent",
    bg: "bg-rose-500/10",
    text: "text-rose-600 dark:text-rose-400",
  },
  silt: {
    gradient: "from-sky-500/20 via-sky-400/8 to-transparent",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
  },
  chalky: {
    gradient: "from-stone-400/25 via-stone-300/10 to-transparent",
    bg: "bg-stone-400/15",
    text: "text-stone-600 dark:text-stone-400",
  },
  peaty: {
    gradient: "from-soil/30 via-clay-deep/10 to-transparent",
    bg: "bg-soil/15",
    text: "text-clay-deep dark:text-clay",
  },
};
