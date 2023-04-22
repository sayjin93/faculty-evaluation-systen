import React from "react";
import { useTranslation } from "react-i18next";
import { CContainer, CHeader, CHeaderBrand, CTable } from "@coreui/react";

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

      <CTable responsive striped hover align="middle">
        <p>Work in progress</p>
      </CTable>
    </>
  );
};

export default Reports;
