import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CImage,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";

//icons
import CIcon from "@coreui/icons-react";
import { cilLockLocked } from "@coreui/icons";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";

//store
import { showToast } from "src/store";

//images
import icon from "src/assets/images/icon.svg";

//components
import PasswordCriteria from "src/components/PasswordCriteria";
import LanguagesDropdown from "src/components/LanguagesDropdown";

const ResetToken = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  //#endregion

  //#region states
  const [state, setState] = useState({
    newPassword: "",
    retypePassword: "",
  });
  const [viewPass, setViewPass] = useState({
    new: false,
    retype: false,
  });
  //#endregion

  //#region functions
  const handeViewPassStateChange = (key, value) => {
    setViewPass((prevState) => {
      return {
        ...prevState,
        [key]: !value,
      };
    });
  };

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
        setState((prevState) => {
          return { ...prevState, view: 2 }; // Change the view property to 2, keep other properties unchanged
        });
      })
      .catch((error) => {
        const { data, status } = error.response;

        // Dispatches a Redux action to show a warning toast with the error message.
        dispatch(
          showToast({
            type: "warning",
            content:
              status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );

        // Redirect the user to the login page
        navigate("/login", { replace: true });
      });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (state.newPassword === "" || state.retypePassword === "") {
      dispatch(
        showToast({
          type: "warning",
          content: t("PleaseFillTheFormWithNewPassword"),
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
      return;
    }

    await api
      .post(`/reset/${token}`, {
        password: state.newPassword,
      })
      .then((response) => {
        // Redirect the user to the login page
        navigate("/login", { replace: true });

        // Show toast with success message
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message)),
          })
        );
      })
      .catch((error) => {
        const { data, status } = error.response;

        // Show toast with the error message.
        dispatch(
          showToast({
            type: "danger",
            content:
              status !== 500 ? t(convertToKey(data.message)) : error.message,
          })
        );
      });
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
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10}>
            <CCardGroup className="overflow-hidden">
              <CCard className="p-4">
                <CCardBody>
                  <h4>{t("ResetPassword")}</h4>
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
                        type={viewPass.new ? "text" : "password"}
                        placeholder={t("NewPassword")}
                        value={state.newPassword}
                        onChange={(event) =>
                          handleInputChange(event, "newPassword")
                        }
                      />
                      <CButton
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={() =>
                          handeViewPassStateChange("new", viewPass.new)
                        }
                      >
                        {viewPass.new ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </CButton>
                    </CInputGroup>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} className="text-primary" />
                      </CInputGroupText>
                      <CFormInput
                        required
                        type={viewPass.retype ? "text" : "password"}
                        placeholder={t("RetypePassword")}
                        value={state.retypePassword}
                        onChange={(event) =>
                          handleInputChange(event, "retypePassword")
                        }
                      />
                      <CButton
                        type="button"
                        color="secondary"
                        variant="outline"
                        onClick={() =>
                          handeViewPassStateChange("retype", viewPass.retype)
                        }
                      >
                        {viewPass.retype ? (
                          <AiOutlineEyeInvisible />
                        ) : (
                          <AiOutlineEye />
                        )}
                      </CButton>
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
                        <LanguagesDropdown />
                      </CCol>
                    </CRow>
                  </CForm>

                  <CButton
                    color="link"
                    size="sm"
                    className="mt-4 d-block mx-auto"
                    onClick={() => navigate("/login")}
                  >
                    <IoIosArrowRoundBack /> {t("BackToLogin")}
                  </CButton>
                </CCardBody>
              </CCard>
              <CCard className="p-4 text-white bg-primary">
                <CImage
                  className="overlayBg register"
                  src={icon}
                  height={200}
                />

                <CCardBody className="text-center">
                  <p className="pb-4">
                    {t("StrengthenYourShield")}
                    <br />
                    {t("FollowThePasswordCriteriaBelow")}
                  </p>

                  <PasswordCriteria password={state.newPassword} />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ResetToken;
