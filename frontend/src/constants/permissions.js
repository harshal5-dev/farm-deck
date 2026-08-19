/**
 * Permissions — single source of truth for every authorization decision in
 * the UI. Each permission is a string constant; the actual gate is
 * `hasPermission(role, perm)` which lives in `@/lib/permissions`.
 *
 * Why strings instead of booleans?
 *   - Self-documenting at call sites: `hasPermission(role, "members.manage")`
 *     reads better than `canManageMembers`.
 *   - Greppable — find every UI element gated by a permission in one search.
 *   - Easy to extend without touching every consumer (add a new constant +
 *     add it to the role map; consumers stay unchanged).
 *
 * Naming: `<resource>.<action>` so the namespace groups well.
 */

/* -------------------------- Workspace & team -------------------------- */
export const PERMISSIONS = {
  // Members
  VIEW_MEMBERS:    "members.view",
  MANAGE_MEMBERS:  "members.manage",

  // Settings (owner-only)
  MANAGE_WORKSPACE: "workspace.manage",
  MANAGE_BILLING:   "billing.manage",

  /* ------------------------------- Farms ------------------------------- */
  VIEW_FARMS:   "farms.view",
  MANAGE_FARMS: "farms.manage",

  /* ------------------------------ Fields ------------------------------- */
  VIEW_FIELDS:   "fields.view",
  MANAGE_FIELDS: "fields.manage",

  /* ------------------------------- Crops ------------------------------- */
  VIEW_CROPS:   "crops.view",
  MANAGE_CROPS: "crops.manage",

  /* ----------------------------- Harvests ------------------------------ */
  VIEW_HARVESTS:   "harvests.view",
  LOG_HARVESTS:    "harvests.log",

  /* ----------------------------- Reports ------------------------------- */
  VIEW_REPORTS: "reports.view",
};

/**
 * ROLE_PERMISSIONS — every role's effective permission set.
 *
 * Convention:
 *   - `["*"]` is a wildcard that grants every permission (used for the
 *     workspace owner, who is the legal administrator).
 *   - Otherwise, list the exact permission strings the role gets.
 *   - "Manage" implies "View" — if a role has `farms.manage` they don't
 *     also need `farms.view` listed separately; `hasPermission` walks the
 *     hierarchy in `MANAGE_IMPLIES_VIEW` below.
 *
 * If you add a new role here, you also typically want to add an entry to
 * `ROLES` in `./roles.js` for its display metadata (icon, palette, label).
 */
export const ROLE_PERMISSIONS = {
  owner: ["*"],

  manager: [
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.MANAGE_MEMBERS,

    PERMISSIONS.VIEW_FARMS,
    PERMISSIONS.MANAGE_FARMS,
    PERMISSIONS.VIEW_FIELDS,
    PERMISSIONS.MANAGE_FIELDS,
    PERMISSIONS.VIEW_CROPS,
    PERMISSIONS.MANAGE_CROPS,
    PERMISSIONS.VIEW_HARVESTS,
    PERMISSIONS.LOG_HARVESTS,

    PERMISSIONS.VIEW_REPORTS,
  ],

  // Growers do the hands-on work: log harvests, edit assigned fields,
  // manage the farms/fields/crops they own — but they don't invite
  // teammates or touch billing.
  grower: [
    PERMISSIONS.VIEW_FARMS,
    PERMISSIONS.MANAGE_FARMS,
    PERMISSIONS.VIEW_FIELDS,
    PERMISSIONS.MANAGE_FIELDS,
    PERMISSIONS.VIEW_CROPS,
    PERMISSIONS.MANAGE_CROPS,
    PERMISSIONS.VIEW_HARVESTS,
    PERMISSIONS.LOG_HARVESTS,

    PERMISSIONS.VIEW_REPORTS,
  ],

  // Pure read-only access. No `manage` permissions, no member list,
  // no settings. They see the data, not the controls.
  viewer: [
    PERMISSIONS.VIEW_FARMS,
    PERMISSIONS.VIEW_FIELDS,
    PERMISSIONS.VIEW_CROPS,
    PERMISSIONS.VIEW_HARVESTS,

    PERMISSIONS.VIEW_REPORTS,
  ],
};

/**
 * "Manage" implies "View". When a UI element only requires `view` but
 * the role has `manage`, we should still pass. This map pairs each
 * `*.manage` permission with the matching `*.view` permission so
 * `hasPermission` can walk it.
 *
 * Adding a new resource? Add the pair here too.
 */
export const MANAGE_IMPLIES_VIEW = {
  [PERMISSIONS.MANAGE_MEMBERS]:   PERMISSIONS.VIEW_MEMBERS,
  [PERMISSIONS.MANAGE_FARMS]:     PERMISSIONS.VIEW_FARMS,
  [PERMISSIONS.MANAGE_FIELDS]:    PERMISSIONS.VIEW_FIELDS,
  [PERMISSIONS.MANAGE_CROPS]:     PERMISSIONS.VIEW_CROPS,
  [PERMISSIONS.MANAGE_WORKSPACE]: PERMISSIONS.VIEW_FARMS, // workspace mgmt also sees farms; tweak as needed
  [PERMISSIONS.MANAGE_BILLING]:   PERMISSIONS.VIEW_MEMBERS, // billing mgmt also sees members; tweak as needed
};
