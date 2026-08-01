import { baseQuery } from "@/lib/api";
import { createApi } from "@reduxjs/toolkit/query/react";
import { transformGetFarmTypesResponse } from "../farm-type-utils";

export const farmTypeApi = createApi({
  reducerPath: "farmTypeApi",
  baseQuery: baseQuery,
  tagTypes: ["FarmType"],
  endpoints: (builder) => ({
    getFarmTypes: builder.query({
      query: () => "/farm-types",
      providesTags: ["FarmType"],
      transformResponse: transformGetFarmTypesResponse,
    }),
  }),
});

export const { useGetFarmTypesQuery } = farmTypeApi;
