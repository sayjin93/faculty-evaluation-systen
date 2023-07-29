import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showToast } from "../store";

const useErrorHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleError = (error) => {
    if (error.code === "ERR_NETWORK") {
      dispatch(
        showToast({
          type: "danger",
          content: error.message,
        })
      );
    } else if (error.code === "ERR_BAD_REQUEST") {
      // Remove the JWT token from the Local Storage
      localStorage.removeItem("jwt_token");

      // Redirect the user to the login page
      navigate("/login", { replace: true });

      // Show alert
      dispatch(
        showToast({
          type: "danger",
          content: error.response.statusText,
        })
      );
    }
  };

  return handleError;
};

export default useErrorHandler;
