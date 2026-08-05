import {
  IconCrown,
  IconShieldCheck,
  IconPlant2,
  IconEye,
} from "@tabler/icons-react";

/**
 * Role config — single source of truth for the four workspace roles.
 * Used by the sidebar, members grid, invite dialog, role pills, etc.
 *
 * Each role gets:
 *  - a Tailwind palette (text/bg/ring/border + light/dark variants)
 *  - a tabler icon
 *  - a one-line description for tooltips / dialogs
 *  - a permissions summary (used in dialogs + tooltips)
 */
export const ROLES = {
  owner: {
    id: "owner",
    label: "Owner",
    description: "Full access to everything — billing, members, settings.",
    icon: IconCrown,
    permissions: [
      "Manage members & invitations",
      "Edit billing & subscription",
      "Delete the workspace",
    ],
    text: "text-clay-deep dark:text-clay",
    textBright: "text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-clay via-clay-deep to-clay",
    chip: "from-clay/25 to-clay/5 text-clay-deep dark:text-clay ring-clay/30",
    accent: "clay",
  },
  manager: {
    id: "manager",
    label: "Manager",
    description: "Oversees farm operations and member activity.",
    icon: IconShieldCheck,
    permissions: [
      "Invite & manage growers & viewers",
      "Create / edit farms, fields & crops",
      "View all workspace reports",
    ],
    text: "text-leaf",
    textBright: "text-leaf",
    bg: "bg-leaf/12 dark:bg-leaf/15",
    bgSoft: "bg-leaf/8",
    ring: "ring-leaf/40",
    border: "border-leaf/30",
    gradient: "from-leaf to-sage-deep",
    chip: "from-leaf/20 to-leaf/5 text-leaf ring-leaf/25",
    accent: "leaf",
  },
  grower: {
    id: "grower",
    label: "Grower",
    description: "Day-to-day field operations and crop care.",
    icon: IconPlant2,
    permissions: [
      "Log harvests & crop updates",
      "Edit assigned fields",
      "View farm reports",
    ],
    text: "text-sage-deep dark:text-sage",
    textBright: "text-sage-deep",
    bg: "bg-sage-deep/12 dark:bg-sage/15",
    bgSoft: "bg-sage-deep/8",
    ring: "ring-sage-deep/40",
    border: "border-sage-deep/30",
    gradient: "from-sage-deep to-leaf",
    chip: "from-sage-deep/20 to-sage-deep/5 text-sage-deep dark:text-sage ring-sage-deep/25",
    accent: "sage",
  },
  viewer: {
    id: "viewer",
    label: "Viewer",
    description: "Read-only access to farms, fields, and reports.",
    icon: IconEye,
    permissions: [
      "View farms, fields & crops",
      "View farm reports",
      "No editing rights",
    ],
    text: "text-sky-warm",
    textBright: "text-sky-warm",
    bg: "bg-sky-warm/12 dark:bg-sky-warm/15",
    bgSoft: "bg-sky-warm/8",
    ring: "ring-sky-warm/40",
    border: "border-sky-warm/30",
    gradient: "from-sky-warm to-sky-warm",
    chip: "from-sky-warm/20 to-sky-warm/5 text-sky-warm ring-sky-warm/25",
    accent: "sky",
  },
};

export const ROLE_ORDER = ["owner", "manager", "grower", "viewer"];

export const STATUS_META = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    chip:
      "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  invited: {
    label: "Invited",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    chip: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
  suspended: {
    label: "Suspended",
    dot: "bg-zinc-400",
    text: "text-muted-foreground",
    chip: "border-border/60 bg-muted text-muted-foreground",
  },
};

export function getRole(roleId) {
  return ROLES[roleId] || ROLES.viewer;
}

export function getStatus(statusId) {
  return STATUS_META[statusId] || STATUS_META.active;
}
