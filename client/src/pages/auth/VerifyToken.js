import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

//icons
import { IoIosArrowRoundBack } from "react-icons/io";

//hooks
import api from "src/hooks/api";
import { convertToKey } from "src/hooks";

const VerifyToken = () => {
  //#region constants
  const { t } = useTranslation();
  const { token } = useParams();
  const navigate = useNavigate();
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
        setMessage(t(convertToKey(response.data.message)));
        setIsLoading(false);
      })
      .catch((error) => {
        setStatus(false);
        setMessage(error.response ? t(convertToKey(error.response.data.message)) : t('AnErrorOccured'));
        setIsLoading(false);
      });

  }, [token]);
  //#endregion

  if (isLoading) {
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
              <CCardBody >
                <h4 className="text-center mb-3">{t("AccountVerification")}</h4>

                <CAlert className="text-center" color={status ? "success" : "danger"}>
                  {message}
                </CAlert>

                <CButton color="link" size="sm" className="mt-4 d-block mx-auto" onClick={() => navigate("/login")}>
                  <IoIosArrowRoundBack /> {t("BackToLogin")}
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default VerifyToken;
