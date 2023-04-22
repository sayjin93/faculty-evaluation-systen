import React from "react";
import { useTranslation } from "react-i18next";
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
} from "@coreui/react";

import { setCookie } from "src/hooks/helpers";
import CIcon from "@coreui/icons-react";
import { cifAl, cifGb } from "@coreui/icons";

const Settings = () => {
  //#region constants
  const { i18n, t } = useTranslation();
  //#endregion

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    setCookie({
      key: "language",
      value: language,
      options: { path: "/" },
    });
  };

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Professors")}</CHeaderBrand>
        </CContainer>
      </CHeader>

      <CRow className="align-items-start">
        <CCol>
          <CCard
            color="dark"
            textColor="white"
            className="mb-3"
            style={{ maxWidth: "18rem" }}
          >
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
                  <CDropdownItem onClick={() => handleLanguageChange("sq")}>
                    <CIcon icon={cifAl} />
                    <span className="ms-2">Shqip</span>
                  </CDropdownItem>
                  <CDropdownItem onClick={() => handleLanguageChange("en")}>
                    <CIcon icon={cifGb} />
                    <span className="ms-2">English</span>
                  </CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard
            color="dark"
            textColor="white"
            className="mb-3"
            style={{ maxWidth: "18rem" }}
          >
            <CCardHeader>Other</CCardHeader>
            <CCardBody>Empty</CCardBody>
          </CCard>
        </CCol>
        <CCol>
          <CCard
            color="dark"
            textColor="white"
            className="mb-3"
            style={{ maxWidth: "18rem" }}
          >
            <CCardHeader>Other</CCardHeader>
            <CCardBody>Empty</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Settings;
