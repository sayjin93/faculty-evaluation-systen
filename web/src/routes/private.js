import React from "react";
import { Navigate } from "react-router-dom";
import { isNullOrUndefined } from "../hooks/helpers";

let token = localStorage.getItem("jwt_token");

const PrivateRoute = ({ children }) => {
  if (!isNullOrUndefined(token)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default PrivateRoute;
