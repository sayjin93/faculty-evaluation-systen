import { Navigate } from "react-router-dom";
import useAuthToken from "src/hooks/token";

const Public = ({ children }) => {
  const jwtToken = useAuthToken();

  if (jwtToken) {
    // User is authenticated, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default Public;
