import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  MANAGE_IMPLIES_VIEW,
} from "@/constants/permissions";

/**
 * Permission helpers — small wrappers around the role→permission map so
 * call sites read declaratively.
 */

/**
 * hasPermission — does `role` have the given permission?
 *
 *   - Unknown role → false (defensive default so a missing user/role
 *     never accidentally gets access).
 *   - Wildcard role (`["*"]`) → true for anything.
 *   - Otherwise walks the role's permission list AND the
 *     "manage implies view" hierarchy so a role with `farms.manage`
 *     automatically passes `farms.view`.
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  if (perms.includes("*")) return true;
  if (perms.includes(permission)) return true;

  // Walk: does the role hold a `manage` perm that implies this `view`?
  for (const [managePerm, impliedView] of Object.entries(MANAGE_IMPLIES_VIEW)) {
    if (impliedView === permission && perms.includes(managePerm)) return true;
  }
  return false;
}

/**
 * filterNavGroups — given the full nav config and a role, return only
 * the groups whose items the role has permission to see. Groups that
 * end up with zero items after filtering are dropped so the sidebar
 * never shows an empty section.
 *
 * Each nav item may declare:
 *   - permission:   string  — required permission to see the item
 *   - comingSoon:   boolean — item exists but the route isn't built yet
 *
 * Items without a `permission` are visible to everyone (e.g. Dashboard,
 * Profile).
 */
export function filterNavGroups(groups, role) {
  if (!Array.isArray(groups)) return [];
  return groups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.permission || hasPermission(role, item.permission)
      ),
    }))
    .filter((group) => group.items.length > 0);
}

export { PERMISSIONS };
