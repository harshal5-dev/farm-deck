import { createSlice } from "@reduxjs/toolkit";

/**
 * authSlice — holds the real authentication state, populated from the backend.
 *
 * Shape of `user` mirrors the backend `UserProfileResponse`
 * (GET /api/v1/auth/profile): { id, fullName, emailId, role, tenantId, createdAt }.
 * (The backend also returns tenantName on the profile, which we include when present.)
 *
 * The session check (getProfile) is route-driven — ProtectedRoute and
 * PublicOnlyRoute each call it via the `useSessionBootstrap` hook, which
 * keeps the slice in sync with whichever route is active. There is no
 * "isInitialized" flag here: route guards show their own loaders while the
 * check is in flight.
 */
const initialState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload ?? null;
      state.isAuthenticated = !!action.payload;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
