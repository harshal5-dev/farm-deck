import {
  IconAlertTriangle,
  IconApple,
  IconBan,
  IconBasket,
  IconCalendarEvent,
  IconCarrot,
  IconCherry,
  IconCircleCheck,
  IconFlame,
  IconGrain,
  IconLeaf,
  IconMushroom,
  IconPlant,
  IconPlant2,
  IconSalad,
  IconSeedling,
  IconSun,
} from "@tabler/icons-react";

/**
 * Crop-catalog visual metadata — keyed by `category` from the `crops`
 * table (DB schema enum: 'leafy_green' | 'herb' | 'fruiting' |
 * 'microgreen' | 'root' | 'other'). The `name` field is the crop
 * cultivar itself (e.g. "Genovese Basil"), so a single CROP_TYPES
 * entry covers a whole family of crops; pickers and cards all read
 * from here.
 */
export const CROP_TYPES = {
  leafy_green: {
    id: "leafy_green",
    label: "Leafy green",
    tagline: "Heads, cuts & baby greens",
    description:
      "Fast-turnover leafy crops — hydroponic rafts or field rows, harvested by the head or by the leaf.",
    icon: IconSalad,
    text: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
    chip: "from-leaf/20 to-leaf/5 text-leaf ring-leaf/25",
  },
  herb: {
    id: "herb",
    label: "Herb",
    tagline: "Aromatic culinary herbs",
    description:
      "Pinched and bunched — basil, mint, chives. Restaurant premiums on a steady cut cadence.",
    icon: IconPlant,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12 dark:bg-lagoon/15",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-lagoon to-lagoon-deep",
    chip: "from-lagoon/20 to-lagoon/5 text-lagoon-deep dark:text-lagoon ring-lagoon/25",
  },
  fruiting: {
    id: "fruiting",
    label: "Fruiting",
    tagline: "Trellised vines & bushes",
    description:
      "Staked or trellised fruiting crops — tomatoes, peppers, cucumbers, berries. Long season, high value.",
    icon: IconCherry,
    text: "text-clay-deep dark:text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-clay to-clay-deep",
    chip: "from-clay/20 to-clay/5 text-clay-deep dark:text-clay ring-clay/25",
  },
  microgreen: {
    id: "microgreen",
    label: "Microgreen",
    tagline: "10-day trays",
    description:
      "Tray-grown shoots — the fastest cash crop. Dense seeding, cut at cotyledon.",
    icon: IconSeedling,
    text: "text-leaf",
    bg: "bg-leaf/10 dark:bg-leaf/12",
    bgSoft: "bg-leaf/6",
    ring: "ring-leaf/30",
    border: "border-leaf/25",
    gradient: "from-sage to-leaf",
    chip: "from-sage/20 to-leaf/5 text-leaf ring-leaf/20",
  },
  root: {
    id: "root",
    label: "Root",
    tagline: "Direct-sown roots",
    description:
      "Below-ground harvests — carrots, beets, radishes, turnips. Loose soil, steady water.",
    icon: IconCarrot,
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15 dark:bg-wheat/15",
    bgSoft: "bg-wheat/10",
    ring: "ring-wheat/40",
    border: "border-wheat/30",
    gradient: "from-wheat-deep to-clay",
    chip: "from-wheat/25 to-clay/5 text-wheat-deep dark:text-wheat ring-wheat/25",
  },
  other: {
    id: "other",
    label: "Specialty",
    tagline: "Orchards, fungi & niche",
    description:
      "Permanent blocks, mushrooms and other long-cycle crops — managed by season, not by tray.",
    icon: IconMushroom,
    text: "text-sage-deep dark:text-sage",
    bg: "bg-sage/12 dark:bg-sage/15",
    bgSoft: "bg-sage/8",
    ring: "ring-sage/40",
    border: "border-sage/30",
    gradient: "from-sage-deep to-leaf",
    chip: "from-sage/20 to-sage-deep/5 text-sage-deep dark:text-sage ring-sage/25",
  },
};

/** Catalog category ordering used by chips, pickers and counts. */
export const CROP_TYPE_ORDER = [
  "leafy_green",
  "herb",
  "fruiting",
  "microgreen",
  "root",
  "other",
];

export function getCropType(id) {
  return CROP_TYPES[id] || CROP_TYPES.other;
}

/**
 * Cycle lifecycle — the rich status lives on the planting cycle, not
 * on the zone. Mirrors the `cycles.status` CHECK constraint:
 *
 *   planned → seeding → growing → flowering → harvested → completed
 *      ↘ cancelled                ↘ failed
 *
 * `harvested` is the operator-confirmed pick date; `completed` is
 * when the cycle is closed out (yield logs, residue cleared). For
 * short-cycle crops they're effectively the same day; long crops
 * (orchards) may sit in `harvested` across multiple picks before
 * closing.
 */
