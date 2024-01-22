import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CCard,
  CCardBody,
  CCardHeader,
  CButton,
  CRow,
  CCol,
  CSpinner,
  CFormSelect,
} from "@coreui/react";

//react-icons
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import {
  AiOutlineUser,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

//hooks
import { capitalizeWords, convertToKey, lowercaseNoSpace } from "src/hooks";
import api from "src/hooks/api";

//store
import { showToast, setUser } from "src/store";
import { getLoggedUser } from "src/store/selectors";

//components
import PasswordCriteria, {
  checkPasswordCriteria,
} from "src/components/PasswordCriteria";
import { PiGenderIntersexDuotone } from "react-icons/pi";

const Profile = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentUser = useSelector(getLoggedUser);
  //#endregion

  //#region states
  const [userData, setUserData] = useState({
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
    gender: currentUser.gender,
    username: currentUser.username,
    email: currentUser.email,
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });
  const [viewPass, setViewPass] = useState({
    current: false,
    new: false,
    retype: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region functions
  const handleInputChange = (event, fieldName) => {
    let inputValue = event.target.value;

    // Capitalize the first letter of each word for firstName and lastName fields
    if (fieldName === "firstName" || fieldName === "lastName")
      inputValue = capitalizeWords(inputValue);

    //Lowercase the text of username
    if (fieldName === "username") inputValue = lowercaseNoSpace(inputValue);

    setUserData({
      ...userData,
      [fieldName]: inputValue,
    });

    if (fieldName === "newPassword") {
      checkPasswordCriteria(inputValue);
    }
  };

  const handeViewPassStateChange = (key, value) => {
    setViewPass((prevState) => {
      return {
        ...prevState,
        [key]: !value,
      };
    });
  };

  const updateUserData = async () => {
    setIsLoading(true);

    await api
      .put("professor/" + currentUser.id, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        gender: userData.gender,
        username: userData.username,
        currentPassword: userData.currentPassword,
        newPassword: userData.newPassword,
      })
      .then((response) => {
        const loggedUser = {
          id: currentUser.id,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          gender: response.data.gender,
          username: response.data.username,
          email: response.data.email,
        };

        setUserData((prevState) => {
          dispatch(setUser(loggedUser));

          dispatch(
            showToast({
              type: "success",
              content: t("UserWasEditedSuccessfully"),
            })
          );

          return {
            ...prevState,
            currentPassword: "",
            newPassword: "",
            repeatPassword: "",
          };
        });
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: t(convertToKey(error.response.data.message)),
          })
        );
      });

    setIsLoading(false);
  };

  const handleUserUpdate = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (userData.newPassword !== "") {
      if (userData.newPassword !== userData.repeatPassword) {
        dispatch(
          showToast({
            type: "danger",
            content: t("NewAndRepeatPasswordDidNotMatch"),
          })
        );
        return;
      } else {
        // Use the checkPasswordCriteria function on the current password
        const passwordCriteria = checkPasswordCriteria(userData.newPassword);
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
          if (element) element.scrollIntoView({ behavior: "smooth" });
        } else {
          updateUserData();
        }
      }
    } else {
      updateUserData();
    }
  };
  //#endregion

  return (
    <CForm onSubmit={handleUserUpdate}>
      {/* Profile */}
      <CCard>
        <CCardHeader>
          <h6 className="card-title">
            <AiOutlineUser />
            <span className="title">{t("Profile")}</span>
          </h6>
        </CCardHeader>

        <CCardBody>
          <CRow className="mb-3" xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2 }}>
            <CCol sm={6}>
              <CFormInput
                type="text"
                placeholder={t("FirstName")}
                value={userData.firstName}
                onChange={(event) => handleInputChange(event, "firstName")}
              />
            </CCol>

            <CCol sm={6}>
              <CFormInput
                type="text"
                placeholder={t("LastName")}
                value={userData.lastName}
                onChange={(event) => handleInputChange(event, "lastName")}
              />
            </CCol>
          </CRow>

          <CRow className="mb-3" xs={{ cols: 1, gutter: 3 }}>
            <CCol sm={12}>
              <CInputGroup>
                <CInputGroupText>
                  <PiGenderIntersexDuotone />
                </CInputGroupText>
                <CFormSelect
                  floatingLabel={t("Gender")}
                  value={userData.gender}
                  onChange={(event) => handleInputChange(event, "gender")}
                >
                  <option value="m">{t("Male")}</option>
                  <option value="f">{t("Female")}</option>
                </CFormSelect>
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2 }}>
            <CCol sm={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  title={t("NotAllowedToEdit")}
                  type="text"
                  placeholder={t("Username")}
                  autoComplete="username"
                  value={userData.username}
                  onChange={(event) => handleInputChange(event, "username")}
                />
              </CInputGroup>
            </CCol>

            <CCol sm={6}>
              <CInputGroup>
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  disabled
                  type="email"
                  placeholder={t("Email")}
                  value={userData.email}
                  size="sm"
                  // onChange={(event) => handleInputChange(event, "email")}
                />
              </CInputGroup>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Password */}
      <CCard className="my-4">
        <CCardHeader>
          <h6 className="card-title">
            <CIcon icon={cilLockLocked} />
            <span className="title">{t("Password")}</span>
          </h6>
        </CCardHeader>

        <CCardBody>
          <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2 }}>
            <CCol sm={6}>
              <CRow xs={{ cols: 1, gutter: 3 }}>
                <CCol>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type={viewPass.current ? "text" : "password"}
                      placeholder={t("CurrentPassword") + "*"}
                      value={userData.currentPassword}
                      onChange={(event) =>
                        handleInputChange(event, "currentPassword")
                      }
                    />
                    <CButton
                      type="button"
                      color="secondary"
                      variant="outline"
                      onClick={() =>
                        handeViewPassStateChange("current", viewPass.current)
                      }
                    >
                      {viewPass.current ? (
                        <AiOutlineEyeInvisible />
                      ) : (
                        <AiOutlineEye />
                      )}
                    </CButton>
                  </CInputGroup>
                </CCol>

                <CCol>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={viewPass.new ? "text" : "password"}
                      placeholder={t("NewPassword")}
                      value={userData.newPassword}
                      onChange={(event) =>
                        handleInputChange(event, "newPassword")
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

                <CCol>
                  <CInputGroup>
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={viewPass.retype ? "text" : "password"}
                      disabled={userData.newPassword === ""}
                      placeholder={t("RepeatPassword")}
                      value={userData.repeatPassword}
                      onChange={(event) =>
                        handleInputChange(event, "repeatPassword")
                      }
                    />
                    <CButton
                      type="button"
                      color="secondary"
                      variant="outline"
                      onClick={() =>
                        handeViewPassStateChange("retype", viewPass.retype)
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
            </CCol>

            {userData.newPassword && (
              <CCol sm={6}>
                <PasswordCriteria
                  password={userData.newPassword}
                  className="passwordCriteria-light"
                />
              </CCol>
            )}
          </CRow>
        </CCardBody>
      </CCard>

      {/* Save Btn */}
      <CRow className="mb-4">
        <CCol className="text-end">
          <CButton disabled={isLoading} color="primary" type="submit">
            {isLoading ? <CSpinner color="light" size="sm" /> : t("Update")}
          </CButton>
        </CCol>
      </CRow>
    </CForm>
  );
};

export default Profile;
