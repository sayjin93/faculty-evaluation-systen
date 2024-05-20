import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getIsAdmin } from "src/store/selectors";

const PrivateAdmin = ({ children }) => {
    const jwtToken = localStorage.getItem("jwt_token");
    const isAdmin = useSelector(getIsAdmin);

    if (!jwtToken) {
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default PrivateAdmin;
