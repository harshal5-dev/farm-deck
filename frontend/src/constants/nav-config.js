import {
  IconBasket,
  IconLayoutDashboard,
  IconLayoutGrid,
  IconListDetails,
  IconPlant2,
  IconTractor,
  IconUserCircle,
  IconUsers,
} from "@tabler/icons-react";
import { PERMISSIONS } from "./permissions";

/**
 * NAV_GROUPS — the full workspace sidebar menu.
 *
 * Each item can carry:
 *   - permission: which PERMISSIONS.* string gates the item (omit = always)
 *   - comingSoon: when the route isn't built yet — renders a disabled
 *                 item with a "Soon" chip so the architecture is in place
 *                 before the pages exist.
 *
 * The sidebar filters this list via `filterNavGroups(groups, user.role)`
 * so e.g. a viewer never sees the "Members" item, and a grower sees
 * "Farms / Fields / Crops" but no "Settings".
 *
 * Visual grouping rationale:
 *   - Overview      — entry point everyone gets
 *   - Farming       — farm/field/crop/harvest resources
 *   - Reference     — workspace reference data (lookups, future settings)
 *   - Team          — member list & invites (manager+ only)
 *   - Account       — your own profile (everyone, always at the bottom)
 */
export const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/app",
        icon: IconLayoutDashboard,
        end: true,
      },
    ],
  },
  {
    label: "Farming",
    items: [
      {
        label: "Farms",
        href: "/app/farms",
        icon: IconTractor,
        permission: PERMISSIONS.VIEW_FARMS,
      },
      {
        label: "Fields",
        href: "/app/fields",
        icon: IconLayoutGrid,
        permission: PERMISSIONS.VIEW_FIELDS,
      },
      {
        label: "Crops",
        href: "/app/crops",
        icon: IconPlant2,
        permission: PERMISSIONS.VIEW_CROPS,
      },
      {
        label: "Harvests",
        href: "/app/harvests",
        icon: IconBasket,
        permission: PERMISSIONS.VIEW_HARVESTS,
      },
    ],
  },
  {
    label: "Reference",
    items: [
      {
        label: "Lookups",
        href: "/app/lookups",
        icon: IconListDetails,
      },
    ],
  },
  {
    label: "Team",
    items: [
      {
        label: "Members",
        href: "/app/members",
        icon: IconUsers,
        permission: PERMISSIONS.VIEW_MEMBERS,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Profile",
        href: "/app/profile",
        icon: IconUserCircle,
      },
    ],
  },
];
