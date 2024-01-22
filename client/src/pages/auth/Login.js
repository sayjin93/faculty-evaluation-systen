import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";

//icons
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";

//store
import { setUser, showToast } from "src/store";

//components
import LanguagesDropdown from "src/components/LanguagesDropdown";

const Login = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState(false);
  //#endregion

  //#region functions
  const handeViewPassStateChange = () => {
    setViewPass(!viewPass);
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

    setIsLoading(true);

    await api
      .post("/login", {
        username: formData.username.toLowerCase(),
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
          gender: user.gender,
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
              type: status !== 500 ? "warning" : "danger",
              content:
                status !== 500 ? t(convertToKey(data.message)) : data.message,
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
        const el = document.getElementById("BtnLogin");
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
                        type={viewPass ? "text" : "password"}
                        placeholder={t("Password")}
                        value={formData.password}
                        onChange={(event) =>
                          handleInputChange(event, "password")
                        }
                      />
                      <CButton
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={handeViewPassStateChange}
                      >
                        {viewPass ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </CButton>
                    </CInputGroup>
                    <CRow className="flex-align-center">
                      <CCol xs={6}>
                        <CButton
                          disabled={isLoading}
                          type="submit"
                          id="BtnLogin"
                          color="primary"
                          className="px-4"
                        >
                          {isLoading ? (
                            <CSpinner color="light" size="sm" />
                          ) : (
                            t("Login")
                          )}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <LanguagesDropdown />
                      </CCol>
                      <CCol xs={12} className="text-center">
                        <CButton
                          color="link"
                          className="pt-4"
                          onClick={() => navigate("/reset")}
                        >
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

export default Login;
