import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { convertToKey, setCookie } from "src/hooks";
import { showToast } from "../../store";

import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilUser, cifAl, cifGb } from "@coreui/icons";
import api from "src/hooks/api";

const Reset = () => {
  //#region constants
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [user, setUser] = useState("");
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

  const handleInputChange = (event) => {
    setUser(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (user === "") {
      dispatch(
        showToast({
          type: "warning",
          content: t("PleaseWriteYourUsernameOrEmail")
        })
      );
      return;
    }

    await api
      .post("/reset", {
        username: user,
      })
      .then((response) => {
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message))
          })
        );
        setUser("")
      })
      .catch((error) => {
        const { data, status } = error.response;
        dispatch(
          showToast({
            type: "danger",
            content: status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );
      })
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const keyUpHandler = (event) => {
      if (event.key === "Enter") {
        const el = document.getElementById("BtnReset");
        el.click();
      }
    };
    document.addEventListener("keyup", keyUpHandler);

    return () => {
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);
  //#endregion

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody className="p-4">
                <h1>{t("ResetPassword")}</h1>
                <p className="text-medium-emphasis">
                  {t("EnterYourUsernameOrEmailBelowToTesetYourPassword")}
                </p>

                <CForm onSubmit={handleSubmit}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      type="text"
                      placeholder={t("Username") + " " + t("Or") + " " + t("Email")}
                      value={user}
                      onChange={(event) => handleInputChange(event)}
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol xs={6}>
                      <CButton
                        type="submit"
                        id="BtnReset"
                        color="primary"
                        className="px-4"
                      >
                        {t("Reset")}
                      </CButton>
                    </CCol>
                    <CCol xs={6} className="text-end">
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
                            onClick={() => handleLanguageChange("sq")}
                          >
                            <CIcon icon={cifAl} />
                            <span className="ms-2">Shqip</span>
                          </CDropdownItem>
                          <CDropdownItem
                            onClick={() => handleLanguageChange("en")}
                          >
                            <CIcon icon={cifGb} />
                            <span className="ms-2">English</span>
                          </CDropdownItem>
                        </CDropdownMenu>
                      </CDropdown>
                    </CCol>
                  </CRow>
                </CForm>
                <Link to="/login">
                  <CButton color="link" className="mt-4 d-block mx-auto">
                    {t("BackToLogin") + "?"}
                  </CButton>
                </Link>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Reset;
