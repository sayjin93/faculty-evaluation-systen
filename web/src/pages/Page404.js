import React from "react";
import { CButton, CCol, CContainer, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilHome } from "@coreui/icons";
import { useTranslation } from "react-i18next";

const Page404 = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">{t("Oops!You'reLost")}.</h4>
              <p className="text-medium-emphasis float-start">
                {t("ThePageYouAreLookingForWasNotFound")}.
              </p>
            </div>
            <CButton shape="rounded-pill" href="/" color="primary">
              <CIcon icon={cilHome} /> {t("BackToHomepage")}
            </CButton>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
