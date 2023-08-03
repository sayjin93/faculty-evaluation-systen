import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { setCookie } from "src/hooks";
import useErrorHandler from "../hooks/useErrorHandler";
import { setModal, showToast, changeAcademicYear } from "src/store";

import axios from "axios";
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

const Settings = () => {
  //#region constants
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const { activeAcademicYear, modal } = useSelector((state) => ({
    activeAcademicYear: state.settings.academicYear.year,
    modal: state.modal.modal,
  }));
  //#endregion

  //#region states
  const [academicYear, setAcademicYear] = useState([]);
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
          handleError(error);
        });
    };

    fetchAcademicYears();
  }, [dispatch]);
  //#endregion

  return (
    <>
      <CHeader className="mb-3">
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
          <CCard color="white" className="mb-3">
            <CCardHeader>{t("AcademicYear")}</CCardHeader>
            <CCardBody>
              <div className="flex flex-justify-between flex-gap-10">
                <CDropdown>
                  <CDropdownToggle color="dark">
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

                <CButton color="dark" onClick={() => dispatch(setModal(true))}>
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
