import { Navigate } from "react-router-dom";
import useAuthToken from "src/hooks/token";

const Public = ({ children }) => {
  const jwtToken = useAuthToken();

  return jwtToken ? <Navigate to="/" replace /> : children;
};

export default Public;
