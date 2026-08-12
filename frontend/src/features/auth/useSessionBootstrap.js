import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, clearCredentials } from "./authSlice";
import { useGetProfileQuery } from "../profile";

/**
 * useSessionBootstrap — single source of truth for "do we have a session?".
 *
 * Mount this in route guards (ProtectedRoute, PublicOnlyRoute). It fires
 * GET /users/me exactly once per route mount, the baseQuery's refresh
 * interceptor transparently renews the access cookie if needed, and the
 * hook keeps the auth slice in sync.
 *
 * There is intentionally NO global "fire on app mount" call: that would
 * generate an extra /users/me request (and a wasted /auth/refresh on 401)
 * on every page load, even for fresh visitors on /login. Firing from
 * route guards means a request happens only when a guarded route is
 * actually visited.
 *
 * Skip rules — combine via OR:
 *   - `intentionalLogout` (authSlice): set by `clearCredentials`. When
 *     true we skip unconditionally, because the user just logged out and
 *     we know the session is gone.
 *   - `skipIfAuthenticated` (option, default false): when true, also skip
 *     if `isAuthenticated` is already true in the auth slice. This is
 *     used by `PublicOnlyRoute` to avoid a wasted `/users/me` when the
 *     caller already knows the user is logged in and will redirect on
 *     the next line. `ProtectedRoute` leaves it off (default) so that a
 *     hard refresh on `/app/*` always re-verifies with the server.
 *
 * Returns the RTK Query status fields so the guard can show a loader or
 * branch on success/failure.
 */
export function useSessionBootstrap({ skipIfAuthenticated = false } = {}) {
  const dispatch = useDispatch();
  const intentionalLogout = useSelector((s) => s.auth.intentionalLogout);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const skip = intentionalLogout || (skipIfAuthenticated && isAuthenticated);

  const { data, isLoading, isSuccess, isError } = useGetProfileQuery(undefined, {
    skip,
  });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials(data));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [isSuccess, isError, data, dispatch]);

  return { isLoading, isSuccess, isError };
}
