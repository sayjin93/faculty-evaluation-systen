import React from "react";
import { useTranslation } from "react-i18next";
import { CContainer, CHeader, CHeaderBrand } from "@coreui/react";

const Reports = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Reports")}</CHeaderBrand>
        </CContainer>
      </CHeader>

      <p>Work in progress</p>
    </>
  );
};

export default Reports;
