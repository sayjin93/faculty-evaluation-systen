import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks/helpers";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  if (isNullOrUndefined(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
