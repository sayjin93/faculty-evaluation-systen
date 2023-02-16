import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { setCookie } from "src/hooks/helpers";

import { login } from "../../store/reducers/authenticationSlice";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser, cifAl, cifGb } from "@coreui/icons";

const LoginPage = () => {
  //#region redux
  const dispatch = useDispatch();
  //#endregion

  //#region constants
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  //#endregion

  //#region functions
  const handleLanguageChange = (language) => {
    debugger;
    i18n.changeLanguage(language);
    setCookie({
      key: "language",
      value: language,
      options: { path: "/" },
    });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        const el = document.getElementById("BtnLogin");
        el.click();
      }
    };
    document.addEventListener("keydown", keyDownHandler);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    onSubmit={() =>
                      // dispatch(
                      //   login({
                      //     email: "eve.holt@reqres.in",
                      //     password: "cityslicka",
                      //   })
                      // )
                      alert("nuk eshte bere ende auth")
                    }
                  >
                    <h1>{t("Login")}</h1>
                    <p className="text-medium-emphasis">
                      {t("SignInToYourAccount")}
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder={t("Username")}
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder={t("Password")}
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton id="BtnLogin" color="primary" className="px-4">
                          {t("Login")}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <CDropdown>
                          <CDropdownToggle color="light">
                            {i18n.language === "sq" ? (
                              <>
                                <CIcon icon={cifAl} />
                                <span className="ms-2">Shqip</span>
                              </>
                            ) : (
                              <>
                                <CIcon icon={cifGb} />
                                <span className="ms-2">English</span>
                              </>
                            )}
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem
                              onClick={()=>handleLanguageChange("sq")}
                            >
                              <CIcon icon={cifAl} />
                              <span className="ms-2">Shqip</span>
                            </CDropdownItem>
                            <CDropdownItem onClick={()=>handleLanguageChange("en")}>
                              <CIcon icon={cifGb} />
                              <span className="ms-2">English</span>
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CCol>
                      <CCol xs={12} className="text-center">
                        <CButton color="link" className="pt-4">
                          {t("ForgotPassword") + "?"}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5">
                <CCardBody className="text-center">
                  <div>
                    <h2>{t("SignUp")}</h2>
                    <p className="pt-4">
                      {t(
                        "RegisterNowByClickingButtonBelowToHaveAccessInTheFacultyEvaluationSystem"
                      )}
                    </p>

                    <CButton
                      color="primary"
                      className="mt-3"
                      active
                      tabIndex={-1}
                      onClick={() => navigate("/register")}
                    >
                      {t("RegisterNow")} !
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginPage;
