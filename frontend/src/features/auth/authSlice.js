import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  intentionalLogout: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload ?? null;
      state.intentionalLogout = false;
       state.isLoading = false;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.intentionalLogout = true;
      state.isLoading = false;
    },
    setAuthLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIntentionalLogout = (state) => state.auth.intentionalLogout;
export const selectAuthLoading = (state) => state.auth.isLoading;

export const { setCredentials, clearCredentials, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
