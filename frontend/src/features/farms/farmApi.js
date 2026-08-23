import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/api";

/**
 * Farm API — talks to the backend farms module.
 *
 * Routes (see backend internal/modules/farm/http):
 *   GET    /farms/      → list   { data: { farms, active, inactive, total } }
 *   POST   /farms/      → create (ManageFarmRequest)
 *   PUT    /farms/:id   → update (full replace, ManageFarmRequest)
 *   PATCH  /farms/:id   → inactivate (soft "delete")
 *   PATCH  /farms/:id/activate → reactivate
 *
 * Every response arrives wrapped in the standard envelope
 * `{ data, success, timestamp }`, so each endpoint unwraps `.data`.
 * The backend serialises the type FK as `farmTypeID` while the rest of
 * the frontend (form, edit page) speaks `farmTypeId` — the normalisers
 * below translate in both directions so callers never see the mismatch.
 */

const emptyList = { farms: [], active: 0, inactive: 0, total: 0 };

/** FarmInfo (API) → frontend farm shape: farmTypeID → farmTypeId. */
const normalizeFarm = (raw) => ({
  ...raw,
  farmTypeId: raw?.farmTypeID ?? raw?.farmTypeId ?? null,
});

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
      transformResponse: (response) => {
        const data = response?.data ?? emptyList;
        return {
          farms: (data.farms ?? []).map(normalizeFarm),
          active: data.active ?? 0,
          inactive: data.inactive ?? 0,
          total: data.total ?? 0,
        };
      },
      providesTags: ["Farm"],
    }),

    createFarm: builder.mutation({
      query: (farm) => ({
        url: "/farms",
        method: "POST",
        body: toRequestBody(farm),
      }),
      transformResponse: (response) => normalizeFarm(response?.data ?? null),
      invalidatesTags: ["Farm"],
    }),

    updateFarm: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/farms/${id}`,
        method: "PUT",
        body: toRequestBody(patch),
      }),
      transformResponse: (response) => normalizeFarm(response?.data ?? null),
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
      transformResponse: (response) => response?.data ?? null,
      invalidatesTags: ["Farm"],
    }),

    activateFarm: builder.mutation({
      query: (id) => ({
        url: `/farms/${id}/activate`,
        method: "PATCH",
      }),
      transformResponse: (response) => response?.data ?? null,
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
