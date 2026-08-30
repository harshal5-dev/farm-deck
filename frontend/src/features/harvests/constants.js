import {
  IconAward,
  IconBasket,
  IconCoin,
  IconMedal,
  IconScale,
  IconTrophy,
} from "@tabler/icons-react";

/**
 * Harvest metadata — quality grades map 1:1 to the DB CHECK
 * `harvest_grade_chk` (quality_grade ∈ {A, B, C} | null). Each grade
 * gets a medal icon + tone so the list, form and preview all render
 * the same visual language.
 */
export const QUALITY_GRADES = {
  A: {
    id: "A",
    label: "Grade A",
    short: "A",
    description: "Prime — top of market.",
    icon: IconTrophy,
    dot: "bg-emerald-500",
    chip:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
    gradient: "from-emerald-500 to-leaf",
    text: "text-emerald-600 dark:text-emerald-400",
  },
  B: {
    id: "B",
    label: "Grade B",
    short: "B",
    description: "Good — minor blemishes.",
    icon: IconMedal,
    dot: "bg-amber-500",
    chip:
      "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
    gradient: "from-amber-500 to-wheat-deep",
    text: "text-amber-600 dark:text-amber-400",
  },
  C: {
    id: "C",
    label: "Grade C",
    short: "C",
    description: "Utility — processing or salvage.",
    icon: IconAward,
    dot: "bg-sky-600",
    chip: "border-sky-600/30 bg-sky-600/12 text-sky-700 dark:text-sky-400",
    gradient: "from-sky-600 to-lagoon-deep",
    text: "text-sky-700 dark:text-sky-400",
  },
};

export const GRADE_ORDER = ["A", "B", "C"];

export function getGrade(id) {
  return QUALITY_GRADES[id] || null;
}

/** Shared harvest iconography (kept next to the grades so form,
 *  list and preview stay in sync). */
export const HARVEST_ICONS = {
  harvest: IconBasket,
  yield: IconScale,
  price: IconCoin,
  revenue: IconMedal,
};

/** Sort options for the list page. */
export const HARVEST_SORTS = {
  recent: { id: "recent", label: "Recent", description: "Newest harvest first" },
  yield: { id: "yield", label: "Yield", description: "Heaviest harvest first" },
  revenue: { id: "revenue", label: "Revenue", description: "Highest revenue first" },
};

export const HARVEST_SORT_ORDER = ["recent", "yield", "revenue"];
