import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

/**
 * usePermissions — single hook that exposes the current user's role and
 * the booleans every consumer actually needs. Memoized so identity stays
 * stable across re-renders unless `user.role` changes.
 *
 * Returns:
 *   - role:        string | undefined         the user's workspace role
 *   - canViewMembers:    boolean              see the member list
 *   - canManageMembers:  boolean              invite / edit / delete
 *   - canManageFarm:     boolean              placeholder for farm CRUD
 *   - canLogHarvest:     boolean              placeholder for harvest log
 *   - canManageBilling:  boolean              placeholder for billing
 *
 * Add new booleans here as the UI needs them — keeping the check in one
 * place means a new role or permission only has to be added once.
 */
export function usePermissions() {
  const user = useSelector(selectUser);
  const role = user?.role;

  return useMemo(
    () => ({
      role,
      canViewMembers:   hasPermission(role, PERMISSIONS.VIEW_MEMBERS),
      canManageMembers: hasPermission(role, PERMISSIONS.MANAGE_MEMBERS),
      canManageFarms:   hasPermission(role, PERMISSIONS.MANAGE_FARMS),
      canLogHarvests:   hasPermission(role, PERMISSIONS.LOG_HARVESTS),
      canManageBilling: hasPermission(role, PERMISSIONS.MANAGE_BILLING),
    }),
    [role]
  );
}
