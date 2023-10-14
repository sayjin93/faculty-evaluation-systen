import { Navigate } from "react-router-dom";

import useAuthToken from "src/hooks/token";

const Private = ({ children }) => {
  const jwtToken = useAuthToken();

  if (!jwtToken) {
    // User is not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Private;
