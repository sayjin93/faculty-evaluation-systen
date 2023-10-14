import { useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showToast, setFirstLogin } from "../store";

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

      batch(() => {
        dispatch(
          showToast({
            type: "danger",
            content: error.response.statusText,
          })
        );

        dispatch(setFirstLogin(true));
      });
    }
  };

  return handleError;
};

export default useErrorHandler;
