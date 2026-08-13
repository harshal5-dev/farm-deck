import {
  IconSun,
  IconBuildingWarehouse,
  IconArrowsExchange,
  IconBuilding,
} from "@tabler/icons-react";

/**
 * One source of truth for farm-type presentation. Maps the `farmType` string
 * (stored on each farm record) to its icon, badge colour, gradient, and a few
 * tinted utility classes. Previously this `typeMeta` object was duplicated
 * across FarmList and FarmDetail — now both pull from here so the redesign
 * stays consistent.
 */
export const farmTypeMeta = {
  outdoor: {
    label: "Outdoor",
    icon: IconSun,
    color: "amber",
    gradient: "from-amber-500/25 via-amber-400/12 to-transparent",
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    glow: "group-hover/farm:shadow-amber-500/20",
  },
  greenhouse: {
    label: "Greenhouse",
    icon: IconBuildingWarehouse,
    color: "emerald",
    gradient: "from-emerald-500/25 via-emerald-400/12 to-transparent",
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    glow: "group-hover/farm:shadow-emerald-500/20",
  },
  mixed: {
    label: "Mixed",
    icon: IconArrowsExchange,
    color: "violet",
    gradient: "from-violet-500/25 via-violet-400/12 to-transparent",
    bg: "bg-violet-500/10",
    text: "text-violet-600 dark:text-violet-400",
    glow: "group-hover/farm:shadow-violet-500/20",
  },
  indoor: {
    label: "Indoor",
    icon: IconBuilding,
    color: "sky",
    gradient: "from-sky-500/25 via-sky-400/12 to-transparent",
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    glow: "group-hover/farm:shadow-sky-500/20",
  },
};

export const getFarmTypeMeta = (type) =>
  farmTypeMeta[type] || farmTypeMeta.outdoor;

/** Ordered list of farm types for rendering filter chips, etc. */
export const farmTypeOrder = ["outdoor", "greenhouse", "mixed", "indoor"];
