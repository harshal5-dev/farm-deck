
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSessionBootstrap } from "../useSessionBootstrap";
import { FullPageLoader } from "@/components/feedback";
import { selectIntentionalLogout, selectIsAuthenticated } from "../authSlice";

const PublicOnlyRoute = ({ children, redirectTo = "/app" }) => {
  const intentionalLogout = useSelector(selectIntentionalLogout);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const { isLoading } = useSessionBootstrap({ skipQuery: true });

  if (intentionalLogout) return children;
  if (isLoading) return <FullPageLoader />;
  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  return children;
}

export default PublicOnlyRoute;
