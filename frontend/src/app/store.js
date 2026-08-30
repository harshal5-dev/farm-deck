import { configureStore } from "@reduxjs/toolkit";
import { authApi, authReducer } from "@/features/auth";
import { ProfileApi } from "@/features/profile";
import {
  memberApi,
  selectedMemberReducer,
} from "@/features/members";
import { farmApi, selectedFarmReducer } from "@/features/farms";
import { zoneApi, selectedZoneReducer } from "@/features/fields";
import {
  cropApi,
  selectedCycleReducer,
  selectedCatalogCropReducer,
} from "@/features/crops";
import {
  dailyLogApi,
  selectedDailyLogReducer,
} from "@/features/daily-logs";
import {
  harvestApi,
  selectedHarvestReducer,
} from "@/features/harvests";
import { setupApi } from "@/features/setup";
import { lookupsApi } from "@/features/lookups";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    selectedMember: selectedMemberReducer,
    selectedFarm: selectedFarmReducer,
    selectedZone: selectedZoneReducer,
    selectedCycle: selectedCycleReducer,
    selectedCatalogCrop: selectedCatalogCropReducer,
    selectedDailyLog: selectedDailyLogReducer,
    selectedHarvest: selectedHarvestReducer,
    [authApi.reducerPath]: authApi.reducer,
    [ProfileApi.reducerPath]: ProfileApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [farmApi.reducerPath]: farmApi.reducer,
    [zoneApi.reducerPath]: zoneApi.reducer,
    [cropApi.reducerPath]: cropApi.reducer,
    [dailyLogApi.reducerPath]: dailyLogApi.reducer,
    [harvestApi.reducerPath]: harvestApi.reducer,
    [setupApi.reducerPath]: setupApi.reducer,
    [lookupsApi.reducerPath]: lookupsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      ProfileApi.middleware,
      memberApi.middleware,
      farmApi.middleware,
      zoneApi.middleware,
      cropApi.middleware,
      dailyLogApi.middleware,
      harvestApi.middleware,
      setupApi.middleware,
      lookupsApi.middleware,
    ),
});

export default store;
