import React from "react";
import { Navigate } from "react-router-dom";

let token = localStorage.getItem("jwt_token");
let isTokenValid = "code here to validate token";

const PrivateRoute = ({ children }) => {
  if (isTokenValid === "false") {
    return <Navigate to="/login" replace />;
  }
  return children;
};
export default PrivateRoute;
