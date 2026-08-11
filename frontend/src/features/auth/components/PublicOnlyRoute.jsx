
import { Navigate } from "react-router-dom";
import { useSessionBootstrap } from "../useSessionBootstrap";
import FullPageLoader from "./FullPageLoader";

const PublicOnlyRoute = ({ children, redirectTo = "/app" }) => {
  const { isLoading, isSuccess } = useSessionBootstrap();

  // Wait for the session check before deciding, so we don't flash the login
  // form at an authenticated user whose Redux state hasn't rehydrated yet.
  if (isLoading) return <FullPageLoader />;
  if (isSuccess) return <Navigate to={redirectTo} replace />;

  return children;
}

export default PublicOnlyRoute;
