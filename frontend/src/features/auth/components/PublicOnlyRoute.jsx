
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { FullPageLoader } from "@/components/feedback";
import { selectAuthLoading, selectIntentionalLogout, selectIsAuthenticated } from "../authSlice";

const PublicOnlyRoute = ({ children, redirectTo = "/app" }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const intentionalLogout = useSelector(selectIntentionalLogout);

  if (intentionalLogout) return children;

  if (isAuthenticated) return <Navigate to={redirectTo} replace />;

  if (isLoading) return <FullPageLoader />;

  return children;
}

export default PublicOnlyRoute;
