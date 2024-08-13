import { useDispatch } from "react-redux";
import { showToast, setFirstLogin } from "../store";

const useErrorHandler = () => {
  const dispatch = useDispatch();

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
      // Dispatches a Redux action to show a danger toast with the error message or status text.
      dispatch(
        showToast({
          type: "danger",
          content: error.response.data,
        })
      );

      // Dispatches a Redux action to set the 'firstLogin' flag to true.
      dispatch(setFirstLogin(true));
    }
    else {
      dispatch(
        showToast({
          type: "danger",
          content: error.message,
        })
      );
    }
  };

  return handleError;
};

export default useErrorHandler;
