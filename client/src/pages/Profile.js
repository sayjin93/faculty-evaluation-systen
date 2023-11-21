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
  //#endregion

  //#region functions
  const handleInputChange = (event, fieldName) => {
    setUserData({
      ...userData,
      [fieldName]: event.target.value,
    });
  };

  const handeViewPassStateChange = (key, value) => {
    setViewPass(prevState => {
      return {
        ...prevState,
        [key]: !value,
      };
    })
  }

  const handleUserUpdate = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (userData.newPassword !== "" && (userData.newPassword !== userData.repeatPassword)) {
      dispatch(
        showToast({
          type: "danger",
          content: t("NewAndRepeatPasswordDidNotMatch"),
        })
      );
      return;
    }

    api
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

  };
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader>
          <h6 className="card-title">
            <AiOutlineUser />
            <span className="title">{t("Profile")}</span>
          </h6>
        </CCardHeader>

        <CCardBody>
          <CForm onSubmit={handleUserUpdate}>
            <CRow
              xs={{ cols: 1, gutter: 3 }}
              lg={{ cols: 3 }}
              className="align-items-start mb-3"
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

              <CCol>
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

            <CRow
              xs={{ cols: 1, gutter: 4 }}
              lg={{ cols: 2 }}
              className="align-items-start mb-3"
            >
              <CCol>
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

            <CRow>
              <CCol className="text-end">
                <CButton color="primary" type="submit">
                  {t("Update")}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Settings;
