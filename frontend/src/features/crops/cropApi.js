import { createApi } from "@reduxjs/toolkit/query/react";
import * as cropDb from "./mock/cropDb";

/**
 * Crop API — currently MOCK-BACKED (same pattern as zoneApi).
 *
 * Swapping to the real module later is mechanical: replace each
 * `queryFn` with a `query` against the shared baseQuery. Response
 * shapes already match the app envelope.
 *
 * Planned routes:
 *   GET    /crops/            → list  { data: { crops } }
 *   POST   /crops/            → create
 *   PUT    /crops/:id         → update (full replace)
 *   PATCH  /crops/:id/advance → happy-path status advance
 *   GET    /lookups/crop-types
 */

export const cropApi = createApi({
  reducerPath: "cropApi",
  baseQuery: () => ({ data: null }),
  tagTypes: ["Crop"],
  endpoints: (builder) => ({
    listCrops: builder.query({
      queryFn: async () => {
        try {
          return { data: await cropDb.listCrops() };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["Crop"],
    }),

    createCrop: builder.mutation({
      queryFn: async (crop) => {
        try {
          return { data: await cropDb.createCrop(crop) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    updateCrop: builder.mutation({
      queryFn: async (patch) => {
        try {
          return { data: await cropDb.updateCrop(patch) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    advanceCropStatus: builder.mutation({
      queryFn: async (id) => {
        try {
          return { data: await cropDb.advanceCropStatus(id) };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["Crop"],
    }),

    listCropTypes: builder.query({
      queryFn: async () => {
        try {
          return { data: await cropDb.listCropTypes() };
        } catch (error) {
          return { error };
        }
      },
    }),
  }),
});

export const {
  useListCropsQuery,
  useCreateCropMutation,
  useUpdateCropMutation,
  useAdvanceCropStatusMutation,
  useListCropTypesQuery,
} = cropApi;
