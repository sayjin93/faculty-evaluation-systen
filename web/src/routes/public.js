import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks";
import useAuthToken from "../hooks/token";

const PublicRoute = ({ children }) => {
  const jwtToken = useAuthToken();

  if (isNullOrUndefined(jwtToken)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
