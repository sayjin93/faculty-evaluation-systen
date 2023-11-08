import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { convertToKey, setCookie } from "src/hooks";
import useErrorHandler from "src/hooks/useErrorHandler";
import api from "src/hooks/api";

import { getActiveAcademicYear, getModal } from "../store/selectors/selectors";
import { setModal, showToast, changeAcademicYear } from "src/store";

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
  CForm,
  CFormSelect,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cifAl, cifGb, cibHtmlacademy } from "@coreui/icons";

const defaultSmtpConfigs = {
  sender_name: "UET Support",
  smtp_host: "",
  smtp_port: 465,
  smtp_secure: 1,
  smtp_user: "",
  smtp_pass: ""
}

const Settings = () => {
  //#region constants
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const activeAcademicYear = useSelector(getActiveAcademicYear);
  const modal = useSelector(getModal);
  //#endregion

  //#region states
  const [academicYear, setAcademicYear] = useState([]);
  const [newAcademicYear, setNewAcademicYear] = useState("");
  const [smtpConfig, setSmtpConfig] = useState(defaultSmtpConfigs);
  //#endregion

  //#region functions
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setCookie({
      name: "language",
      value: language,
      options: { path: "/", sameSite: "strict" },
    });
  };

  //academic year
  const fetchAcademicYears = async () => {
    await api
      .get("/academic-year")
      .then((response) => {
        setAcademicYear(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const addAcademicYear = async () => {
    await api
      .post("/academic-year", {
        year: newAcademicYear,
        active: false,
      })
      .then((response) => {
        fetchAcademicYears();

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

    await api
      .put("/academic-year/active/" + id)
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

  //settinggs
  const fetchSettings = async () => {
    await api
      .get("/settings")
      .then((response) => {
        debugger;
        //smtp configurations
        const emailSettings = response.data.find(item => item.name === "Email");
        if (emailSettings) setSmtpConfig(JSON.parse(emailSettings.settings));
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const handleSmtpChange = (value, fieldName) => {
    setSmtpConfig(prevConfig => ({
      ...prevConfig,
      [fieldName]: value
    }));
  };
  const handleSubmitSMTP = async (event) => {
    event.preventDefault();

    const updatedSTMP = {
      sender_name: smtpConfig.sender_name,
      smtp_host: smtpConfig.smtp_host,
      smtp_port: smtpConfig.smtp_port,
      smtp_secure: smtpConfig.smtp_secure,
      smtp_user: smtpConfig.smtp_user,
      smtp_pass: smtpConfig.smtp_pass,
    };

    await api
      .put("/settings/email", updatedSTMP)
      .then((response) => {
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message)),
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
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchAcademicYears();
    fetchSettings();
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
        {/* Language */}
        <CCol>
          <CCard color="white" className="mb-3">
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

        {/* Acaemi Year */}
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

                <CButton color="light" onClick={() => dispatch(setModal("addAcdemicYear"))}>
                  {t("Add")}
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>

        {/* SMTP Configs */}
        <CCol>
          <CCard color="white" className="mb-3">
            <CCardHeader>{t("SmtpConfiguration")}</CCardHeader>
            <CCardBody>
              <CForm
                onSubmit={handleSubmitSMTP}
              >
                <CFormInput
                  size="sm"
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel={t("SenderName")}
                  placeholder={t("SenderName")}
                  value={smtpConfig.sender_name}
                  onChange={(event) => handleSmtpChange(event.target.value, "sender_name")}
                />
                <CFormInput
                  size="sm"
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel={t("Host")}
                  placeholder={t("Host")}
                  value={smtpConfig.smtp_host}
                  onChange={(event) => handleSmtpChange(event.target.value, "smtp_host")}
                />
                <CFormInput
                  size="sm"
                  type="number"
                  floatingClassName="mb-3"
                  floatingLabel={t("Port")}
                  placeholder={t("Port")}
                  value={smtpConfig.smtp_port}
                  onChange={(event) => handleSmtpChange(Number(event.target.value), "smtp_port")}
                />

                <CFormSelect
                  size="sm"
                  className="cursor"
                  floatingClassName="mb-3"
                  floatingLabel={t("Secure")}
                  value={smtpConfig.smtp_secure}
                  onChange={(event) => handleSmtpChange(Number(event.target.value), "smtp_secure")}
                >
                  <option value={1}>
                    {t("True")}</option>
                  <option value={0}>
                    {t("False")}</option>
                </CFormSelect>

                <CFormInput
                  size="sm"
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel={t("User")}
                  placeholder={t("User")}
                  value={smtpConfig.smtp_user}
                  onChange={(event) => handleSmtpChange(event.target.value, "smtp_user")}
                />

                <CFormInput
                  size="sm"
                  type="text"
                  floatingClassName="mb-3"
                  floatingLabel={t("Password")}
                  placeholder={t("Password")}
                  value={smtpConfig.smtp_pass}
                  onChange={(event) => handleSmtpChange(event.target.value, "smtp_pass")}
                />

                <CButton type="submit">
                  {t("Save")}
                </CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        id="addAcdemicYear"
        backdrop="static"
        visible={modal.isOpen && modal.id === "addAcdemicYear"}
        onClose={() => {
          dispatch(setModal());
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
              dispatch(setModal());
            }}
          >
            {t("Close")}
          </CButton>
          <CButton
            disabled={newAcademicYear.length === 0}
            onClick={() => {
              addAcademicYear();
              dispatch(setModal());
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
