import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, transformResult } from "@/lib/api";
import { buildFarmDetails } from "./mock/farmDetails";

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

    /* Farm view page — MOCKED until GET /farms/:id ships (see
       mock/farmDetails.js for the target contract). Assembles the real
       farm row (selected farm or the list cache) + the farm's real
       fields into the documented shape, stats included. When the backend
       returns stats, swap to:
         query: ({ id }) => ({ url: `/farms/${id}`, method: "GET" }),
         transformResponse: transformResult, */
    getFarmDetails: builder.query({
      queryFn: async ({ id }, api) => {
        const state = api.getState();
        const farms = state.farmApi?.queries?.listFarms?.data?.farms ?? [];
        const farm =
          farms.find((f) => f.id === id) ??
          (state.selectedFarm?.farm?.id === id
            ? state.selectedFarm.farm
            : null);
        if (!farm) {
          return {
            error: {
              status: 404,
              data: { error: { message: "Farm not found" } },
            },
          };
        }
        const zonesRes = await baseQuery(
          { url: "/zones", params: { farmID: id, pageSize: 100 } },
          api,
          {}
        );
        if (zonesRes.error) return { error: zonesRes.error };
        const zones = zonesRes.data?.data?.zones ?? [];
        return { data: buildFarmDetails(farm, zones) };
      },
      providesTags: (_r, _e, { id }) => [{ type: "Farm", id }],
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
  useGetFarmDetailsQuery,
  useCreateFarmMutation,
  useUpdateFarmMutation,
  useInactivateFarmMutation,
  useActivateFarmMutation,
} = farmApi;
