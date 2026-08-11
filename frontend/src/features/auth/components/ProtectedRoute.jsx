import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionBootstrap } from "../useSessionBootstrap";
import FullPageLoader from "./FullPageLoader";

/**
 * ProtectedRoute — renders the protected app (Outlet) only when the
 * session check (GET /auth/profile) succeeds. While the check is in
 * flight we show a full-page loader so a hard refresh on a logged-in
 * user does not flash the login page.
 */
const ProtectedRoute = () => {
  const { isLoading, isSuccess } = useSessionBootstrap();
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;
  if (!isSuccess) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

export default ProtectedRoute;
