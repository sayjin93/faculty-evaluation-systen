import React from "react";
import { useDispatch } from "react-redux";

//coreUI
import { CToaster, CToast, CToastBody, CToastClose } from "@coreui/react";

//store
import { hideToast } from "../store/slices/toastSlice";

const ToastComponent = ({ type, content, visible }) => {
  //#region constants
  const dispatch = useDispatch();
  //#endregion

  //#region functions
  const closeToast = () => {
    dispatch(hideToast());
  };
  //#endregion

  if (!visible) return null;

  return (
    <CToaster placement="bottom-end">
      <CToast
        visible={visible}
        color={type}
        className="text-white align-items-center"
        onClose={closeToast}
      >
        <div className="d-flex">
          <CToastBody>
            <>{content}</>
          </CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    </CToaster>
  );
};
export default ToastComponent;
