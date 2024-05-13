import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
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
import { cibHtmlacademy } from "@coreui/icons";

//hooks
import api from "src/hooks/api";

//store
import { showToast, setFirstLogin } from "src/store";

const AcademicYearAdd = ({ isAdmin }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region states
  const [newAcademicYear, setNewAcademicYear] = useState("");
  //#endregion

  //#region functions
  const addAcademicYear = async (event) => {
    event.preventDefault();

    await api
      .post("/academic-year", {
        year: newAcademicYear,
        active: 1,
      })
      .then((response) => {
        const year = response.data.year;
        dispatch(
          showToast({
            type: "success",
            content: "Academic Year " + year + " was added successful!",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: error,
          })
        );
      });
  };
  const logout = (event) => {
    event.preventDefault();

    // Remove the JWT token from the Local Storage
    localStorage.removeItem("jwt_token");

    // Redirect the user to the login page
    navigate("/login", { replace: true });

    //Show toast with notification
    dispatch(
      showToast({
        type: "success",
        content: "You have been logout successfully!",
      })
    );
    dispatch(setFirstLogin(true));
  };
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                {isAdmin ? (
                  <CForm onSubmit={addAcademicYear}>
                    <h1>{t("Add") + " " + t("AcademicYear")}</h1>
                    <p className="text-medium-emphasis">
                      {t("YouNeedToDefineAcademicYearFirst") + "!"}
                    </p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cibHtmlacademy} />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type="text"
                        placeholder={t("Ex") + ". 2023-2024"}
                        value={newAcademicYear}
                        onChange={(event) =>
                          setNewAcademicYear(event.target.value)
                        }
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton color="success" type="submit">
                        {t("Add") + " " + t("AcademicYear")}
                      </CButton>
                    </div>
                  </CForm>
                ) : (
                  <CForm onSubmit={logout}>
                    <h1>{t("NoAcademicYear")}</h1>
                    <p className="text-medium-emphasis">
                      {t("ContactAdministrator") + "!"}
                    </p>

                    <div className="d-grid">
                      <CButton color="success" type="submit">
                        {t("Logout")}
                      </CButton>
                    </div>
                  </CForm>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={6} className="text-right"></CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AcademicYearAdd;
