import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AuthProviderContext } from "./context";
import { updateUser as updateUserAction, clearCredentials } from "@/features/auth";

/**
 * AuthProvider — provides the auth context (updateUser, clearAuth).
 *
 * The actual session check is route-driven: ProtectedRoute and
 * PublicOnlyRoute each mount `useSessionBootstrap`, which fires the
 * GET /auth/profile request and keeps the Redux auth slice in sync. This
 * avoids a wasted /auth/profile + /auth/refresh on every hard refresh of
 * the login page for fresh visitors.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const updateUser = useCallback(
    (patch) => dispatch(updateUserAction(patch)),
    [dispatch]
  );
  const clearAuth = useCallback(() => dispatch(clearCredentials()), [dispatch]);

  const value = useMemo(
    () => ({ updateUser, clearAuth }),
    [updateUser, clearAuth]
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
