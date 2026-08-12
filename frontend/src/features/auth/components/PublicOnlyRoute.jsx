
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSessionBootstrap } from "../useSessionBootstrap";
import FullPageLoader from "./FullPageLoader";

/**
 * PublicOnlyRoute — guards `/login` (and any other route that should only be
 * visible to logged-out users).
 *
 * Decision tree, in order:
 *   1. `isAuthenticated` is already true in Redux → redirect to the
 *      protected app. No network call.
 *   2. `intentionalLogout` is true (we just logged out) → render the
 *      children (login form). No network call.
 *   3. Otherwise the auth state is genuinely unknown (fresh visitor,
 *      hard refresh, navigation from a non-guarded page like `/`) →
 *      `useSessionBootstrap` fires `GET /users/me` to find out:
 *        - 200 with a profile → setCredentials → re-render with
 *          `isAuthenticated: true` → redirect.
 *        - 401 → useSessionBootstrap's effect dispatches
 *          `clearCredentials` (which also flips `intentionalLogout` to
 *          true) → re-render shows the login form.
 *
 * `skipIfAuthenticated: true` on the hook guarantees that the call in
 * step 3 is only fired when both `isAuthenticated` AND `intentionalLogout`
 * are false — i.e. only when we genuinely don't know.
 */
const PublicOnlyRoute = ({ children, redirectTo = "/app" }) => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const intentionalLogout = useSelector((s) => s.auth.intentionalLogout);

  const { isLoading, isSuccess } = useSessionBootstrap({
    skipIfAuthenticated: true,
  });

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (intentionalLogout) return children;
  if (isLoading) return <FullPageLoader />;
  if (isSuccess) return <Navigate to={redirectTo} replace />;

  return children;
}

export default PublicOnlyRoute;
