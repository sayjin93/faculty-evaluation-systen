import { Navigate } from "react-router-dom";

import useAuthToken from "src/hooks/token";

const Private = ({ children }) => {
  const jwtToken = useAuthToken();

  return !jwtToken ? <Navigate to="/login" replace /> : children;
};

export default Private;
