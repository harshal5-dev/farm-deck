import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSessionBootstrap } from "../useSessionBootstrap";
import { FullPageLoader } from "@/components/feedback";
import { useSelector } from "react-redux";
import { selectIsAuthenticated } from "../authSlice";

const ProtectedRoute = () => {
  const { isLoading } = useSessionBootstrap({});
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

export default ProtectedRoute;
