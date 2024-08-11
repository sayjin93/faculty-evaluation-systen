import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Column, HeaderFilter } from "devextreme-react/data-grid";

//coreUI
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMediaPlay, cilPen, cilTrash } from "@coreui/icons";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs";
import { ImCross, ImCheckmark } from "react-icons/im";

//react-icons
import { FaChalkboardTeacher } from "react-icons/fa";

//hooks
import { capitalizeWords, convertToKey, lowercaseNoSpace } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast } from "src/store";
import { getModal } from "src/store/selectors";

//components
import CustomDataGrid from "src/components/CustomDataGrid";

const Professors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(null);
  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState(null)
  //#endregion

  //#region functions
  const handleFullName = (event, fieldName) => {
    const inputValue = capitalizeWords(event.target.value);

    let newUser = {
      ...formData,
      [fieldName]: inputValue,
    };

    // Automatically set email when first_name or last_name changed
    if (fieldName === "first_name" || fieldName === "last_name") {
      const firstName =
        fieldName === "first_name" ? inputValue : formData?.first_name;
      const lastName =
        fieldName === "last_name" ? inputValue : formData?.last_name;

      if (firstName && lastName) {
        const username = lowercaseNoSpace(`${firstName[0]}${lastName}`);
        newUser.username = username;
        newUser.email = username + "@uet.edu.al";
      }
    }

    setFormData(newUser);
  };
  const handleInputChange = (event, fieldName) => {
    const checkboxVal = event.target.checked;
    const inputValue = event.target.value;

    let newValue;

    if (fieldName === "is_verified") {
      // Handle checkbox inputs differently for "is_verified"
      newValue = checkboxVal;
    } else {
      // For other fields, use the textbox value
      newValue = inputValue;
    }

    setFormData({
      ...formData,
      [fieldName]: newValue,
    });
  };
  const handleAddEditFormSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (action === "edit") editProfessor();
      else addProfessor();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //Actions
  const fetchProfessors = async () => {
    await api
      .get("/professor")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };
  const addProfessor = async () => {
    await api
      .post("/professor", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        username: formData.username,
        email: formData.email,
      })
      .then((response) => {
        const firstName = response.data.first_name;
        const lastName = response.data.last_name;

        setValidated(false);
        fetchProfessors(); // refetch professors
        dispatch(
          showToast({
            type: "success",
            content:
              t("Professor") +
              " " +
              firstName +
              " " +
              lastName +
              " " +
              t("WasAddedSuccessfully"),
          })
        );

        dispatch(setModal());
      })
      .catch((error) => {
        if (error.response) {
          dispatch(
            showToast({
              type: "danger",
              content: t(convertToKey(error.response.data.message)),
            })
          );
        } else {
          dispatch(
            showToast({
              type: "danger",
              content: error.message,
            })
          );
        }
      });
  };
  const editProfessor = async () => {
    await api
      .put("/professor/" + formData.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        username: formData.username,
        email: formData.email,
        is_verified: formData.is_verified,
      })
      .then((response) => {
        setValidated(false);
        fetchProfessors(); // refetch professors
        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message)),
          })
        );

        dispatch(setModal());
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
  const deleteProfessor = async () => {
    await api
      .delete("/professor/" + formData.id)
      .then(() => {
        fetchProfessors(); // refetch professors
        dispatch(
          showToast({
            type: "success",
            content: t("ProfessorDeletedSuccessfully"),
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: t(convertToKey(error.response.data.message)),
          })
        );
      });

    dispatch(setModal());
  };
  const restoreProfessor = async () => {
    await api
      .post("/professor/restore/" + formData.id)
      .then(() => {
        fetchProfessors(); // refetch professors
        dispatch(
          showToast({
            type: "success",
            content: t("ProfessorRestoredSuccessfully"),
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: error.message,
          })
        );
      });

    dispatch(setModal());
  };

  //DataGrid
  const cellRenderGender = (data) => {
    let icon =
      data.value === "Male" ? (
        <BsGenderMale className="text-primary" />
      ) : (
        <BsGenderFemale className="text-danger" />
      );
    let gender = t(data.value);

    return (
      <div className="flex flex-gap-10">
        <span>{icon}</span>
        <span>{gender}</span>
      </div>
    );
  };
  const cellRenderVerified = ({ data }) => {
    const checked = data.is_verified ? (
      <ImCheckmark title={t("Verified")} className="text-success" />
    ) : (
      <ImCross title={t("Disabled")} className="text-danger" />
    );
    return checked;
  };
  const cellRenderDeleted = ({ data }) => {
    const deleted = data.deletedAt ? (
      <ImCross title={t("Deleted")} className="text-danger" />
    ) : (
      ""
    );
    return deleted;
  };
  const cellRenderActions = ({ data }) => {
    const { id, deletedAt } = data;

    return (
      <CButtonGroup role="group" aria-label="Button Actions" size="sm">
        <CButton
          color="primary"
          variant="outline"
          onClick={() => {
            const selectedProfessor = items.find(item => item.id === id);
            setFormData(selectedProfessor);
            setAction("edit");
            dispatch(setModal("addEditProfessor"));
          }}
        >
          <CIcon icon={cilPen} />
        </CButton>

        <CButton
          color={deletedAt ? "success" : "danger"}
          variant="outline"
          onClick={() => {
            const selectedProfessor = items.find(item => item.id === id);
            setFormData(selectedProfessor);
            setAction(deletedAt ? "restore" : "delete");
            dispatch(setModal('deleteRestoreProfessor'));
          }}
        >
          {deletedAt ? <CIcon icon={cilMediaPlay} /> : <CIcon icon={cilTrash} />}
        </CButton>
      </CButtonGroup>
    );
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchProfessors();
  }, []);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <FaChalkboardTeacher />
            <span className="title">{t("Professors")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("addEditProfessor"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <CSpinner color="primary" />
          </div>
        ) : (
          <CCardBody>
            <CustomDataGrid dataSource={items}>
              <Column
                dataField="first_name"
                caption={t("FirstName")}
                dataType="string"
              />
              <Column
                dataField="last_name"
                caption={t("LastName")}
                dataType="string"
              />
              <Column
                dataField="gender"
                caption={t("Gender")}
                dataType="string"
                cellRender={cellRenderGender}
              />
              <Column
                dataField="username"
                caption={t("Username")}
                dataType="string"
              />
              <Column dataField="email" caption={t("Email")} dataType="string" />
              <Column
                width={140}
                alignment="center"
                dataField="is_verified"
                caption={t("Verified")}
                dataType="string"
                cellRender={cellRenderVerified}
              >
                <HeaderFilter
                  dataSource={[
                    {
                      text: t("Verified"),
                      value: ["is_verified", "=", true],
                    },
                    {
                      text: t("Disabled"),
                      value: ["is_verified", "=", false],
                    },
                  ]}
                />
              </Column>
              <Column
                width={140}
                alignment="center"
                dataField="deletedAt"
                caption={t("Deleted")}
                dataType="string"
                cellRender={cellRenderDeleted}
              >
                <HeaderFilter dataSource={[{
                  text: t('Deleted'),
                  value: ['deletedAt', '<>', null],
                }, {
                  text: t('Active'),
                  value: ['deletedAt', '=', null],
                }]} />
              </Column>
              <Column
                dataField="createdAt"
                caption={t("CreatedAt")}
                dataType="datetime"
                visible={false}
              />
              <Column
                dataField="updatedAt"
                caption={t("UpdatedAt")}
                dataType="datetime"
                visible={false}
              />
              <Column
                alignment="center"
                caption={t("Actions")}
                width={120}
                cellRender={cellRenderActions}
              />
            </CustomDataGrid>
          </CCardBody>
        )}
      </CCard>

      <CModal
        id="addEditProfessor"
        backdrop="static"
        visible={modal.isOpen && modal.id === "addEditProfessor"}
        onClose={() => {
          dispatch(setModal());
          setFormData(null);
          setAction(null);
        }}
      >
        <CForm
          className="needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleAddEditFormSubmit}
        >
          <CModalHeader>
            <CModalTitle>
              {action === "edit" ? t("Edit") : t("Add")}
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel={t("FirstName")}
                  placeholder={t("FirstName")}
                  value={formData?.first_name}
                  onChange={(event) => handleFullName(event, "first_name")}
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel={t("LastName")}
                  placeholder={t("LastName")}
                  value={formData?.last_name}
                  onChange={(event) => handleFullName(event, "last_name")}
                />
              </CCol>
            </CRow>

            <CFormSelect
              floatingClassName="mb-3"
              floatingLabel={t("Gender")}
              onChange={(event) => handleInputChange(event, "gender")}
              value={formData?.gender}
            >
              <option value="m">{t("Male")}</option>
              <option value="f">{t("Female")}</option>
            </CFormSelect>

            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel={t("Username")}
                  placeholder={t("Username")}
                  value={formData?.username}
                  onChange={(event) => handleInputChange(event, "username")}
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="email"
                  floatingLabel={t("Email")}
                  placeholder={t("Email")}
                  value={formData?.email}
                  onChange={(event) => handleInputChange(event, "email")}
                />
              </CCol>
            </CRow>

            {action === "edit" && (
              <CRow>
                <CCol xs={12} className="mb-3">
                  <CFormCheck
                    type="checkbox"
                    label={t("Verified")}
                    onChange={(event) =>
                      handleInputChange(event, "is_verified")
                    }
                    defaultChecked={formData?.is_verified}
                  />
                </CCol>
              </CRow>
            )}
          </CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                dispatch(setModal());
                setValidated(false);
              }}
            >
              {t("Close")}
            </CButton>
            <CButton type="submit">
              {action === "edit" ? t("Edit") : t("Add")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        id="deleteRestoreProfessor"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteRestoreProfessor"}
        onClose={() => {
          dispatch(setModal());
        }}
      >
        <CModalHeader>
          <CModalTitle>{t("Confirmation")}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <span>
            {action === "restore"
              ? t("AreYouSureToRestoreTheSelected") + " ?"
              : t("AreYouSureToDeleteTheSelected") + " ?"
            }
          </span>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="light"
            onClick={() => {
              dispatch(setModal());
            }}
          >
            {t("Cancel")}
          </CButton>
          <CButton
            onClick={() => {
              if (action === "restore") {
                restoreProfessor();
              } else {
                deleteProfessor();
              }
            }}
            color={action === "restore" ? "success" : "danger"}
          >
            {action === "restore" ? t("Restore") : t("Delete")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Professors;
