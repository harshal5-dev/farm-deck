import { useContext } from "react";
import { useSelector } from "react-redux";
import { AuthProviderContext } from "./context";

/**
 * useAuth — real auth hook backed by Redux.
 *
 *   user            - the backend UserProfileResponse, or null
 *   isAuthenticated - true once a valid session is established
 *   clearAuth()     - clears local auth state (used on 401 + refresh failure)
 */
export function useAuth() {
  const ctx = useContext(AuthProviderContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const user = useSelector((s) => s.auth.user);
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  return { user, isAuthenticated, ...ctx };
}
