import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import useErrorHandler from "src/hooks/useErrorHandler";

import { getModal, getLoggedUser } from "../store/selectors/selectors";
import { setModal, showToast } from "src/store";

import axios from "axios";
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

const Settings = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);
  const currentUser = useSelector(getLoggedUser);

  //#endregion

  //#region states
  const [user, setUser] = useState({
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
    setUser({
      ...user,
      [fieldName]: event.target.value,
    });
  };

  const handleUserUpdate = async (event) => {
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
          });
      } catch (error) {
        // Handle any errors
        dispatch(
          showToast({
            type: "danger",
            content: error.response.data.message,
          })
        );
      }
    }
  };
  //#endregion

  //#region useEffect
  useEffect(() => {}, []);
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
              xs={{ cols: 1, gutter: 4 }}
              lg={{ cols: 3 }}
              className="align-items-start mb-3"
            >
              <CCol xs={6}>
                <CFormInput
                  required
                  type="text"
                  placeholder={t("FirstName")}
                  value={user.firstName}
                  onChange={(event) => handleInputChange(event, "firstName")}
                />
              </CCol>

              <CCol xs={6}>
                <CFormInput
                  required
                  type="text"
                  placeholder={t("LastName")}
                  value={user.lastName}
                  onChange={(event) => handleInputChange(event, "lastName")}
                />
              </CCol>

              <CCol>
                <CInputGroup>
                  <CInputGroupText>@</CInputGroupText>
                  <CFormInput
                    required
                    type="email"
                    placeholder={t("Email")}
                    value={user.email}
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
                    required
                    type="text"
                    placeholder={t("Username")}
                    value={user.username}
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
                    placeholder={t("CurrentPassword")}
                    value={user.currentPassword}
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
                    required
                    type="password"
                    placeholder={t("NewPassword")}
                    value={user.newPassword}
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
                    required
                    type="password"
                    placeholder={t("RepeatPassword")}
                    value={user.repeatPassword}
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
