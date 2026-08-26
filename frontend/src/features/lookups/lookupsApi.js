import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const lookupsApi = createApi({
  reducerPath: "lookupsApi",
  baseQuery,
  tagTypes: ["FarmTypes", "ZoneTypes", "SoilTypes", "HydroSystemTypes"],
  endpoints: (builder) => ({
    listFarmTypes: builder.query({
      query: () => ({ url: "/lookups/farm-types" }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["FarmTypes"],
    }),
    listZoneTypes: builder.query({
      query: () => ({ url: "/lookups/zone-types" }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["ZoneTypes"],
    }),
    listSoilTypes: builder.query({
      query: () => ({ url: "/lookups/soil-types" }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["SoilTypes"],
    }),
    listHydroSystemTypes: builder.query({
      query: () => ({ url: "/lookups/hydro-system-types" }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["HydroSystemTypes"],
    }),
  }),
});

export const {
  useListFarmTypesQuery,
  useListZoneTypesQuery,
  useListSoilTypesQuery,
  useListHydroSystemTypesQuery,
} = lookupsApi;
