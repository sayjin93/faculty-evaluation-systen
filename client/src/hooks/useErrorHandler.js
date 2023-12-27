import { useDispatch, batch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { showToast, setFirstLogin } from "../store";

const useErrorHandler = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleError = (error) => {
    if (error.code === "ERR_NETWORK") {
      // Dispatches a Redux action to show a danger toast with the error message.
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

      // Dispatches multiple Redux actions in a batch to update the state.
      batch(() => {
        // Dispatches a Redux action to show a danger toast with the error message or status text.
        dispatch(
          showToast({
            type: "danger",
            content: error.response.data,
          })
        );

        // Dispatches a Redux action to set the 'firstLogin' flag to true.
        dispatch(setFirstLogin(true));
      });
    }
    else {
      dispatch(
        showToast({
          type: "danger",
          content: error,
        })
      );
    }
  };

  return handleError;
};

export default useErrorHandler;
