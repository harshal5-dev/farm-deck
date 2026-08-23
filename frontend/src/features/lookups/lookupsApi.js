import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";

export const lookupsApi = createApi({
  reducerPath: "lookupsApi",
  baseQuery,
  tagTypes: ["FarmTypes"],
  endpoints: (builder) => ({
    listFarmTypes: builder.query({
      query: () => ({ url: "/lookups/farm-types" }),
      transformResponse: (response) => response?.data ?? [],
      providesTags: ["FarmTypes"],
    }),
  }),
});

export const { useListFarmTypesQuery } = lookupsApi;
