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

import { useDispatch } from "react-redux";
import { showToast } from "src/store";

const Register = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [user, setUser] = useState({
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
      // Send a POST request to the '/api/users' endpoint with the user data
      await axios
        .post("users", {
          username: user.username,
          email: user.email,
          password: user.password,
        })
        .then((response) => {
          // Handle the success response
          dispatch(
            showToast({
              type: "success",
              content: t("AccountCreatedSuccesfully"),
            })
          );

          setUser((prevState) => ({
            ...prevState,
            username: "",
            email: "",
            password: "",
            repeatPassword: "",
          }));
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
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleRegister}>
                  <h1>{t("Register")}</h1>
                  <p className="text-medium-emphasis">
                    {t("CreateYourAccount")}
                  </p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="text"
                      placeholder={t("Username")}
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
                      placeholder={t("Email")}
                      value={user.email}
                      size="sm"
                      onChange={(event) => handleInputChange(event, "email")}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("Password")}
                      value={user.password}
                      onChange={(event) => handleInputChange(event, "password")}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      autoComplete="new-password"
                      placeholder={t("RepeatPassword")}
                      value={user.repeatPassword}
                      onChange={(event) =>
                        handleInputChange(event, "repeatPassword")
                      }
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton color="success" type="submit">
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
      </CContainer>
    </div>
  );
};

export default Register;
