import {
  IconBucketDroplet,
  IconCloudRain,
  IconDroplet,
  IconDroplets,
  IconFlask,
  IconGrain,
  IconPlant2,
  IconTemperature,
  IconWaveSawTool,
} from "@tabler/icons-react";

/**
 * Daily-log metadata — `log_type` is denormalised from the cycle's
 * zone type, so the form's section labels and the icons around each
 * metric all key off the same enum (`'hydro' | 'soil'`).
 *
 * The shared section ("Readings") carries the universal metrics
 * (pH / EC / PPM); the type-specific section carries the rest.
 */
export const LOG_TYPES = {
  hydro: {
    id: "hydro",
    label: "Hydroponic",
    tagline: "Reservoir, pH & EC checks",
    icon: IconWaveSawTool,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-lagoon to-lagoon-deep",
  },
  soil: {
    id: "soil",
    label: "Soil",
    tagline: "Moisture, temperature & weather",
    icon: IconPlant2,
    text: "text-leaf",
    bg: "bg-leaf/12",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
  },
};

export const LOG_TYPE_ORDER = ["hydro", "soil"];

export function getLogType(id) {
  return LOG_TYPES[id] || LOG_TYPES.hydro;
}

/**
 * Reservoir water level — enum from the DB CHECK
 * `dl_water_level_chk`. Renders in the hydro section.
 */
export const WATER_LEVEL_META = {
  full: {
    id: "full",
    label: "Full",
    description: "Reservoir at capacity.",
    icon: IconBucketDroplet,
    dot: "bg-emerald-500",
    chip:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  medium: {
    id: "medium",
    label: "Medium",
    description: "Half or so — top up soon.",
    icon: IconDroplet,
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  low: {
    id: "low",
    label: "Low",
    description: "Top up before next irrigation cycle.",
    icon: IconDroplet,
    dot: "bg-red-500",
    chip: "border-red-500/30 bg-red-500/12 text-red-600 dark:text-red-400",
  },
};

export const WATER_LEVEL_ORDER = ["full", "medium", "low"];

export function getWaterLevel(id) {
  return WATER_LEVEL_META[id] || null;
}

/** Universal metric labels — keys line up with the column names on
 *  `daily_logs` so the form and the card can both index by name. */
export const METRIC_META = {
  ph: {
    label: "pH",
    icon: IconDroplet,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
    decimals: 2,
    unit: "",
  },
  ec: {
    label: "EC",
    icon: IconFlask,
    text: "text-leaf",
    bg: "bg-leaf/12",
    decimals: 2,
    unit: "mS/cm",
  },
  ppm: {
    label: "PPM",
    icon: IconGrain,
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15",
    decimals: 0,
    unit: "ppm",
  },
  waterTempC: {
    label: "Water temp",
    icon: IconTemperature,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12",
    decimals: 1,
    unit: "°C",
  },
  airTempC: {
    label: "Air temp",
    icon: IconTemperature,
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15",
    decimals: 1,
    unit: "°C",
  },
  humidityPercent: {
    label: "Humidity",
    icon: IconDroplets,
    text: "text-sky-warm",
    bg: "bg-sky-warm/15",
    decimals: 1,
    unit: "%",
  },
  soilMoisture: {
    label: "Soil moisture",
    icon: IconPlant2,
    text: "text-leaf",
    bg: "bg-leaf/12",
    decimals: 2,
    unit: "% VWC",
  },
  rainfallMm: {
    label: "Rainfall",
    icon: IconCloudRain,
    text: "text-sky-warm",
    bg: "bg-sky-warm/15",
    decimals: 1,
    unit: "mm",
  },
};