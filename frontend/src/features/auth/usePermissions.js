import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/features/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export function usePermissions() {
  const user = useSelector(selectUser);
  const role = user?.role;

  return useMemo(
    () => ({
      role,
      canViewMembers:   hasPermission(role, PERMISSIONS.VIEW_MEMBERS),
      canManageMembers: hasPermission(role, PERMISSIONS.MANAGE_MEMBERS),
      canViewFarms:     hasPermission(role, PERMISSIONS.VIEW_FARMS),
      canManageFarms:   hasPermission(role, PERMISSIONS.MANAGE_FARMS),
      canLogHarvests:   hasPermission(role, PERMISSIONS.LOG_HARVESTS),
      canManageBilling: hasPermission(role, PERMISSIONS.MANAGE_BILLING),
    }),
    [role]
  );
}
