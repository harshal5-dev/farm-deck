import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  intentionalLogout: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload ?? null;
      state.intentionalLogout = false;
    },
    clearCredentials(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.intentionalLogout = true;
    },
  },
});

export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIntentionalLogout = (state) => state.auth.intentionalLogout;

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
