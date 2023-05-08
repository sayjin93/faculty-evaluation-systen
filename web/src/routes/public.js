import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks";
import { token } from "src/constants";

const PublicRoute = ({ children }) => {
  if (isNullOrUndefined(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
