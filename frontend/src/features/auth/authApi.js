import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, transformResult } from "@/lib/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: {
          emailId: credentials.emailId,
          password: credentials.password,
        },
      }),
      transformResponse: transformResult,
    }),

    refresh: builder.mutation({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      transformResponse: transformResult,
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: transformResult,
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
