import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
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

//react-icons
import { LuSettings2, LuLanguages } from "react-icons/lu";
import { HiAcademicCap } from "react-icons/hi"
import { MdOutlineMarkEmailUnread } from "react-icons/md";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast, changeAcademicYear } from "src/store";
import { getActiveAcademicYear, getModal } from "src/store/selectors";

//components
import LanguagesDropdown from "src/components/LanguagesDropdown";

const defaultSmtpConfigs = {
  smtp_sender: "UET Support",
  smtp_host: "",
  smtp_port: 465,
  smtp_secure: 1,
  smtp_user: "",
  smtp_pass: ""
}

const Settings = () => {
  //#region constants
  const { t } = useTranslation();
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
        const emailSettings = response.data.find(item => item.name === "Email")
        if (emailSettings) {
          const settingsData = emailSettings.settings;

          // Check if settingsData is a string before parsing
          const settingsObject = typeof settingsData === 'string' ? JSON.parse(settingsData) : settingsData;

          // Update the state
          setSmtpConfig(settingsObject);
        }
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
      smtp_sender: smtpConfig.smtp_sender,
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
  }, []);
  //#endregion

  return (
    <>
      <CCardHeader className="mb-3">
        <h6 className="card-title">
          <LuSettings2 />
          <span className="title">{t("Settings")}</span>
        </h6>
      </CCardHeader>

      <CCardBody>
        <CRow className="align-items-start">
          {/* Language */}
          <CCol>
            <CCard color="white" className="mb-3">
              <CCardHeader>
                <h6 className="card-title">
                  <LuLanguages />
                  <span className="title">{t("Language")}</span>
                </h6>
              </CCardHeader>
              <CCardBody>
                <LanguagesDropdown />
              </CCardBody>
            </CCard>
          </CCol>

          {/* Acaemi Year */}
          <CCol>
            <CCard color="dark" textColor="white" className="mb-3">
              <CCardHeader>
                <h6 className="card-title">
                  <HiAcademicCap />
                  <span className="title">{t("AcademicYear")}</span>
                </h6>
              </CCardHeader>
              <CCardBody>
                <div className="flex flex-justify-between flex-gap-10">
                  <CDropdown>
                    <CDropdownToggle color="light">
                      {activeAcademicYear}
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
                            {element.year}
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
              <CCardHeader>
                <h6 className="card-title">
                  <MdOutlineMarkEmailUnread />
                  <span className="title">{t("SmtpConfiguration")}</span>
                </h6>
              </CCardHeader>
              <CCardBody>
                <CForm
                  onSubmit={handleSubmitSMTP}
                >
                  <CFormInput
                    name="smtp_sender"
                    size="sm"
                    type="text"
                    floatingClassName="mb-3"
                    floatingLabel={t("SenderName")}
                    placeholder={t("SenderName")}
                    value={smtpConfig.smtp_sender}
                    onChange={(event) => handleSmtpChange(event.target.value, "smtp_sender")}
                  />
                  <CFormInput
                    name="smtp_host"
                    size="sm"
                    type="text"
                    floatingClassName="mb-3"
                    floatingLabel={t("Host")}
                    placeholder={t("Host")}
                    value={smtpConfig.smtp_host}
                    onChange={(event) => handleSmtpChange(event.target.value, "smtp_host")}
                  />
                  <CFormInput
                    name="smtp_port"
                    size="sm"
                    type="number"
                    floatingClassName="mb-3"
                    floatingLabel={t("Port")}
                    placeholder={t("Port")}
                    value={smtpConfig.smtp_port}
                    onChange={(event) => handleSmtpChange(Number(event.target.value), "smtp_port")}
                  />

                  <CFormSelect
                    name="smtp_secure"
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
                    name="smtp_user"
                    size="sm"
                    type="text"
                    floatingClassName="mb-3"
                    floatingLabel={t("User")}
                    placeholder={t("User")}
                    value={smtpConfig.smtp_user}
                    onChange={(event) => handleSmtpChange(event.target.value, "smtp_user")}
                  />

                  <CFormInput
                    name="smtp_pass"
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
      </CCardBody>

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
