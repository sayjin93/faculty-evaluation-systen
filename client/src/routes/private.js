import React from "react";
import { Navigate } from "react-router-dom";

const Private = ({ children }) => {
  const jwtToken = localStorage.getItem("jwt_token");

  return !jwtToken ? <Navigate to="/login" replace /> : children;
};

export default Private;
