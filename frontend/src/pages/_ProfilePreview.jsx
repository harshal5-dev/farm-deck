import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { authReducer } from "@/features/auth";
import { AuthProviderContext } from "@/auth/context";
import Profile from "@/pages/Profile";

const mockUser = {
  id: "u-1234",
  fullName: "Harshal Ganbote",
  emailId: "harshal@farmdeck.app",
  role: "owner",
  avatarId: "farmer",
  tenantId: "a2e727e2-69d8-47a2-8073-a23d99bc651c",
  tenantName: "Ganbote Farms",
  createdAt: "2024-01-15T00:00:00.000Z",
};

const mockStore = configureStore({
  reducer: combineReducers({ auth: authReducer }),
  preloadedState: { auth: { user: mockUser, isAuthenticated: true } },
});

function MockAuthProvider({ children }) {
  const value = {
    updateUser: (patch) =>
      mockStore.dispatch({ type: "auth/updateUser", payload: patch }),
    clearAuth: () => {},
  };
  return (
    <AuthProviderContext.Provider value={value}>
      {children}
    </AuthProviderContext.Provider>
  );
}

export default function ProfilePreview() {
  return (
    <Provider store={mockStore}>
      <MockAuthProvider>
        <div className="min-h-svh bg-background">
          <Profile />
        </div>
      </MockAuthProvider>
    </Provider>
  );
}
