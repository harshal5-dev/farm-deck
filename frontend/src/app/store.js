import { configureStore } from "@reduxjs/toolkit";
import { authApi, authReducer } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import {
  memberApi,
  selectedMemberReducer,
} from "@/features/members";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedMember: selectedMemberReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ProfileApi.middleware,
      memberApi.middleware,
    ),
});

export default store;
