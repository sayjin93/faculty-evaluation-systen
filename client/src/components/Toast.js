import React from "react";
import { useDispatch } from "react-redux";
import { CToaster, CToast, CToastBody, CToastClose } from "@coreui/react";
import { hideToast } from "../store/slices/toastSlice";

const ToastComponent = ({ type, content, visible }) => {
  const dispatch = useDispatch();

  const closeToast = () => {
    dispatch(hideToast());
  };

  if (!visible) {
    return null;
  }

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