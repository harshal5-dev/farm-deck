import { configureStore } from "@reduxjs/toolkit";
import { farmTypeApi } from "@/features/lookups/farm-type/api/farmTypeApi";
import { soilTypeApi } from "@/features/lookups/soil-type/api/soilTypeApi";
import { authApi, authReducer } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import { membersReducer } from "@/features/members";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    members: membersReducer,
    [farmTypeApi.reducerPath]: farmTypeApi.reducer,
    [soilTypeApi.reducerPath]: soilTypeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      farmTypeApi.middleware,
      soilTypeApi.middleware,
      authApi.middleware,
      ProfileApi.middleware,
    ),
});

export default store;
