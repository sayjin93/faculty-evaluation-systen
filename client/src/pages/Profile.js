import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";

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
  CModal,
  CRow,
  CCol,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";

//hooks
import { convertToKey } from "../hooks"
import api from "src/hooks/api";

//store
import { setModal, showToast, setUser } from "src/store";
import { getModal, getLoggedUser } from "src/store/selectors/selectors";

const Settings = () => {
  //#region constants
  const dispatch = useDispatch();

  const modal = useSelector(getModal);
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
  //#endregion

  //#region functions
  const handleInputChange = (event, fieldName) => {
    setUserData({
      ...userData,
      [fieldName]: event.target.value,
    });
  };

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
          <h6 className="m-0">{t("Profile")}</h6>
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
                    type="password"
                    placeholder={t("CurrentPassword") + "*"}
                    autoComplete="current-password"
                    value={userData.currentPassword}
                    onChange={(event) =>
                      handleInputChange(event, "currentPassword")
                    }
                  />
                </CInputGroup>
              </CCol>

              <CCol>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder={t("NewPassword")}
                    autoComplete="new-password"
                    value={userData.newPassword}
                    onChange={(event) =>
                      handleInputChange(event, "newPassword")
                    }
                  />
                </CInputGroup>
              </CCol>

              <CCol>
                <CInputGroup>
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked} />
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    disabled={userData.newPassword === ""}
                    placeholder={t("RepeatPassword")}
                    autoComplete="new-password"
                    value={userData.repeatPassword}
                    onChange={(event) =>
                      handleInputChange(event, "repeatPassword")
                    }
                  />
                </CInputGroup>
              </CCol>
            </CRow>

            <CRow>
              <CCol className="text-end">
                <CButton color="primary" type="submit">
                  {t("UpdateProfile")}
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        </CCardBody>
      </CCard>

      <CModal
        backdrop="static"
        visible={modal}
        onClose={() => {
          dispatch(setModal(false));
        }}
      >
        <p>dsfsfdsf</p>
      </CModal>
    </>
  );
};

export default Settings;
