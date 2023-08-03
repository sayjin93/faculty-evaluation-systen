import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "src/hooks";
import useAuthToken from "src/hooks/token";

const PublicRoute = ({ children }) => {
  const jwtToken = useAuthToken();

  if (isNullOrUndefined(jwtToken)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
