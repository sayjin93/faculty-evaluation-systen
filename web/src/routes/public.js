import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie, isNullOrUndefined } from "../hooks/helpers";

let token = getCookie({ key: "jwt_token" });

const PublicRoute = ({ children }) => {
  if (isNullOrUndefined(token)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
export default PublicRoute;
