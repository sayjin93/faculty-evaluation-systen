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
  CListGroup,
  CListGroupItem,
  CSpinner,
} from "@coreui/react";

//react-icons
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

//hooks
import { convertToKey } from "src/hooks"
import api from "src/hooks/api";

//store
import { showToast, setUser } from "src/store";
import { getLoggedUser } from "src/store/selectors";

//components
import CheckCriteria from "src/hooks/checkCriteria";

const Settings = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentUser = useSelector(getLoggedUser);
  //#endregion

  //#region states
  const [userData, setUserData] = useState({
    firstName: currentUser.first_name,
    lastName: currentUser.last_name,
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

    setUserData({
      ...userData,
      [fieldName]: event.target.value,
    });

    if (fieldName === "newPassword") checkPasswordCriteria(inputValue);
  };

  const handeViewPassStateChange = (key, value) => {
    setViewPass(prevState => {
      return {
        ...prevState,
        [key]: !value,
      };
    })
  }

  const handleUserUpdate = async (event) => {
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
    } else if (userData.newPassword !== "" && (userData.newPassword !== userData.repeatPassword)) {
      dispatch(
        showToast({
          type: "danger",
          content: t("NewAndRepeatPasswordDidNotMatch"),
        })
      );
      return;
    }
    else {
      setIsLoading(true);

      await api
        .put("user/" + currentUser.id, {
          first_name: userData.firstName,
          last_name: userData.lastName,
          username: userData.username,
          email: userData.email,
          currentPassword: userData.currentPassword,
          newPassword: userData.newPassword,
        })
        .then((response) => {
          const loggedUser = {
            id: currentUser.id,
            first_name: response.data.first_name,
            last_name: response.data.last_name,
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
            }
          })
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
          <CRow
            xs={{ cols: 1, gutter: 3 }}
            lg={{ cols: 2 }}
          >
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

            <CCol sm={6}>
              <CInputGroup>
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                <CFormInput
                  disabled
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
                  type="email"
                  placeholder={t("Email")}
                  value={userData.email}
                  size="sm"
                  onChange={(event) => handleInputChange(event, "email")}
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
          <CRow
            xs={{ cols: 1, gutter: 3 }}
            lg={{ cols: 2 }}
          >
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
                      autoComplete="current-password"
                      value={userData.currentPassword}
                      onChange={(event) =>
                        handleInputChange(event, "currentPassword")
                      }
                    />
                    <CButton type="button" color="secondary" variant="outline" onClick={() => handeViewPassStateChange("current", viewPass.current)}>{viewPass.current ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</CButton>
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
                      autoComplete="new-password"
                      value={userData.newPassword}
                      onChange={(event) =>
                        handleInputChange(event, "newPassword")
                      }
                    />
                    <CButton type="button" color="secondary" variant="outline" onClick={() => handeViewPassStateChange("new", viewPass.new)}>{viewPass.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</CButton>
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
                      autoComplete="new-password"
                      value={userData.repeatPassword}
                      onChange={(event) =>
                        handleInputChange(event, "repeatPassword")
                      }
                    />
                    <CButton type="button" color="secondary" variant="outline" onClick={() => handeViewPassStateChange("retype", viewPass.retype)}>{viewPass.retype ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</CButton>

                  </CInputGroup>
                </CCol>
              </CRow>
            </CCol>

            <CCol sm={6}>
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
            </CCol>

          </CRow>
        </CCardBody>
      </CCard>

      {/* Save Btn */}
      <CRow className="mb-4">
        <CCol className="text-end">
          <CButton disabled={isLoading} color="primary" type="submit">
            {isLoading ? (
              <CSpinner color="light" size="sm" />
            ) : t("Update")}
          </CButton>
        </CCol>
      </CRow>

    </CForm>
  );
};

export default Settings;
