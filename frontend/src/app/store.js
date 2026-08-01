import { farmTypeApi } from "@/features/resources/farm-type/api/farmTypeApi";
import { soilTypeApi } from "@/features/resources/soil-type/api/soilTypeApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [farmTypeApi.reducerPath]: farmTypeApi.reducer,
    [soilTypeApi.reducerPath]: soilTypeApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      farmTypeApi.middleware,
      soilTypeApi.middleware
    ),
});

export default store;
