import React from "react";
import { Navigate } from "react-router-dom";

const Public = ({ children }) => {
  const jwtToken = localStorage.getItem("jwt_token");
  // validate token jwt in react package or nodejs

  return jwtToken ? <Navigate to="/" replace /> : children;
};

export default Public;
