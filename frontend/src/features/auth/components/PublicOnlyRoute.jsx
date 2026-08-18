
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSessionBootstrap } from "../useSessionBootstrap";
import { FullPageLoader } from "@/components/feedback";
import { selectIntentionalLogout, selectIsAuthenticated } from "../authSlice";

const PublicOnlyRoute = ({ children, redirectTo = "/app" }) => {
  const intentionalLogout = useSelector(selectIntentionalLogout);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { isLoading } = useSessionBootstrap();

  if (intentionalLogout) return children;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;
  if (isLoading) return <FullPageLoader />;

  return children;
}

export default PublicOnlyRoute;
