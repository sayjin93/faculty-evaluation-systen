import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
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

//icons
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cifAl, cifGb } from "@coreui/icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"

//hooks
import { convertToKey, setCookie } from "src/hooks";
import api from "src/hooks/api";

//store
import { showToast } from "src/store";

const ResetToken = () => {
  //#region constants
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  //#endregion

  //#region states
  const [state, setState] = useState({
    newPassword: "",
    retypePassword: ""
  });
  const [viewPass, setViewPass] = useState({
    new: false,
    retype: false,
  });
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

  const handeViewPassStateChange = (key, value) => {
    setViewPass(prevState => {
      return {
        ...prevState,
        [key]: !value,
      };
    })
  }

  const handleInputChange = (event, fieldName) => {
    setState({
      ...state,
      [fieldName]: event.target.value,
    });
  };

  const validateToken = async (resetToken) => {
    await api
      .get(`/reset/${resetToken}`)
      .then(() => {
        setState(prevState => {
          return { ...prevState, view: 2 }; // Change the view property to 2, keep other properties unchanged
        });
      })
      .catch((error) => {
        const { data, status } = error.response;

        // Dispatches a Redux action to show a warning toast with the error message.
        dispatch(
          showToast({
            type: "warning",
            content: status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );

        // Redirect the user to the login page
        navigate("/login", { replace: true });
      })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.newPassword === "" || state.retypePassword === "") {
      dispatch(
        showToast({
          type: "warning",
          content: t("PleaseFillTheFormWithNewPassword")
        })
      );
      return;
    }
    if (state.newPassword !== state.retypePassword) {
      dispatch(
        showToast({
          type: "danger",
          content: t("PasswordDoesNotMatch"),
        })
      );
      return
    }

    await api
      .post(`/reset/${token}`, {
        password: state.newPassword
      })
      .then((response) => {
        // Redirect the user to the login page
        navigate("/login", { replace: true });

        // Show toast with success message
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message))
          })
        );
      })
      .catch((error) => {
        const { data, status } = error.response;

        // Show toast with the error message.
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

    //validateToken
    validateToken(token);

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
                  {t("EnterYourNewPasswordBelow")}
                </p>

                <CForm onSubmit={handleSubmit}>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      placeholder={t("NewPassword")}
                      value={state.newPassword}
                      onChange={(event) => handleInputChange(event, "newPassword")}
                    />
                    <CButton type="button" color="secondary" variant="outline" onClick={() => handeViewPassStateChange("new", viewPass.new)}>{viewPass.new ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</CButton>
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} className="text-primary" />
                    </CInputGroupText>
                    <CFormInput
                      required
                      type="password"
                      placeholder={t("RetypePassword")}
                      value={state.retypePassword}
                      onChange={(event) => handleInputChange(event, "retypePassword")}
                    />
                    <CButton type="button" color="secondary" variant="outline" onClick={() => handeViewPassStateChange("retype", viewPass.retype)}>{viewPass.retype ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}</CButton>
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

export default ResetToken;
