import React, { useState } from "react";
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
  CFormSelect,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from "@coreui/react";

//icons
import CIcon from "@coreui/icons-react";
import { PiGenderIntersexDuotone } from "react-icons/pi";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

//hooks
import api from "src/hooks/api";
import {
  capitalizeWords,
  convertToKey,
  getCookie,
  lowercaseNoSpace,
} from "src/hooks";

//store
import { showToast } from "src/store";

//components
import PasswordCriteria, {
  checkPasswordCriteria,
} from "src/components/PasswordCriteria";
import LanguagesDropdown from "src/components/LanguagesDropdown";

//images
import icon from "src/assets/images/icon.svg";

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
    gender: "m",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState({
    new: false,
    retype: false,
  });
  //#endregion

  //#region functions
  const handleFullName = (event, fieldName) => {
    const inputValue = capitalizeWords(event.target.value);

    let newUser = {
      ...user,
      [fieldName]: inputValue,
    };

    // Automatically set email when firstName or lastName changes
    if (fieldName === "firstName" || fieldName === "lastName") {
      const firstName = fieldName === "firstName" ? inputValue : user.firstName;
      const lastName = fieldName === "lastName" ? inputValue : user.lastName;

      if (firstName && lastName) {
        const username = lowercaseNoSpace(`${firstName[0]}${lastName}`);
        newUser.username = username;
        newUser.email = username;
      }
    }

    setUser(newUser);
  };

  const handleInputChange = (event, fieldName) => {
    const inputValue = event.target.value;

    let newUser = {
      ...user,
      [fieldName]: inputValue,
    };

    setUser(newUser);

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

    // Use the checkPasswordCriteria function on the current password
    const passwordCriteria = checkPasswordCriteria(user.password);
    let areAllTrue = Object.values(passwordCriteria).every(
      (value) => value === true
    );

    if (!areAllTrue) {
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
      const language = getCookie({ name: "language" });
      const languageCookie = language || "en";

      setIsLoading(true);

      await api
        .post("/register", {
          language: languageCookie,
          first_name: capitalizeWords(user.firstName.replace(/\s+/g, "")),
          last_name: capitalizeWords(user.lastName.replace(/\s+/g, "")),
          gender: user.gender,
          username: lowercaseNoSpace(user.username),
          email: lowercaseNoSpace(user.email).split("@")[0],
          password: user.password,
        })
        .then((response) => {
          // Redirect the user to the login page
          navigate("/login", { replace: true });

          // Handle the success response
          dispatch(
            showToast({
              type: "success",
              content: t(convertToKey(response.data.message)),
            })
          );
        })
        .catch((error) => {
          if (error.response) {
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
    }
  };
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup className="overflow-hidden">
              <CCard className="p-4">
                <CCardBody>
                  <h4>{t("Register")}</h4>

                  <p className="text-medium-emphasis">
                    {t("CreateYourAccountByFillingTheFormBelow")}
                  </p>

                  <CForm onSubmit={handleRegister}>
                    <CRow>
                      <CCol xs={6} className="mb-3">
                        <CFormInput
                          required
                          type="text"
                          autoComplete="first-name"
                          placeholder={t("FirstName")}
                          value={user.firstName}
                          onChange={(event) =>
                            handleFullName(event, "firstName")
                          }
                        />
                      </CCol>
                      <CCol xs={6} className="mb-3">
                        <CFormInput
                          required
                          type="text"
                          autoComplete="last-name"
                          placeholder={t("LastName")}
                          value={user.lastName}
                          onChange={(event) =>
                            handleFullName(event, "lastName")
                          }
                        />
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol xs={12} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>
                            <PiGenderIntersexDuotone />
                          </CInputGroupText>
                          <CFormSelect
                            floatingLabel={t("Gender")}
                            value={user.gender}
                            onChange={(event) =>
                              handleInputChange(event, "gender")
                            }
                          >
                            <option value="m">{t("Male")}</option>
                            <option value="f">{t("Female")}</option>
                          </CFormSelect>
                        </CInputGroup>
                      </CCol>
                      <CCol xs={12} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>
                            <CIcon icon={cilUser} />
                          </CInputGroupText>
                          <CFormInput
                            required
                            type="text"
                            placeholder={t("Username")}
                            value={user.username}
                            onChange={(event) =>
                              handleInputChange(event, "username")
                            }
                          />
                        </CInputGroup>
                      </CCol>

                      <CCol xs={12} className="mb-3">
                        <CInputGroup>
                          <CInputGroupText>@</CInputGroupText>
                          <CFormInput
                            aria-describedby="emal"
                            required
                            placeholder={t("Email")}
                            value={user.email}
                            onChange={(event) =>
                              handleInputChange(event, "email")
                            }
                          />
                          <CInputGroupText id="emal">
                            @uet.edu.al
                          </CInputGroupText>
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
                            placeholder={t("Password")}
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
                            placeholder={t("RepeatPassword")}
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

                    <CRow className="flex-align-center mb-3">
                      <CCol xs={6}>
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
                      </CCol>
                      <CCol xs={6} className="text-end">
                        <LanguagesDropdown />
                      </CCol>
                    </CRow>
                  </CForm>

                  <CButton color="link" size="sm" className="d-block mx-auto" onClick={() => navigate("/login")}>
                    <IoIosArrowRoundBack /> {t("BackToLogin")}
                  </CButton>
                </CCardBody>
              </CCard>

              <CCard className="p-4 text-white bg-primary">
                <CImage className="overlayBg register" src={icon} height={200} />

                <CCardBody className="text-center">
                  <h4>{t("SecurePasswordRequirements")}</h4>

                  <p className="py-4">
                    {t("StrengthenYourShield")}
                    <br />
                    {t("FollowThePasswordCriteriaBelow")}
                  </p>

                  <PasswordCriteria password={user.password} />
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
