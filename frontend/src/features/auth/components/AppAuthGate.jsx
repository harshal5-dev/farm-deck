import { useSelector } from "react-redux";
import { selectIntentionalLogout } from "../authSlice";
import { useSessionBootstrap } from "../useSessionBootstrap";


const AppAuthGate = ({ children }) => {
  const intentionalLogout = useSelector(selectIntentionalLogout);
  useSessionBootstrap({ skipQuery: intentionalLogout });
  return children;
};

export default AppAuthGate;
