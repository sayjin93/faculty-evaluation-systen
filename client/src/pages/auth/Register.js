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
import useErrorHandler from "src/hooks/useErrorHandler";

const Register = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
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
    faculty: "",
    department: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [viewPass, setViewPass] = useState({
    new: false,
    retype: false,
  });
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
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
          department_id: user.department,
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
                content: t(convertToKey(error.response.data.message[0])),
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

  //#region useEffect
  useEffect(() => {
    const fetchDepartments = async () => {
      await api
        .get("/department")
        .then((response) => {
          const responseData = response.data;

          // Fetch and populate faculties with unique faculty_id and faculty_key values when the component mounts
          const facultiesMap = new Map();

          responseData.forEach((item) => {
            facultiesMap.set(item.faculty_key, {
              faculty_id: item.faculty_id,
              faculty_key: item.faculty_key,
            });
          });

          const uniqueFaculties = Array.from(facultiesMap.values());
          setFaculties(uniqueFaculties);
          setDepartments(responseData);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchDepartments();
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
          <CCol md={10}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <h4>{t("Register")}</h4>

                  <p className="text-medium-emphasis">
                    {t("CreateYourAccountByFillingTheFormBelow")}
                  </p>

                  <CForm onSubmit={handleRegister}>
                    <CRow>
                      <CCol xs={6} sm={4} lg={6} xxl={4} className="mb-3">
                        <CFormInput
                          required
                          type="text"
                          floatingLabel={t("FirstName")}
                          autoComplete="first-name"
                          placeholder={t("FirstName")}
                          value={user.firstName}
                          onChange={(event) =>
                            handleFullName(event, "firstName")
                          }
                        />
                      </CCol>
                      <CCol xs={6} sm={4} lg={6} xxl={4} className="mb-3">
                        <CFormInput
                          required
                          type="text"
                          floatingLabel={t("LastName")}
                          autoComplete="last-name"
                          placeholder={t("LastName")}
                          value={user.lastName}
                          onChange={(event) =>
                            handleFullName(event, "lastName")
                          }
                        />
                      </CCol>
                      <CCol xs={12} sm={4} lg={12} xxl={4} className="mb-3">
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
                    </CRow>

                    <CRow>
                      <CCol xs={6} className="mb-3">
                        <CFormSelect
                          required
                          floatingLabel={t("Faculty")}
                          value={user.faculty}
                          onChange={(event) =>
                            handleInputChange(event, "faculty")
                          }
                        >
                          <option value="">{t("PleaseSelect")}</option>
                          {faculties.map((faculty) => (
                            <option
                              key={faculty.faculty_id}
                              value={faculty.faculty_id}
                            >
                              {t(faculty.faculty_key)}
                            </option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol xs={6} className="mb-3">
                        <CFormSelect
                          required
                          disabled={!user.faculty}
                          floatingLabel={t("Department")}
                          value={user.department}
                          onChange={(event) =>
                            handleInputChange(event, "department")
                          }
                        >
                          <option value="">{t("PleaseSelect")}</option>
                          {departments
                            .filter(
                              (department) =>
                                String(department.faculty_id) ===
                                String(user.faculty)
                            )
                            .map((department) => (
                              <option key={department.id} value={department.id}>
                                {t(department.key)}
                              </option>
                            ))}
                        </CFormSelect>
                      </CCol>
                    </CRow>

                    <CRow>
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

              <CCard className="p-4 text-white bg-primary overflow-hidden">
                <CImage
                  className="overlayBg register"
                  src={icon}
                  height={200}
                />

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
