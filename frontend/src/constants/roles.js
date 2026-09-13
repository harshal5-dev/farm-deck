import {
  IconCrown,
  IconShieldCheck,
  IconPlant2,
  IconEye,
} from "@tabler/icons-react";

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
    text: "text-clay-deep dark:text-wheat",
    textBright: "text-clay",
    bg: "bg-clay/12 dark:bg-clay/15",
    bgSoft: "bg-clay/8",
    ring: "ring-clay/40",
    border: "border-clay/30",
    gradient: "from-wheat via-clay to-clay-deep",
    chip: "from-wheat/25 to-clay/10 text-clay-deep dark:text-wheat ring-clay/30",
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
    text: "text-iris-deep dark:text-iris",
    textBright: "text-iris",
    bg: "bg-iris/12 dark:bg-iris/15",
    bgSoft: "bg-iris/8",
    ring: "ring-iris/40",
    border: "border-iris/30",
    gradient: "from-iris to-iris-deep",
    chip: "from-iris/20 to-iris/5 text-iris-deep dark:text-iris ring-iris/25",
    accent: "iris",
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
    text: "text-lagoon-deep dark:text-sky-warm",
    textBright: "text-sky-warm",
    bg: "bg-sky-warm/12 dark:bg-sky-warm/15",
    bgSoft: "bg-sky-warm/8",
    ring: "ring-sky-warm/40",
    border: "border-sky-warm/30",
    gradient: "from-sky-warm to-lagoon",
    chip: "from-sky-warm/20 to-lagoon/10 text-lagoon-deep dark:text-sky-warm ring-sky-warm/25",
    accent: "sky",
  },
};

/** Roles assignable to / filterable for workspace members. Owner is a
 *  workspace-creator role managed outside the member section, so it isn't
 *  listed here (see ROLES.owner for its display metadata). */
export const ROLE_ORDER = ["manager", "grower", "viewer"];

export const STATUS_META = {
  active: {
    label: "Active",
    dot: "bg-emerald-500",
    text: "text-emerald-700 dark:text-emerald-400",
    chip: "border-emerald-500/30 bg-emerald-500/12 text-emerald-700 dark:text-emerald-400",
  },
  invited: {
    label: "Invited",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    chip: "border-amber-500/30 bg-amber-500/12 text-amber-700 dark:text-amber-400",
  },
};

export const USER_ROLES = {
  owner: "owner",
  manager: "manager",
  grower: "grower",
  viewer: "viewer",
};

export const getRole = (roleId) => {
  return ROLES[roleId] || ROLES.viewer;
};

export const getStatus = (statusId) => {
  return STATUS_META[statusId] || STATUS_META.active;
};
