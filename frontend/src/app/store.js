import { configureStore } from "@reduxjs/toolkit";
import { farmTypeApi } from "@/features/resources/farm-type/api/farmTypeApi";
import { soilTypeApi } from "@/features/resources/soil-type/api/soilTypeApi";
import { authApi, authReducer } from "@/features/auth";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [farmTypeApi.reducerPath]: farmTypeApi.reducer,
    [soilTypeApi.reducerPath]: soilTypeApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      farmTypeApi.middleware,
      soilTypeApi.middleware,
      authApi.middleware
    ),
});

export default store;
