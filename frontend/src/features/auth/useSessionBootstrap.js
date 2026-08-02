import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "./authApi";
import { setCredentials, clearCredentials } from "./authSlice";

/**
 * useSessionBootstrap — single source of truth for "do we have a session?".
 *
 * Mount this in route guards (ProtectedRoute, PublicOnlyRoute). It fires
 * GET /auth/profile exactly once per route mount, the baseQuery's refresh
 * interceptor transparently renews the access cookie if needed, and the
 * hook keeps the auth slice in sync.
 *
 * There is intentionally NO global "fire on app mount" call: that would
 * generate an extra /auth/profile request (and a wasted /auth/refresh on
 * 401) on every page load, even for fresh visitors on /login. Firing from
 * route guards means a request happens only when a guarded route is
 * actually visited.
 *
 * Returns the RTK Query status fields so the guard can show a loader or
 * branch on success/failure.
 */
export function useSessionBootstrap() {
  const dispatch = useDispatch();
  const { data, isLoading, isSuccess, isError } = useGetProfileQuery();

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials(data));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [isSuccess, isError, data, dispatch]);

  return { isLoading, isSuccess, isError };
}
