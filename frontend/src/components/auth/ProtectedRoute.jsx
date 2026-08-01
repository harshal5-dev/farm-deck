import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/auth"

/**
 * ProtectedRoute — renders the protected app (Outlet) only when authenticated.
 * Otherwise redirects to /login, remembering where the user was headed.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

/**
 * PublicOnlyRoute — the inverse guard: redirects authenticated users away from
 * auth pages (login/register) to the dashboard, so they can't see login again.
 */
export function PublicOnlyRoute({ children, redirectTo = "/" }) {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }
  return children
}
