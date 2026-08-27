import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, transformResult } from "@/lib/api";

/** form payload (farmTypeId) → ManageFarmRequest body (farmTypeID). */
const toRequestBody = (farm) => {
  const { farmTypeId, farmTypeID, ...rest } = farm;
  return {
    ...rest,
    farmTypeID: farmTypeID ?? farmTypeId,
  };
};

export const farmApi = createApi({
  reducerPath: "farmApi",
  baseQuery,
  tagTypes: ["Farm"],
  endpoints: (builder) => ({
    listFarms: builder.query({
      query: () => ({ url: "/farms", method: "GET" }),
      transformResponse: transformResult,
      providesTags: ["Farm"],
    }),

    createFarm: builder.mutation({
      query: (farm) => ({
        url: "/farms",
        method: "POST",
        body: farm,
      }),
      invalidatesTags: ["Farm"],
    }),

    updateFarm: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/farms/${id}`,
        method: "PUT",
        body: toRequestBody(patch),
      }),
      invalidatesTags: (_result, _err, { id }) => [
        "Farm",
        { type: "Farm", id },
      ],
    }),

    inactivateFarm: builder.mutation({
      query: (id) => ({
        url: `/farms/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Farm"],
    }),

    activateFarm: builder.mutation({
      query: (id) => ({
        url: `/farms/${id}/activate`,
        method: "PATCH",
      }),
      invalidatesTags: ["Farm"],
    }),
  }),
});

export const {
  useListFarmsQuery,
  useCreateFarmMutation,
  useUpdateFarmMutation,
  useInactivateFarmMutation,
  useActivateFarmMutation,
} = farmApi;
