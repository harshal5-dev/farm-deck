import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, selectIntentionalLogout, setAuthLoading, setCredentials } from "./authSlice";
import { useGetProfileQuery } from "../profile";


export function useSessionBootstrap({ skipQuery = false }) {
  const dispatch = useDispatch();
  const intentionalLogout = useSelector(selectIntentionalLogout);
  // TEMP DEV BYPASS (remove before shipping) — don't probe the backend
  // profile endpoint when a dev_user session was injected.
  const devBypass =
    import.meta.env.DEV && !!sessionStorage.getItem("dev_user");
  const skip = devBypass || intentionalLogout || skipQuery;

  const { data, isLoading, isSuccess, isError } = useGetProfileQuery(
    undefined,
    { skip }
  );

  useEffect(() => {
    dispatch(setAuthLoading(isLoading));
    if (isSuccess && data) {
      dispatch(setCredentials(data));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [isLoading, isSuccess, isError, data, dispatch]);

  return { isLoading, isError };
}
