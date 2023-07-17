import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { setCookie } from "src/hooks";

import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CModalFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cifAl, cifGb, cibHtmlacademy } from "@coreui/icons";
import { setModal, showToast, changeAcademicYear } from "src/store";

const Settings = () => {
  //#region constants
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region states
  const activeAcademicYear = useSelector(
    // @ts-ignore
    (state) => state.settings.academicYear.year
  );
  // @ts-ignore
  const modal = useSelector((state) => state.modal.modal);

  const [academicYear, setAcademicYear] = useState([]);
  const [status, setStatus] = useState(null);
  const [newAcademicYear, setNewAcademicYear] = useState("");
  //#endregion

  //#region functions
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setCookie({
      key: "language",
      value: language,
      options: { path: "/" },
    });
  };
  const addAcademicYear = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/academic-year", {
        year: newAcademicYear,
        active: false,
      })
      .then((response) => {
        const year = response.data.year;

        setStatus(response);
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

  const updateActiveStatus = async (item) => {
    const { id, year } = item;

    await axios
      .put(process.env.REACT_APP_API_URL + "/academic-year/active/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Academic Year " + year + " is set as active!",
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
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchAcademicYears = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/academic-year")
        .then((response) => {
          setAcademicYear(response.data);
        })
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            dispatch(
              showToast({
                type: "danger",
                content: error.message,
              })
            );
          } else if (error.code === "ERR_BAD_REQUEST") {
            // Remove the JWT token from the Local Storage
            localStorage.removeItem("jwt_token");

            // Redirect the user to the login page
            navigate("/login", { replace: true });

            // Show alert
            dispatch(
              showToast({
                type: "danger",
                content: error.response.statusText,
              })
            );
          }
        });
    };

    fetchAcademicYears();
  }, [status]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Settings")}</CHeaderBrand>
        </CContainer>
      </CHeader>

      <CRow className="align-items-start">
        <CCol>
          <CCard color="dark" textColor="white" className="mb-3">
            <CCardHeader>{t("Language")}</CCardHeader>
            <CCardBody>
              <CDropdown>
                <CDropdownToggle color="light">
                  {i18n.language === "sq" ? (
                    <>
                      <CIcon icon={cifAl} />
                      <span className="ms-2">Shqip</span>
                    </>
                  ) : (
                    <>
                      <CIcon icon={cifGb} />
                      <span className="ms-2">English</span>
                    </>
                  )}
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem
                    className="cursor"
                    onClick={() => handleLanguageChange("sq")}
                  >
                    <CIcon icon={cifAl} />
                    <span className="ms-2">Shqip</span>
                  </CDropdownItem>
                  <CDropdownItem
                    className="cursor"
                    onClick={() => handleLanguageChange("en")}
                  >
                    <CIcon icon={cifGb} />
                    <span className="ms-2">English</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="dark" textColor="white" className="mb-3">
            <CCardHeader>{t("AcademicYear")}</CCardHeader>
            <CCardBody>
              <div className="flex flex-justify-between flex-gap-10">
                <CDropdown>
                  <CDropdownToggle color="light">
                    <CIcon icon={cibHtmlacademy} />
                    <span className="ms-2">{activeAcademicYear}</span>
                  </CDropdownToggle>
                  <CDropdownMenu>
                    {academicYear.map((element) => {
                      return (
                        <CDropdownItem
                          className="cursor"
                          key={element.id}
                          onClick={() => {
                            console.log(element);
                            dispatch(changeAcademicYear(element));
                            updateActiveStatus(element);
                          }}
                        >
                          <span className="ms-2">{element.year}</span>
                        </CDropdownItem>
                      );
                    })}
                  </CDropdownMenu>
                </CDropdown>

                <CButton color="light" onClick={() => dispatch(setModal(true))}>
                  {t("Add")}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        backdrop="static"
        visible={modal}
        onClose={() => {
          dispatch(setModal(false));
          setNewAcademicYear("");
        }}
      >
        <CModalHeader>
          <CModalTitle>{t("Add")}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("AcademicYear")}
            placeholder={t("AcademicYear")}
            value={newAcademicYear}
            onChange={(event) => setNewAcademicYear(event.target.value)}
          />
        </CModalBody>

        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              dispatch(setModal(false));
            }}
          >
            {t("Close")}
          </CButton>
          <CButton
            disabled={newAcademicYear.length === 0}
            onClick={() => {
              addAcademicYear();
              dispatch(setModal(false));
            }}
          >
            {t("Add")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Settings;
