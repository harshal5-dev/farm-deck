import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "@/lib/api";

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
      transformResponse: (response) => response?.data,
    }),

    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      transformResponse: (response) => response?.data,
    }),

    refresh: builder.mutation({
      query: () => ({ url: "/auth/refresh", method: "POST" }),
      transformResponse: (response) => response?.data,
    }),

  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
} = authApi;
