import {
  IconDroplets,
  IconFish,
  IconMushroom,
  IconSeedling,
} from "@tabler/icons-react";

/**
 * Zone-type config — visual metadata keyed by the lookup `name`
 * (mirrors `zone_types.name` from the schema). Same structure as
 * FARM_TYPES in `@/constants/farms` so cards, chips, pickers and
 * pills all read from one place.
 *
 * `cultivationMode` mirrors `zone_types.cultivation_mode`
 * ('soil' | 'hydro' | 'other') — it decides which detail section the
 * form shows (zone_soil_details vs zone_hydro_details) and which
 * hero treatment the card uses.
 */
export const ZONE_TYPES = {
  soil: {
    id: "soil",
    label: "Soil plot",
    cultivationMode: "soil",
    tagline: "Beds & open ground",
    description:
      "Plants grown in soil — open ground, raised beds, or containers. You manage the soil.",
    icon: IconSeedling,
    art: "soil",
    text: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
    chip: "from-leaf/20 to-leaf/5 text-leaf ring-leaf/25",
  },
  hydro: {
    id: "hydro",
    label: "Hydroponic system",
    cultivationMode: "hydro",
    tagline: "Soil-less, nutrient water",
    description:
      "Roots fed by a nutrient solution — NFT channels, DWC rafts, drip lines. You manage the water.",
    icon: IconDroplets,
    art: "hydro",
    text: "text-lagoon-deep dark:text-lagoon",
    bg: "bg-lagoon/12 dark:bg-lagoon/15",
    bgSoft: "bg-lagoon/8",
    ring: "ring-lagoon/40",
    border: "border-lagoon/30",
    gradient: "from-lagoon to-lagoon-deep",
    chip: "from-lagoon/20 to-lagoon/5 text-lagoon-deep dark:text-lagoon ring-lagoon/25",
  },
  aquaponic: {
    id: "aquaponic",
    label: "Aquaponic",
    cultivationMode: "other",
    tagline: "Fish + plants loop",
    description:
      "Hydroponics married to fish — fish waste feeds the plants, plants clean the water back.",
    icon: IconFish,
    art: "aquaponic",
    text: "text-sky-warm",
    bg: "bg-sky-warm/12 dark:bg-sky-warm/15",
    bgSoft: "bg-sky-warm/8",
    ring: "ring-sky-warm/40",
    border: "border-sky-warm/30",
    gradient: "from-sky-warm to-lagoon",
    chip: "from-sky-warm/20 to-sky-warm/5 text-sky-warm ring-sky-warm/25",
  },
  mushroom: {
    id: "mushroom",
    label: "Mushroom room",
    cultivationMode: "other",
    tagline: "Fungi, humidity & CO₂",
    description:
      "Climate-controlled darkness for fungi — managed by humidity and CO₂, not light.",
    icon: IconMushroom,
    art: "mushroom",
    text: "text-wheat-deep dark:text-wheat",
    bg: "bg-wheat/15 dark:bg-wheat/15",
    bgSoft: "bg-wheat/10",
    ring: "ring-wheat/40",
    border: "border-wheat/30",
    gradient: "from-clay to-wheat-deep",
    chip: "from-clay/25 to-clay/5 text-clay-deep dark:text-clay ring-clay/30",
  },
};

export const ZONE_TYPE_ORDER = ["soil", "hydro", "aquaponic", "mushroom"];

export function getZoneType(id) {
  return ZONE_TYPES[id] || ZONE_TYPES.soil;
}

/**
 * Zone status — the coarse *container* state from `zones.zone_status`
 * ('idle' | 'preparing' | 'maintenance'). The rich crop lifecycle
 * (growing, harvest…) belongs to future plantings, not the zone.
 */
export const ZONE_STATUS_META = {
  idle: {
    id: "idle",
    label: "Idle",
    description: "Empty and ready for the next cycle.",
    dot: "bg-muted-foreground/50",
    chip: "border-border/60 bg-muted/40 text-muted-foreground",
  },
  preparing: {
    id: "preparing",
    label: "Preparing",
    description: "Getting ready — amending soil, cleaning the system.",
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  maintenance: {
    id: "maintenance",
    label: "Maintenance",
    description: "Out of commission — repairs or treatment.",
    dot: "bg-red-500",
    chip: "border-red-500/30 bg-red-500/12 text-red-600 dark:text-red-400",
  },
};

export const ZONE_STATUS_ORDER = ["idle", "preparing", "maintenance"];

export function getZoneStatus(id) {
  return ZONE_STATUS_META[id] || ZONE_STATUS_META.idle;
}

/** Mode meta — used by the form's conditional detail sections. */
export const CULTIVATION_MODES = {
  soil: {
    id: "soil",
    label: "Soil cultivation",
    blurb: "Describes the soil this plot grows in (zone_soil_details).",
  },
  hydro: {
    id: "hydro",
    label: "Hydroponic setup",
    blurb: "Describes the system feeding the roots (zone_hydro_details).",
  },
  other: {
    id: "other",
    label: "Mode-specific details coming soon",
    blurb:
      "Aquaponic and mushroom zones get their own detail sections in a later release — everything else can be set up now.",
  },
};

/**
 * Quick-pick grow media for the hydro section — the column is
 * free-form VARCHAR(100) because growers mix media, so these are
 * suggestions, not a closed list.
 */
export const GROW_MEDIUM_SUGGESTIONS = [
  "rockwool",
  "coco coir",
  "LECA",
  "perlite",
  "50/50 coco-perlite",
];
