import { Navigate, Outlet, useLocation } from "react-router-dom";
import { FullPageLoader } from "@/components/feedback";
import { useSelector } from "react-redux";
import { selectAuthLoading, selectIsAuthenticated } from "../authSlice";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) return <FullPageLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}

export default ProtectedRoute;
