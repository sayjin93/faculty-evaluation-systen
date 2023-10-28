import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { convertToKey, setCookie } from "src/hooks";
import { setUser, showToast } from "../../store";

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
import api from "src/hooks/api";

const LoginPage = () => {
  //#region constants
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    await api
      .post("/login", {
        username: formData.username,
        password: formData.password,
      })
      .then((response) => {
        const { user, token } = response.data;
        // Set the JWT token to the Local Storage
        localStorage.setItem("jwt_token", token);

        // Set leggedUser into redux store
        const loggedUser = {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          username: user.username,
          email: user.email,
        };
        dispatch(setUser(loggedUser));

        // Navigate to Dashboard
        navigate("/", { replace: true });
      })
      .catch((error) => {
        if (error.response) {
          const { data, status } = error.response;

          dispatch(
            showToast({
              type: "danger",
              content: status !== 500 ? t(convertToKey(data.message)) : data.message,
            })
          );

        }
        else {
          dispatch(
            showToast({
              type: "danger",
              content: error.message,
            })
          );

        }
      })
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
                  <CForm onSubmit={handleSubmit}>
                    <h1>{t("Login")}</h1>
                    <p className="text-medium-emphasis">
                      {t("SignInToYourAccount")}
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type="text"
                        placeholder={
                          t("Username") + " " + t("Or") + " " + t("Email")
                        }
                        autoComplete="username"
                        value={formData.username}
                        onChange={(event) =>
                          handleInputChange(event, "username")
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type="password"
                        placeholder={t("Password")}
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={(event) =>
                          handleInputChange(event, "password")
                        }
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          type="submit"
                          id="BtnLogin"
                          color="primary"
                          className="px-4"
                        >
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
                      <CCol xs={12} className="text-center">
                        <CButton disabled color="link" className="pt-4">
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
