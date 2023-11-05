import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

//hooks
import api from "src/hooks/api";
import { capitalizeWords } from "src/hooks"

//store
import { showToast } from "src/store";

const Register = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  //#endregion

  //#region functions
  const handleInputChange = (event, fieldName) => {
    setUser({
      ...user,
      [fieldName]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (user.password !== user.repeatPassword) {
      dispatch(
        showToast({
          type: "danger",
          content: t("PasswordDoesNotMatch"),
        })
      );
    } else {
      await api
        .post("/register", {
          first_name: capitalizeWords(user.firstName),
          last_name: capitalizeWords(user.lastName),
          username: user.username,
          email: user.email,
          password: user.password,
        })
        .then((response) => {
          // Redirect the user to the login page
          navigate("/login", { replace: true });

          // Handle the success response
          dispatch(
            showToast({
              type: "success",
              content: t("AccountCreatedSuccesfully"),
            })
          );
        })
        .catch((error) => {
          if (error.response) {
            dispatch(
              showToast({
                type: "danger",
                content: error.response.data.message,
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
    }
  };
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={7}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <h1>{t("Register")}</h1>
                <p className="text-medium-emphasis">{t("CreateYourAccount")}</p>

                <CForm onSubmit={handleRegister}>

                  <CRow>
                    <CCol md={6} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          autoComplete="first-name"
                          placeholder={t("FirstName")}
                          value={user.firstName}
                          onChange={(event) => handleInputChange(event, "firstName")}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          autoComplete="last-name"
                          placeholder={t("LastName")}
                          value={user.lastName}
                          onChange={(event) =>
                            handleInputChange(event, "lastName")
                          }
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="text"
                      placeholder={t("Username") + "*"}
                      value={user.username}
                      onChange={(event) => handleInputChange(event, "username")}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      required
                      type="email"
                      autoComplete="email"
                      placeholder={t("Email") + "*"}
                      value={user.email}
                      size="sm"
                      onChange={(event) => handleInputChange(event, "email")}
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol md={6} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          required
                          type="password"
                          autoComplete="new-password"
                          placeholder={t("Password") + "*"}
                          value={user.password}
                          onChange={(event) => handleInputChange(event, "password")}
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol md={6} className="mb-3">
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          required
                          type="password"
                          autoComplete="new-password"
                          placeholder={t("RepeatPassword") + "*"}
                          value={user.repeatPassword}
                          onChange={(event) =>
                            handleInputChange(event, "repeatPassword")
                          }
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <CInputGroup className="mb-3">
                    <CButton color="success" type="submit" className="w-100">
                      {t("CreateAccount")}
                    </CButton>
                  </CInputGroup>
                </CForm>
                <Link to="/login">
                  <CButton color="link" className="d-block mx-auto">
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

export default Register;