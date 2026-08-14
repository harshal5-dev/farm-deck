import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/api";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    createMember: builder.mutation({
      query: (profile) => ({
        url: "/users/members",
        method: "POST",
        body: profile,
      }),
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useCreateMemberMutation,
} = memberApi;
