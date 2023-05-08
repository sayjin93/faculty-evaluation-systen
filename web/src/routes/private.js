import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "src/hooks";
import useAuthToken from "../hooks/token";

const PrivateRoute = ({ children }) => {
  const jwtToken = useAuthToken();

  if (!isNullOrUndefined(jwtToken)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
