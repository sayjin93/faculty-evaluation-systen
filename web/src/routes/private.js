import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks";
import { token } from "src/constants";

const PrivateRoute = ({ children }) => {
  if (!isNullOrUndefined(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
