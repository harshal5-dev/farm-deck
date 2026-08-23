import {
  IconBuildingWarehouse,
  IconLeaf,
  IconPlant2,
  IconSun,
  IconBuildingCommunity,
} from "@tabler/icons-react";

/**
 * Farm-type config — single source of truth for the five farm types.
 * Mirrors the structure of `./roles.js` so farm cards, filter chips,
 * type pickers, and dialogs all read from the same place.
 *
 * Each farm type gets:
 *  - a Tabler icon
 *  - a Tailwind palette (text/bg/ring/border + gradient)
 *  - a one-line description for tooltips / dialogs
 *  - the FarmTypeArt variant used as the hero illustration
 *  - a friendly "tagline" used on the picker cards
 */
export const FARM_TYPES = {
  outdoor: {
    id: "outdoor",
    label: "Outdoor",
    tagline: "Open-field cultivation",
    description:
      "Traditional fields under the open sky — sun-grown row crops, orchards, and pasture.",
    icon: IconSun,
    art: "outdoor",
    accent: "leaf",
    text: "text-leaf",
    textBright: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
    chip: "from-leaf/20 to-leaf/5 text-leaf ring-leaf/25",
  },
  greenhouse: {
    id: "greenhouse",
    label: "Greenhouse",
    tagline: "Polytunnel & glasshouse",
    description:
      "Covered structures that extend the season and protect crops from weather extremes.",
    icon: IconBuildingCommunity,
    art: "greenhouse",
    accent: "sky",
    text: "text-sky-warm",
    textBright: "text-sky-warm",
    bg: "bg-sky-warm/12 dark:bg-sky-warm/15",
    bgSoft: "bg-sky-warm/8",
    ring: "ring-sky-warm/40",
    border: "border-sky-warm/30",
    gradient: "from-sky-warm to-sky-warm",
    chip: "from-sky-warm/20 to-sky-warm/5 text-sky-warm ring-sky-warm/25",
  },
  mixed: {
    id: "mixed",
    label: "Mixed",
    tagline: "Indoor + outdoor combo",
    description:
      "A blend of indoor propagation and outdoor finishing — best of both environments.",
    icon: IconPlant2,
    art: "mixed",
    accent: "lagoon",
    text: "text-lagoon-deep dark:text-lagoon",
    textBright: "text-lagoon-deep",
    bg: "bg-lagoon/12 dark:bg-lagoon/15",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-lagoon to-lagoon-deep",
    chip: "from-lagoon/20 to-lagoon/5 text-lagoon-deep dark:text-lagoon ring-lagoon/25",
  },
  indoor: {
    id: "indoor",
    label: "Indoor",
    tagline: "Climate-controlled rooms",
    description:
      "Fully enclosed grow rooms with LED lighting and tight environmental control.",
    icon: IconBuildingWarehouse,
    art: "indoor",
    accent: "wheat",
    text: "text-wheat-deep dark:text-wheat",
    textBright: "text-wheat-deep",
    bg: "bg-wheat/15 dark:bg-wheat/15",
    bgSoft: "bg-wheat/10",
    ring: "ring-wheat/40",
    border: "border-wheat/30",
    gradient: "from-wheat to-wheat-deep",
    chip: "from-wheat/25 to-wheat/5 text-wheat-deep dark:text-wheat ring-wheat/25",
  },
  vertical: {
    id: "vertical",
    label: "Vertical",
    tagline: "Stacked tiers",
    description:
      "Multi-tier vertical farms that maximize yield per square foot in tight footprints.",
    icon: IconLeaf,
    art: "vertical",
    accent: "clay",
    text: "text-clay-deep dark:text-clay",
    textBright: "text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-clay via-clay-deep to-clay",
    chip: "from-clay/25 to-clay/5 text-clay-deep dark:text-clay ring-clay/30",
  },
};

/**
 * Order the farm-type chips appear in: filter chips, form picker, etc.
 * Outdoor first because it's the most common in the demo data.
 */
export const FARM_TYPE_ORDER = [
  "outdoor",
  "greenhouse",
  "mixed",
  "indoor",
  "vertical",
];

export function getFarmType(id) {
  return FARM_TYPES[id] || FARM_TYPES.outdoor;
}

/**
 * Soil-type config — paired with SoilTypeArt variants so cards and pickers
 * stay in lockstep with the home-page illustrations.
 */
