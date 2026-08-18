import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCredentials, selectIntentionalLogout, setIsAuthenticated } from "./authSlice";
import { useIsAuthenticatedQuery } from "./authApi";


export function useSessionBootstrap() {
  const dispatch = useDispatch();
  const intentionalLogout = useSelector(selectIntentionalLogout);
  const skip = intentionalLogout;

  const { data = {}, isLoading, isSuccess, isError } = useIsAuthenticatedQuery(undefined, { skip });
  const { isAuthenticated: isAuthenticatedFromServer = false } = data;

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setIsAuthenticated(isAuthenticatedFromServer));
    } else if (isError) {
      dispatch(clearCredentials());
    }
  }, [isSuccess, isError, data, dispatch, isAuthenticatedFromServer]);

  return { isLoading, isError };
}
