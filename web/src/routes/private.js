import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks/helpers";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("jwt_token");

  if (!isNullOrUndefined(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
