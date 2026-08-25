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
  IconGrape,
  IconMushroom,
  IconPlant,
  IconPlant2,
  IconSalad,
  IconSeedling,
} from "@tabler/icons-react";

/**
 * Crop-type config — visual metadata keyed by the lookup `name`
 * (mirrors a future `crop_types` table). Same structure as
 * FARM_TYPES / ZONE_TYPES so cards, chips, pickers and pills all read
 * from one place.
 *
 * `category` picks the CropTypeArt scene (one illustration per plant
 * family rather than per crop — 6 scenes cover the catalog).
 */
export const CROP_TYPES = {
  tomato: {
    id: "tomato",
    label: "Tomato",
    category: "fruiting",
    tagline: "Fruiting vine",
    description: "Staked or trellised fruiting crop — high-value greenhouse staple.",
    icon: IconCherry,
    text: "text-clay-deep dark:text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-clay to-clay-deep",
    chip: "from-clay/20 to-clay/5 text-clay-deep dark:text-clay ring-clay/25",
  },
  lettuce: {
    id: "lettuce",
    label: "Lettuce",
    category: "leafy",
    tagline: "Leafy greens",
    description: "Fast leafy greens — heads or cuts, ideal for hydro rafts.",
    icon: IconSalad,
    text: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
    chip: "from-leaf/20 to-leaf/5 text-leaf ring-leaf/25",
  },
  basil: {
    id: "basil",
    label: "Basil",
    category: "herb",
    tagline: "Culinary herb",
    description: "Aromatic herbs — pinch harvests, restaurant-ready premiums.",
    icon: IconPlant,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12 dark:bg-lagoon/15",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-lagoon to-lagoon-deep",
    chip: "from-lagoon/20 to-lagoon/5 text-lagoon-deep dark:text-lagoon ring-lagoon/25",
  },
  bell_pepper: {
    id: "bell_pepper",
    label: "Bell pepper",
    category: "fruiting",
    tagline: "Fruiting block",
    description: "Coloured block peppers on the high-wire — long season crop.",
    icon: IconFlame,
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15 dark:bg-wheat/15",
    bgSoft: "bg-wheat/10",
    ring: "ring-wheat/40",
    border: "border-wheat/30",
    gradient: "from-wheat to-clay-deep",
    chip: "from-wheat/25 to-wheat/5 text-wheat-deep dark:text-wheat ring-wheat/25",
  },
  carrot: {
    id: "carrot",
    label: "Carrot",
    category: "root",
    tagline: "Root vegetable",
    description: "Direct-sown roots — loose soil, steady water, sweet harvest.",
    icon: IconCarrot,
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15 dark:bg-wheat/15",
    bgSoft: "bg-wheat/10",
    ring: "ring-wheat/40",
    border: "border-wheat/30",
    gradient: "from-wheat-deep to-clay",
    chip: "from-wheat/25 to-clay/5 text-wheat-deep dark:text-wheat ring-wheat/25",
  },
  apple: {
    id: "apple",
    label: "Apple",
    category: "fruiting",
    tagline: "Orchard tree",
    description: "Permanent orchard blocks — blossoms, thinning, then bins.",
    icon: IconApple,
    text: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-wheat-deep",
    chip: "from-leaf/20 to-wheat/5 text-leaf ring-leaf/25",
  },
  berries: {
    id: "berries",
    label: "Berries",
    category: "vine",
    tagline: "Trellised canes",
    description: "Trailing canes on trellises — u-pick and fresh market.",
    icon: IconGrape,
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12 dark:bg-lagoon/15",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-sky-warm to-lagoon-deep",
    chip: "from-sky-warm/20 to-lagoon/5 text-lagoon-deep dark:text-lagoon ring-lagoon/25",
  },
  mushroom: {
    id: "mushroom",
    label: "Mushroom",
    category: "fungi",
    tagline: "Gourmet fungi",
    description: "Oyster, lion's mane, shiitake — humidity and CO₂ managed.",
    icon: IconMushroom,
    text: "text-clay-deep dark:text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-clay to-wheat-deep",
    chip: "from-clay/25 to-clay/5 text-clay-deep dark:text-clay ring-clay/30",
  },
  microgreens: {
    id: "microgreens",
    label: "Microgreens",
    category: "leafy",
    tagline: "10-day turn",
    description: "Tray-grown shoots — the fastest cash crop in the book.",
    icon: IconSeedling,
    text: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-sage to-leaf",
    chip: "from-sage/20 to-leaf/5 text-leaf ring-leaf/25",
  },
};

export const CROP_TYPE_ORDER = [
  "tomato",
  "lettuce",
  "basil",
  "bell_pepper",
  "carrot",
  "apple",
  "berries",
  "mushroom",
  "microgreens",
];

export function getCropType(id) {
  return CROP_TYPES[id] || CROP_TYPES.tomato;
}

/**
 * Crop lifecycle — the rich status lives HERE (on the planting/crop
 * cycle), not on the zone. Terminal rows are kept as history.
 *
 *   planned → sown → growing → harvest_ready → harvested
 *      ↘ cancelled              ↘ failed
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
  sown: {
    id: "sown",
    label: "Sown",
    group: "active",
    description: "Seeds in, transplants placed.",
    icon: IconGrain,
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
  harvest_ready: {
    id: "harvest_ready",
    label: "Ready",
    group: "active",
    description: "Mature — waiting on the picking crew.",
    icon: IconBasket,
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  harvested: {
    id: "harvested",
    label: "Harvested",
    group: "done",
    description: "Cycle complete — yields recorded.",
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
  "sown",
  "growing",
  "harvest_ready",
  "harvested",
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
    label: "Growing",
    statuses: ["planned", "sown", "growing", "harvest_ready"],
  },
  { id: "ready", label: "Ready", statuses: ["harvest_ready"] },
  { id: "done", label: "Done", statuses: ["harvested", "failed", "cancelled"] },
];

/**
 * The happy-path advance from each non-terminal status. Quick actions
 * on the card read from here; the edit form allows any status.
 */
export const CROP_NEXT_ACTION = {
  planned: { to: "sown", label: "Mark sown", icon: IconGrain },
  sown: { to: "growing", label: "Mark growing", icon: IconPlant2 },
  growing: {
    to: "harvest_ready",
    label: "Mark ready",
    icon: IconBasket,
  },
  harvest_ready: {
    to: "harvested",
    label: "Complete harvest",
    icon: IconCircleCheck,
  },
};

/**
 * Quantity units for what was planted — free-form column on the
 * backend, suggested here.
 */
export const QUANTITY_UNITS = [
  { id: "plants", label: "plants" },
  { id: "trays", label: "trays" },
  { id: "seeds", label: "seeds" },
  { id: "sq_m", label: "m²" },
  { id: "rows", label: "rows" },
  { id: "acres", label: "acres" },
];

export function getQuantityUnit(id) {
  return QUANTITY_UNITS.find((u) => u.id === id) || QUANTITY_UNITS[0];
}
