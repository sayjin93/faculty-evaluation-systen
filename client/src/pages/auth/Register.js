import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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
  CListGroup,
  CListGroupItem,
  CRow,
  CSpinner,
} from "@coreui/react";

//icons
import CIcon from "@coreui/icons-react";

import { cilLockLocked, cilUser } from "@coreui/icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

//hooks
import api from "src/hooks/api";
import { capitalizeWords } from "src/hooks";
import CheckCriteria from "src/hooks/checkCriteria";

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
  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState({
    new: false,
    retype: false,
  });
  const [passwordCriteria, setPasswordCriteria] = useState({
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
    minLength: false,
  });
  //#endregion

  //#region functions
  const checkPasswordCriteria = (password) => {
    setPasswordCriteria({
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 8,
    });
  };

  const handleInputChange = (event, fieldName) => {
    const inputValue = event.target.value;

    setUser({
      ...user,
      [fieldName]: inputValue,
    });

    if (fieldName === "password") checkPasswordCriteria(inputValue);
  };

  const handeViewPassStateChange = (key, value) => {
    setViewPass((prevState) => {
      return {
        ...prevState,
        [key]: !value,
      };
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (
      !passwordCriteria.lowercase ||
      !passwordCriteria.uppercase ||
      !passwordCriteria.number ||
      !passwordCriteria.specialChar ||
      !passwordCriteria.minLength
    ) {
      dispatch(
        showToast({
          type: "danger",
          content: t("PasswordCriteriaNotMet"),
        })
      );

      //scroll to criteria list
      const element = document.getElementById("passwordCriteria");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else if (user.password !== user.repeatPassword) {
      dispatch(
        showToast({
          type: "danger",
          content: t("PasswordDoesNotMatch"),
        })
      );
    } else {
      setIsLoading(true);

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

      setIsLoading(false);
    }
  };
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h3>{t("Register")}</h3>

                  <p className="text-medium-emphasis">
                    {t("CreateYourAccountByFillingTheFormBelow")}
                  </p>

                  <CForm onSubmit={handleRegister}>
                    <CRow>
                      <CCol xs={6} className="mb-3">
                        <CFormInput
                          type="text"
                          autoComplete="first-name"
                          placeholder={t("FirstName")}
                          value={user.firstName}
                          onChange={(event) =>
                            handleInputChange(event, "firstName")
                          }
                        />
                      </CCol>
                      <CCol xs={6} className="mb-3">
                        <CFormInput
                          type="text"
                          autoComplete="last-name"
                          placeholder={t("LastName")}
                          value={user.lastName}
                          onChange={(event) =>
                            handleInputChange(event, "lastName")
                          }
                        />
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6} lg={12} xxl={6} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            required
                            type="text"
                            placeholder={t("Username") + "*"}
                            value={user.username}
                            onChange={(event) =>
                              handleInputChange(event, "username")
                            }
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol md={6} lg={12} xxl={6} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>@</CInputGroupText>
                          <CFormInput
                            required
                            type="email"
                            autoComplete="email"
                            placeholder={t("Email") + "*"}
                            value={user.email}
                            size="sm"
                            onChange={(event) =>
                              handleInputChange(event, "email")
                            }
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol md={6} lg={12} xxl={6} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            required
                            type={viewPass.new ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder={t("Password") + "*"}
                            value={user.password}
                            onChange={(event) =>
                              handleInputChange(event, "password")
                            }
                          />
                          <CButton
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() =>
                              handeViewPassStateChange("new", viewPass.new)
                            }
                          >
                            {viewPass.new ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </CButton>
                        </CInputGroup>
                      </CCol>
                      <CCol md={6} lg={12} xxl={6} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            required
                            type={viewPass.retype ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder={t("RepeatPassword") + "*"}
                            value={user.repeatPassword}
                            onChange={(event) =>
                              handleInputChange(event, "repeatPassword")
                            }
                          />
                          <CButton
                            type="button"
                            color="secondary"
                            variant="outline"
                            onClick={() =>
                              handeViewPassStateChange(
                                "retype",
                                viewPass.retype
                              )
                            }
                          >
                            {viewPass.retype ? (
                              <AiOutlineEyeInvisible />
                            ) : (
                              <AiOutlineEye />
                            )}
                          </CButton>
                        </CInputGroup>
                      </CCol>
                    </CRow>

                    <CInputGroup className="mb-3">
                      <CButton
                        disabled={isLoading}
                        color="success"
                        type="submit"
                        className="w-100"
                      >
                        {isLoading ? (
                          <CSpinner color="light" size="sm" />
                        ) : (
                          t("CreateAccount")
                        )}
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

              <CCard className="p-4 text-white bg-primary">
                <CCardBody className="text-center">
                  <div>
                    <h3>{t("SecurePasswordRequirements")}</h3>

                    <p className="pt-4">
                      {t("StrengthenYourShield") +
                        ": " +
                        t("FollowThePasswordCriteriaBelow") +
                        "."}
                    </p>

                    <div id="passwordCriteria">
                      <CListGroup className="list-group-noBorder">
                        <CListGroupItem>
                          <CheckCriteria valid={passwordCriteria.lowercase}>
                            {t("OneLowercaseCharacter")}
                          </CheckCriteria>
                        </CListGroupItem>
                        <CListGroupItem>
                          <CheckCriteria valid={passwordCriteria.uppercase}>
                            {t("OneUppercaseCharacter")}
                          </CheckCriteria>
                        </CListGroupItem>
                        <CListGroupItem>
                          <CheckCriteria valid={passwordCriteria.number}>
                            {t("OneNumber")}
                          </CheckCriteria>
                        </CListGroupItem>
                        <CListGroupItem>
                          <CheckCriteria valid={passwordCriteria.specialChar}>
                            {t("OneSpecialCharacter")}
                          </CheckCriteria>
                        </CListGroupItem>
                        <CListGroupItem>
                          <CheckCriteria valid={passwordCriteria.minLength}>
                            {t("EightCharactersMinimum")}
                          </CheckCriteria>
                        </CListGroupItem>
                      </CListGroup>
                    </div>
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

export default Register;
