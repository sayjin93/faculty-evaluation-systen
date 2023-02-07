import React from "react";
import { Navigate } from "react-router-dom";
import { getCookie, isNullOrUndefined } from "../hooks/helpers";

let token = getCookie({ key: "jwt_token" });
token = "dhfbdfdf"; //temporary

let pathName = window.location.pathname;
let location = pathName.split("/")[1];
const signedIn =
  isNullOrUndefined(token) && location.includes("signin") ? true : false;

const PublicRoute = ({ children }) => {
  if (signedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default PublicRoute;
