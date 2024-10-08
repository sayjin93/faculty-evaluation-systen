import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

//icons
import { cilUser } from "@coreui/icons";
import { IoIosArrowRoundBack } from "react-icons/io";

//hooks
import api from "src/hooks/api";
import { convertToKey, getCookie } from "src/hooks";

//store
import { showToast } from "src/store";

//components
import LanguagesDropdown from "src/components/LanguagesDropdown";

const Reset = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region functions
  const handleInputChange = (event) => {
    setUser(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (user === "") {
      dispatch(
        showToast({
          type: "warning",
          content: t("PleaseWriteYourUsernameOrEmail"),
        })
      );
      return;
    }

    const language = getCookie({ name: "language" });
    const languageCookie = language || "en";

    setIsLoading(true);

    await api
      .post("/reset", {
        username: user.toLowerCase(),
        language: languageCookie,
      })
      .then((response) => {
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message)),
          })
        );

        setUser("");
      })
      .catch((error) => {
        if (error.response.data) {
          dispatch(
            showToast({
              type: "danger",
              content: t(convertToKey(error.response.data.message)),
            })
          );
        } else {
          dispatch(
            showToast({
              type: "danger",
              content: error.message,
            })
          );
        }
      });

    setIsLoading(false);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const keyUpHandler = (event) => {
      if (event.key === "Enter") {
        const el = document.getElementById("BtnReset");
        el.click();
      }
    };
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody>
                <h4>{t("ResetPassword")}</h4>
                <p className="my-4" style={{ fontSize: "0.9em" }}>
                  {t("EnterYourUsernameOrEmailBelowToTesetYourPassword")}
                </p>

                <CForm onSubmit={handleSubmit}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder={
                        t("Username") + " " + t("Or") + " " + t("Email")
                      }
                      value={user}
                      onChange={(event) => handleInputChange(event)}
                    />
                  </CInputGroup>
                  <CRow className="mb-4">
                    <CCol xs={6}>
                      <CButton
                        disabled={isLoading}
                        type="submit"
                        id="BtnReset"
                        color="primary"
                        className="px-4"
                      >
                        {isLoading ? (
                          <CSpinner color="light" size="sm" />
                        ) : (
                          t("Reset")
                        )}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
                      <LanguagesDropdown />
                    </CCol>
                  </CRow>
                </CForm>

                <CButton
                  color="link"
                  size="sm"
                  className="d-block mx-auto"
                  onClick={() => navigate("/login")}
                >
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

export default Reset;
