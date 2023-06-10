import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { CToaster, CToast, CToastBody, CToastClose } from "@coreui/react";
import { hideToast } from "../store/slices/toastSlice";

const ToastComponent = ({ type, content, visible }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        dispatch(hideToast());
      }, 3000); // hide toast after 3 seconds
    }
  }, [visible, dispatch]);

  if (!visible) {
    return null;
  }

  return (
    <CToaster placement="bottom-end">
      <CToast
        visible={visible}
        color={type}
        className="text-white align-items-center"
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