export const CROP_STATUS_META = {
  planned: {
    id: "planned",
    label: "Planned",
    group: "active",
    description: "Future cycle — sow date hasn't arrived.",
    icon: IconCalendarEvent,
    dot: "bg-sky-500",
    chip: "border-sky-500/30 bg-sky-500/12 text-sky-700 dark:text-sky-400",
  },
  seeding: {
    id: "seeding",
    label: "Seeding",
    group: "active",
    description: "Seeds in, transplants placed.",
    icon: IconSeedling,
    dot: "bg-lagoon",
    chip:
      "border-lagoon/30 bg-lagoon/12 text-lagoon-deep dark:text-lagoon",
  },
  growing: {
    id: "growing",
    label: "Growing",
    group: "active",
    description: "Established and developing.",
    icon: IconPlant2,
    dot: "bg-leaf",
    chip: "border-leaf/30 bg-leaf/12 text-leaf",
  },
  flowering: {
    id: "flowering",
    label: "Flowering",
    group: "active",
    description: "Blooms open — pollination window.",
    icon: IconSun,
    dot: "bg-wheat",
    chip: "border-wheat/30 bg-wheat/15 text-wheat-deep dark:text-wheat",
  },
  harvested: {
    id: "harvested",
    label: "Harvested",
    group: "active",
    description: "Crop picked — yield log pending.",
    icon: IconBasket,
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  completed: {
    id: "completed",
    label: "Completed",
    group: "done",
    description: "Cycle closed out — yields recorded, residue cleared.",
    icon: IconCircleCheck,
    dot: "bg-emerald-500",
    chip:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  failed: {
    id: "failed",
    label: "Failed",
    group: "done",
    description: "Lost to pests, disease or weather.",
    icon: IconAlertTriangle,
    dot: "bg-red-500",
    chip: "border-red-500/30 bg-red-500/12 text-red-600 dark:text-red-400",
  },
  cancelled: {
    id: "cancelled",
    label: "Cancelled",
    group: "done",
    description: "Never happened — kept for the record.",
    icon: IconBan,
    dot: "bg-muted-foreground/50",
    chip: "border-border/60 bg-muted/40 text-muted-foreground",
  },
};

export const CROP_STATUS_ORDER = [
  "planned",
  "seeding",
  "growing",
  "flowering",
  "harvested",
  "completed",
  "failed",
  "cancelled",
];

export function getCropStatus(id) {
  return CROP_STATUS_META[id] || CROP_STATUS_META.planned;
}

/** List-filter buckets shown in the header segment. */
export const CROP_STATUS_FILTERS = [
  { id: "all", label: "All", statuses: CROP_STATUS_ORDER },
  {
    id: "active",
    label: "Active",
    statuses: ["planned", "seeding", "growing", "flowering", "harvested"],
  },
  {
    id: "flowering",
    label: "Flowering",
    statuses: ["flowering"],
  },
  { id: "ready", label: "Ready", statuses: ["harvested"] },
  {
    id: "done",
    label: "Closed",
    statuses: ["completed", "failed", "cancelled"],
  },
];

/**
 * The happy-path advance from each non-terminal status. Quick actions
 * on the card read from here; the edit form allows any status.
 */
export const CROP_NEXT_ACTION = {
  planned: { to: "seeding", label: "Start seeding", icon: IconSeedling },
  seeding: { to: "growing", label: "Mark growing", icon: IconPlant2 },
  growing: { to: "flowering", label: "Mark flowering", icon: IconSun },
  flowering: {
    to: "harvested",
    label: "Mark harvested",
    icon: IconBasket,
  },
  harvested: {
    to: "completed",
    label: "Close cycle",
    icon: IconCircleCheck,
  },
};

/**
 * Growth-stage metadata — the fine-grained stage tracked per cycle
 * alongside `status`. Mirrors the `cycles.growth_stage` CHECK
 * constraint:
 *
 *   seedling → vegetative → flowering → fruiting → harvest
 *
 * A cycle's growth_stage can move faster or slower than the coarse
 * status (e.g. status=growing while stage=flowering during a heat
 * wave) — the form lets you set both.
 */
export const GROWTH_STAGE_META = {
  seedling: {
    id: "seedling",
    label: "Seedling",
    description: "Cotyledons out, true leaves forming.",
    icon: IconSeedling,
    dot: "bg-lagoon",
    chip:
      "border-lagoon/30 bg-lagoon/12 text-lagoon-deep dark:text-lagoon",
  },
  vegetative: {
    id: "vegetative",
    label: "Vegetative",
    description: "Leaf and root mass building.",
    icon: IconLeaf,
    dot: "bg-leaf",
    chip: "border-leaf/30 bg-leaf/12 text-leaf",
  },
  flowering: {
    id: "flowering",
    label: "Flowering",
    description: "Blooms setting.",
    icon: IconSun,
    dot: "bg-wheat",
    chip: "border-wheat/30 bg-wheat/15 text-wheat-deep dark:text-wheat",
  },
  fruiting: {
    id: "fruiting",
    label: "Fruiting",
    description: "Fruit set and fill.",
    icon: IconCherry,
    dot: "bg-clay-deep",
    chip: "border-clay/30 bg-clay/12 text-clay-deep dark:text-clay",
  },
  harvest: {
    id: "harvest",
    label: "Harvest",
    description: "Ready to pick.",
    icon: IconBasket,
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
};

export const GROWTH_STAGE_ORDER = [
  "seedling",
  "vegetative",
  "flowering",
  "fruiting",
  "harvest",
];

export function getGrowthStage(id) {
  return GROWTH_STAGE_META[id] || GROWTH_STAGE_META.seedling;
}

/**
 * Display icon set for catalog thumbnails — reuses Tabler icons the
 * rest of the app already pulls. Picking the icon here keeps the
 * catalog cards visually distinct from CROP_TYPES (which key off
 * the family of the crop, not the cultivar).
 */
export const CROP_VARIETY_ICONS = [
  IconCherry,
  IconApple,
  IconLeaf,
  IconPlant,
  IconCarrot,
  IconSalad,
  IconSeedling,
  IconMushroom,
  IconFlame,
  IconGrain,
];