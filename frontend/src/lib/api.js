import { fetchBaseQuery } from "@reduxjs/toolkit/query";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:8083/api/v1",
  credentials: "include",
});

export const baseQuery = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);
  return result;
};
