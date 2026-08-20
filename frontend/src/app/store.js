import { configureStore } from "@reduxjs/toolkit";
import { authApi, authReducer } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import {
  memberApi,
  selectedMemberReducer,
} from "@/features/members";
import { farmApi, selectedFarmReducer } from "@/features/farms";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedMember: selectedMemberReducer,
    selectedFarm: selectedFarmReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [farmApi.reducerPath]: farmApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ProfileApi.middleware,
      memberApi.middleware,
      farmApi.middleware,
    ),
});

export default store;
