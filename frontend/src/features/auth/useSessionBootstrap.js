import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, selectIntentionalLogout, setCredentials } from "./authSlice";
import { useGetProfileQuery } from "../profile";


export function useSessionBootstrap({ skipQuery = false }) {
  const dispatch = useDispatch();
  const intentionalLogout = useSelector(selectIntentionalLogout);
  const skip = intentionalLogout || skipQuery;

  const { data = {}, isLoading, isSuccess, isError } = useGetProfileQuery(undefined, { skip });

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCredentials(data));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [isSuccess, isError, data, dispatch]);

  return { isLoading, isError };
}
