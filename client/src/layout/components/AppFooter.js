import React from "react";
import { useTranslation } from "react-i18next";

//coreUI
import { CCol, CFooter } from "@coreui/react";
import { Link } from "react-router-dom";


const AppFooter = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  return (
    <CFooter className="justify-content-end">
      <CCol>
        Copyright &copy; {new Date().getFullYear()}
      </CCol>

      <CCol className="text-end">
        <span className="me-1">{t("DevelopedBy")}</span>
        <Link target="_blank" to="https://jkruja.com" rel="noopener noreferrer">Jurgen Kruja</Link>
      </CCol>

    </CFooter >
  );
};

export default React.memo(AppFooter);
