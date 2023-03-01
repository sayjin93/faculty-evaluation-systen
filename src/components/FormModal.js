import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import FormBuilder from "./FormBuilder";

const FormModal = ({ visible, setVisible, component }) => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>
        <CModalTitle>
          {t("Add") + " " + t("new") + " " + t(component)}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        <FormBuilder />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton color="primary">{t("Add")}</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default FormModal;
