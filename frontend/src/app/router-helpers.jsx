import { Outlet } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth";
import { MembersProvider } from "@/features/members";

export { ProtectedRoute, PublicOnlyRoute };

/** Wraps /members/* routes with the members context. */
export function MembersLayout() {
  return (
    <MembersProvider>
      <Outlet />
    </MembersProvider>
  );
}