export const SOIL_TYPES = {
  loam: {
    id: "loam",
    label: "Loam",
    art: "loam",
    description: "Balanced mix — the gold standard for most crops.",
  },
  sandy_loam: {
    id: "sandy_loam",
    label: "Sandy loam",
    art: "sandy_loam",
    description: "Drains well, easy to work — great for root vegetables.",
  },
  sandy: {
    id: "sandy",
    label: "Sandy",
    art: "sandy",
    description: "Fast-draining, gritty, warms early in spring.",
  },
  clay_loam: {
    id: "clay_loam",
    label: "Clay loam",
    art: "clay_loam",
    description: "Rich in nutrients, holds moisture longer.",
  },
  clay: {
    id: "clay",
    label: "Clay",
    art: "clay",
    description: "Heavy, slow-draining, nutrient-dense.",
  },
  silt: {
    id: "silt",
    label: "Silt",
    art: "silt",
    description: "Smooth and fertile, holds moisture well.",
  },
  chalky: {
    id: "chalky",
    label: "Chalky",
    art: "chalky",
    description: "Alkaline and free-draining — lime-rich.",
  },
  peaty: {
    id: "peaty",
    label: "Peaty",
    art: "peaty",
    description: "Acidic, dark, and rich in organic matter.",
  },
};

export const SOIL_TYPE_ORDER = [
  "loam",
  "sandy_loam",
  "clay_loam",
  "sandy",
  "clay",
  "silt",
  "chalky",
  "peaty",
];

export function getSoilType(id) {
  return SOIL_TYPES[id] || SOIL_TYPES.loam;
}

/**
 * Area units — matches `farms.area_unit VARCHAR(20) NOT NULL DEFAULT 'sq_m'`.
 * Every id is ≤ 20 chars (the column limit). `factor` converts to square
 * metres for future normalisation (sorting, totals, unit switching).
 */
export const AREA_UNITS = {
  sq_m: { id: "sq_m", label: "m²", longLabel: "square metres", factor: 1 },
  hectare: { id: "hectare", label: "ha", longLabel: "hectares", factor: 10000 },
  acre: { id: "acre", label: "ac", longLabel: "acres", factor: 4046.8564224 },
  sq_km: {
    id: "sq_km",
    label: "km²",
    longLabel: "square kilometres",
    factor: 1000000,
  },
  sq_ft: {
    id: "sq_ft",
    label: "ft²",
    longLabel: "square feet",
    factor: 0.09290304,
  },
  sq_yd: {
    id: "sq_yd",
    label: "yd²",
    longLabel: "square yards",
    factor: 0.83612736,
  },
};

export const AREA_UNIT_ORDER = [
  "sq_m",
  "hectare",
  "acre",
  "sq_km",
  "sq_ft",
  "sq_yd",
];

export const DEFAULT_AREA_UNIT = "sq_m";

export function getAreaUnit(id) {
  return AREA_UNITS[id] || AREA_UNITS[DEFAULT_AREA_UNIT];
}

/**
 * Resolve an `areaUnit` string to its short label ("12.5 ac"). The column
 * is free-form VARCHAR(50), so values may arrive as "acres", "acre", or
 * one of the AREA_UNITS ids — normalise case and trailing plurals before
 * giving up and echoing the raw string.
 */
export function getAreaUnitLabel(unit) {
  if (!unit) return "";
  const key = String(unit).trim().toLowerCase();
  const direct =
    AREA_UNITS[key] || AREA_UNITS[key.replace(/\s+/g, "_")] ||
    AREA_UNITS[key.replace(/s$/, "")];
  return direct?.label ?? String(unit);
}

/** Square-metre conversion factor for an `areaUnit` string (1 when unknown). */
export function getAreaUnitFactor(unit) {
  if (!unit) return 1;
  const key = String(unit).trim().toLowerCase();
  const direct =
    AREA_UNITS[key] || AREA_UNITS[key.replace(/\s+/g, "_")] ||
    AREA_UNITS[key.replace(/s$/, "")];
  return direct?.factor ?? 1;
}

/**
 * Farm status — derived from the API's `isActive` boolean. Used for
 * filter segments and pills.
 */
export const FARM_STATUS_META = {
  active: {
    id: "active",
    label: "Active",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    chip:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  inactive: {
    id: "inactive",
    label: "Inactive",
    dot: "bg-muted-foreground/50",
    text: "text-muted-foreground",
    chip: "border-border/60 bg-muted/40 text-muted-foreground",
  },
};

export const FARM_STATUS_ORDER = ["active", "inactive"];

export function getFarmStatus(id) {
  return FARM_STATUS_META[id] || FARM_STATUS_META.active;
}
