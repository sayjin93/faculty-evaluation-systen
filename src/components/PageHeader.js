import { CButton, CContainer, CHeader, CHeaderBrand } from "@coreui/react";
import React from "react";
import { useTranslation } from "react-i18next";

const PageHeader = (props) => {
  //#region constants
  const { title, component } = props;
  const { t } = useTranslation();
  //#endregion

  //#region functions
  const handleAdd = (component) => {
    alert("Add button from page " + component + " clicked");
  };
  //#endregion

  return (
    <CHeader>
      <CContainer fluid>
        <CHeaderBrand>{title}</CHeaderBrand>

        <CButton color="dark" onClick={() => handleAdd(component)}>
          {t("Add")}
        </CButton>
      </CContainer>
    </CHeader>
  );
};

export default PageHeader;
