import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
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
import { cilLockLocked, cifAl, cifGb } from "@coreui/icons";

//hooks
import { convertToKey, setCookie } from "src/hooks";
import api from "src/hooks/api";

//store
import { showToast } from "src/store";

const ResetToken = () => {
  //#region constants
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  //#endregion

  //#region states
  const [state, setState] = useState({
    view: 1,
    newPassword: "",
    retypePassword: ""
  });
  //#endregion

  //#region functions
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setCookie({
      name: "language",
      value: language,
      options: { path: "/", sameSite: "strict" },
    });
  };

  const handleInputChange = (event, fieldName) => {
    setState({
      ...state,
      [fieldName]: event.target.value,
    });
  };

  const validateToken = async (resetToken) => {
    await api
      .get(`/reset/${resetToken}`)
      .then(() => {
        setState(prevState => {
          return { ...prevState, view: 2 }; // Change the view property to 2, keep other properties unchanged
        });
      })
      .catch((error) => {
        const { data, status } = error.response;
        dispatch(
          showToast({
            type: "danger",
            content: status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );
      })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.newPassword === "" || state.retypePassword === "") {
      dispatch(
        showToast({
          type: "warning",
          content: t("PleaseFillTheFormWithNewPassword")
        })
      );
      return;
    }
    if (state.newPassword !== state.retypePassword) {
      dispatch(
        showToast({
          type: "danger",
          content: t("PasswordDoesNotMatch"),
        })
      );
      return
    }

    await api
      .post(`/reset/${token}`, {
        password: state.newPassword
      })
      .then((response) => {
        // Redirect the user to the login page
        navigate("/login", { replace: true });

        // Show toast with success message
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message))
          })
        );
      })
      .catch((error) => {
        const { data, status } = error.response;
        dispatch(
          showToast({
            type: "danger",
            content: status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );
      })
  };
  //#endregion

  //#region useEffect
  useEffect(() => {

    //validateToken
    validateToken(token);

    const keyUpHandler = (event) => {
      if (event.key === "Enter") {
        const el = document.getElementById("BtnReset");
        el.click();
      }
    };
    if (state.view === 2) {
      document.addEventListener("keyup", keyUpHandler);
    }

    return () => {
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);
  //#endregion

  if (state.view === 2) {
    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="p-4">
                <CCardBody className="p-4">
                  <h1>{t("ResetPassword")}</h1>
                  <p className="text-medium-emphasis">
                    {t("EnterYourNewPasswordBelow")}
                  </p>

                  <CForm onSubmit={handleSubmit}>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type="password"
                        placeholder={t("NewPassword")}
                        value={state.newPassword}
                        onChange={(event) => handleInputChange(event, "newPassword")}
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type="password"
                        placeholder={t("RetypePassword")}
                        value={state.retypePassword}
                        onChange={(event) => handleInputChange(event, "retypePassword")}
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          id="BtnReset"
                          color="primary"
                          className="px-4"
                        >
                          {t("Reset")}
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
                              onClick={() => handleLanguageChange("sq")}
                            >
                              <CIcon icon={cifAl} />
                              <span className="ms-2">Shqip</span>
                            </CDropdownItem>
                            <CDropdownItem
                              onClick={() => handleLanguageChange("en")}
                            >
                              <CIcon icon={cifGb} />
                              <span className="ms-2">English</span>
                            </CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CCol>
                    </CRow>
                  </CForm>
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
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody className="p-4">
                <h1 className="text-center mb-3">{t("AnErrorOccured")}!</h1>

                <CAlert color="danger" className="text-center mb-3">
                  {t("InvalidOrExpiredToken")}
                </CAlert>

                <CRow>
                  <CCol xs={6}>
                    <Link to="/login">
                      <CButton color="link">
                        {t("BackToLogin") + "?"}
                      </CButton>
                    </Link>
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
                          onClick={() => handleLanguageChange("sq")}
                        >
                          <CIcon icon={cifAl} />
                          <span className="ms-2">Shqip</span>
                        </CDropdownItem>
                        <CDropdownItem
                          onClick={() => handleLanguageChange("en")}
                        >
                          <CIcon icon={cifGb} />
                          <span className="ms-2">English</span>
                        </CDropdownItem>
                      </CDropdownMenu>
                    </CDropdown>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetToken;
