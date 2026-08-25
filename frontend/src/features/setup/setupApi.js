import { createApi } from "@reduxjs/toolkit/query/react";
import {
  createFarmRow,
  listFarmTypesMock,
} from "@/features/fields/mock/zoneDb";

/**
 * Setup API — mock-backed endpoints for the guided setup wizard.
 *
 * The wizard's farm step uses these instead of the real farmApi so the
 * whole Farm → Fields → Crops flow runs on the same in-memory world
 * (the new farm immediately appears in the field picker and crop
 * joins). When the real zones/crops modules land, swap these queryFns
 * for the shared baseQuery exactly like zoneApi/cropApi.
 */
export const setupApi = createApi({
  reducerPath: "setupApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["SetupFarm", "Zone"],
  endpoints: (builder) => ({
    listSetupFarmTypes: builder.query({
      queryFn: async () => {
        try {
          return { data: await listFarmTypesMock() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["SetupFarm"],
    }),

    createSetupFarm: builder.mutation({
      queryFn: async (farm) => {
        try {
          return { data: await createFarmRow(farm) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["SetupFarm"],
    }),
  }),
});

export const {
  useListSetupFarmTypesQuery,
  useCreateSetupFarmMutation,
} = setupApi;
