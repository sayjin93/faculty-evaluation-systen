import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CRow,
  CSpinner,
} from "@coreui/react";

//hooks
import api from "src/hooks/api";

const VerifyToken = () => {
  //#region constants
  const { t } = useTranslation();
  const { token } = useParams();
  //#endregion

  //#region states
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  //#endregion

  //#region useEffect
  useEffect(() => {
    api.get(`/verify/${token}`)
      .then((response) => {
        setStatus(true);
        setMessage(response.data.message);
        setIsLoading(false);
      })
      .catch((error) => {
        setStatus(false);
        setMessage(error.response ? error.response.data.message : 'An error occurred');
        setIsLoading(false);
      });

  }, [token]);
  //#endregion

  if (isLoading) {
    debugger;
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    )
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody className="p-4">
                <h1 className="text-center mb-3">{t("AccountVerification")}</h1>

                <CAlert className="text-center" color={status ? "success" : "danger"}>
                  {message}
                </CAlert>

                <Link to="/login">
                  <CButton color="link" className="mt-4 d-block mx-auto">
                    {t("BackToLogin") + "?"}
                  </CButton>
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default VerifyToken;
