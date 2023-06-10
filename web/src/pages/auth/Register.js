import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

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
import { useTranslation } from "react-i18next";

import ToastComponent from "src/components/Toast";

const Register = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [toast, setToast] = useState({
    color: "",
    content: "",
    visible: false,
  });
  //#endregion

  //#region functions
  const callToast = (color, content, visible) => {
    setToast({
      color: color,
      content: content,
      visible: visible,
    });
  };

  const handleRegister = async () => {
    try {
      // Send a POST request to the '/api/users' endpoint with the user data
      await axios
        .post(process.env.REACT_APP_API_URL + "/users", {
          username: user.username,
          email: user.email,
          password: user.password,
        })
        .then((response) => {
          // Handle the success response
          callToast("success", "Account created succesfully!", true);

          setUser((prevState) => ({
            ...prevState,
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
          }));
        });
    } catch (error) {
      // Handle any errors
      callToast("danger", error.response.data.message, true);
    }
  };
  //#endregion

  const isCreateAccountDisabled =
    user.username === "" ||
    user.email === "" ||
    user.password === "" ||
    user.password !== user.repeatPassword;

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>{t("Register")}</h1>
                  <p className="text-medium-emphasis">
                    {t("CreateYourAccount")}
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder={t("Username")}
                      value={user.username}
                      onChange={(e) => {
                        setUser((prevState) => ({
                          ...prevState,
                          username: e.target.value,
                        }));
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      type="email"
                      placeholder={t("Email")}
                      value={user.email}
                      size="sm"
                      onChange={(e) => {
                        setUser((prevState) => ({
                          ...prevState,
                          email: e.target.value,
                        }));
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t("Password")}
                      value={user.password}
                      onChange={(e) => {
                        setUser((prevState) => ({
                          ...prevState,
                          password: e.target.value,
                        }));
                      }}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder={t("RepeatPassword")}
                      value={user.repeatPassword}
                      onChange={(e) => {
                        setUser((prevState) => ({
                          ...prevState,
                          repeatPassword: e.target.value,
                        }));
                      }}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      color="success"
                      disabled={isCreateAccountDisabled}
                      onClick={handleRegister}
                    >
                      {t("CreateAccount")}
                    </CButton>
                  </div>
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
        <CRow>
          <CCol xs={6} className="text-right"></CCol>
        </CRow>
      </CContainer>

      <ToastComponent
        type={toast.color}
        content={toast.content}
        visible={toast.visible}
      />
    </div>
  );
};

export default Register;
