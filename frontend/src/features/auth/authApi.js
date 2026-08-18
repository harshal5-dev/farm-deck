import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery, transformResult } from "@/lib/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  refetchOnReconnect: true,
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

    isAuthenticated: builder.query({
      query: () => ({ url: "/auth/is-authenticated", method: "GET" }),
      transformResponse: transformResult,
      refetchOnMountOrArgsChange: true,
      keepUnusedDataFor: 0,
    }),

    verifyInvitation: builder.query({
      query: (token) => ({
        url: "/auth/verify-invitation",
        method: "GET",
        params: { token },
      }),
      transformResponse: transformResult,
    }),

    acceptInvitation: builder.mutation({
      query: ({ token, password }) => ({
        url: "/auth/accept-invitation",
        method: "POST",
        body: { token, password },
      }),
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
  useIsAuthenticatedQuery,
  useRefreshMutation,
  useVerifyInvitationQuery,
  useLazyVerifyInvitationQuery,
  useAcceptInvitationMutation,
} = authApi;
