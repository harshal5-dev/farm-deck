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
    setIsAuthenticated(state, action) {
      console.log("setIsAuthenticated payload", action.payload);
      state.isAuthenticated = action.payload;
    },
    setUser(state, action) {
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

export const { setIsAuthenticated, setUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
