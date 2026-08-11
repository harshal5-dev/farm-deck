export { AuthProvider } from "./AuthProvider";
export { useAuth } from "./useAuth";
// Re-exported so legacy consumers (Tenant, Profile) that use DEMO_USER as a
// fallback keep working; the real auth flow populates `user` from the backend.
export { AUTH_STORAGE_KEY, AUTH_USER_STORAGE_KEY, DEMO_USER } from "./constants";
