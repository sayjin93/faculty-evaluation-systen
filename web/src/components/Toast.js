import React from "react";
import { CToaster, CToast, CToastBody, CToastClose } from "@coreui/react";

const ToastComponent = ({ type, content, visible, onClose }) => {
  return (
    <CToaster placement="bottom-end">
      <CToast
        visible={visible}
        color={type}
        className="text-white align-items-center"
        onClose={onClose}
      >
        <div className="d-flex">
          <CToastBody>{content}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    </CToaster>
  );
};
export default ToastComponent;
