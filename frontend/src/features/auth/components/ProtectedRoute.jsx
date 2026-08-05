import { Navigate, Outlet, useLocation } from "react-router-dom";
import { IconLoader2 } from "@tabler/icons-react";
import { useSessionBootstrap } from "../useSessionBootstrap";
import { useAuth } from "../auth-context";

/**
 * ProtectedRoute — renders the protected app (Outlet) only when the
 * session check (GET /auth/profile) succeeds. While the check is in
 * flight we show a full-page loader so a hard refresh on a logged-in
 * user does not flash the login page.
 */
export default function ProtectedRoute() {
  const { isLoading, isSuccess } = useSessionBootstrap();
  const location = useLocation();

  if (isLoading || !isSuccess) {
    return <FullPageLoader />;
  }
  if (!isSuccess) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/**
 * PublicOnlyRoute — inverse guard for /login. Does NOT make any network
 * request: it reads the auth state directly from the Redux slice. This
 * keeps the login page free of wasted /auth/profile + /auth/refresh
 * 401s for fresh visitors, while still redirecting users who are
 * already logged in and navigate to /login via a link (the slice is
 * populated in that case).
 *
 * Trade-off: a hard refresh of /login while logged in shows the login
 * form briefly (the slice resets to isAuthenticated=false on reload).
 * Clicking "Sign in" with the real password re-authenticates and
 * navigates to /app — not a loop, just a re-login.
 */
export function PublicOnlyRoute({ children, redirectTo = "/app" }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}

export function FullPageLoader() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="absolute -inset-8 rounded-full bg-leaf/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-leaf/10 ring-1 ring-leaf/20">
          <IconLoader2
            className="size-7 animate-spin text-leaf"
            strokeWidth={1.75}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Loading your farm…
        </p>
      </div>
    </div>
  );
}
