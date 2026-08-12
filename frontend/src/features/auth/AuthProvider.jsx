import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { AuthProviderContext } from "./context";
import { clearCredentials } from "./authSlice";

/**
 * AuthProvider — provides the auth context (clearAuth).
 *
 * The actual session check is route-driven: ProtectedRoute and
 * PublicOnlyRoute each mount `useSessionBootstrap`, which fires the
 * GET /auth/profile request and keeps the Redux auth slice in sync. This
 * avoids a wasted /auth/profile + /auth/refresh on every hard refresh of
 * the login page for fresh visitors.
 */
export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const clearAuth = useCallback(() => dispatch(clearCredentials()), [dispatch]);

  const value = useMemo(
    () => ({ clearAuth }),
    [clearAuth]
  );

  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}
