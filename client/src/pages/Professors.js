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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash } from "@coreui/icons";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs"
import { ImCross, ImCheckmark } from "react-icons/im"

//react-icons
import { FaChalkboardTeacher } from "react-icons/fa"

//hooks
import { convertToKey } from "src/hooks";
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

  const defaultFormData = { first_name: "", last_name: "", gender: "m", username: "", email: "", is_verified: true, is_deleted: false };
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [status, setStatus] = useState(null);
  const [validated, setValidated] = useState(false);
  const [modalOptions, setModalOptions] = useState({
    editMode: false,
    selectedId: -1,
  });
  //#endregion

  console.log(formData);

  //#region functions
  const fetchProfessors = async () => {
    await api
      .get("/professor")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOneProfessor = async (id) => {
    await api
      .get("/professor/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          gender: response.data.gender,
          username: response.data.username,
          email: response.data.email,
          is_verified: response.data.is_verified,
          is_deleted: response.data.is_deleted,
        });
        dispatch(setModal("editProfessor"));
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
  const addProfessor = async () => {
    await api
      .post("/professor", {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        username: formData.username,
        email: formData.email
      })
      .then((response) => {
        const firstName = response.data.first_name;
        const lastName = response.data.last_name;

        setStatus(response);
        setValidated(false);

        dispatch(
          showToast({
            type: "success",
            content:
              t("Professor") + " " + firstName + " " + lastName + " " + t("WasAddedSuccessfully"),
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
  const editProfessor = async (id) => {
    await api
      .put("/professor/" + id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: formData.gender,
        username: formData.username,
        email: formData.email,
        is_verified: formData.is_verified,
        is_deleted: formData.is_deleted,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

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
  };
  const deleteProfessor = async (id) => {
    await api
      .delete("/professor/" + id)
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: t("ProfessorWithId") + " " + id + " " + t("DeletedSuccessfully"),
          })
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          dispatch(
            showToast({
              type: "danger",
              content:
                t("CannotDeleteItDueToForeignKeyConstraint")
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

    dispatch(setModal());
  };

  const handleInputChange = (event, fieldName) => {
    const checkboxVal = event.target.checked;
    const textboxVal = event.target.value;

    let newValue;

    if (fieldName === "is_deleted" || fieldName === "is_verified") {
      // Handle checkbox inputs differently for "is_deleted" and "is_verified"
      newValue = checkboxVal;
    } else {
      // For other fields, use the textbox value
      newValue = textboxVal;
    }

    setFormData({
      ...formData,
      [fieldName]: newValue,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (modalOptions.editMode) editProfessor(modalOptions.selectedId);
      else addProfessor();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //DataGrid
  const cellRenderGender = (data) => {
    let icon = data.value === "Male" ? <BsGenderMale className="text-primary" /> : <BsGenderFemale className="text-danger" />
    let gender = t(data.value);

    return (
      <div className="flex flex-gap-10">
        <span>{icon}</span>
        <span>{gender}</span>
      </div>)
  }
  const cellRenderVerified = ({ data }) => {
    const checked = data.is_verified ? <ImCheckmark title={t("Verified")} className="text-success" /> : <ImCross title={t("Disabled")} className="text-danger" />;
    return checked;
  };
  const cellRenderDeleted = ({ data }) => {
    const checked = data.is_deleted ? (
      <ImCross title={t("Deleted")} className="text-danger" />
    ) : (
      ""
    );
    return checked;
  };
  const cellRenderActions = ({ data }) => {
    const { id } = data;

    return (
      <CButtonGroup
        role="group"
        aria-label="Button Actions"
        size="sm"
      >
        <CButton
          color="primary"
          variant="outline"
          onClick={() => {
            setModalOptions({
              ...modalOptions,
              editMode: true,
              selectedId: id,
            });
          }}
        >
          <CIcon icon={cilPen} />
        </CButton>

        <CButton
          color="danger"
          variant="outline"
          onClick={() => {
            setModalOptions({
              ...modalOptions,
              selectedId: id,
            });
            dispatch(setModal('deleteProfessor'));
          }}
        >
          <CIcon icon={cilTrash} />
        </CButton>
      </CButtonGroup>
    )
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchProfessors();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneProfessor(modalOptions.selectedId);
  }, [modalOptions.editMode]);
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
            onClick={() => dispatch(setModal("editProfessor"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

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
            <Column
              dataField="email"
              caption={t("Email")}
              dataType="string"
            />
            <Column
              width={140}
              alignment="center"
              dataField="is_verified"
              caption={t("Verified")}
              dataType="string"
              cellRender={cellRenderVerified}
            >
              <HeaderFilter dataSource={[{
                text: t('Verified'),
                value: ['is_verified', '=', true],
              }, {
                text: t('Disabled'),
                value: ['is_verified', '=', false],
              }]} />
            </Column>
            <Column
              width={140}
              alignment="center"
              dataField="is_deleted"
              caption={t("Deleted")}
              dataType="string"
              cellRender={cellRenderDeleted}
            >
              <HeaderFilter dataSource={[{
                text: t('Deleted'),
                value: ['is_deleted', '=', true],
              }, {
                text: t('Active'),
                value: ['is_deleted', '=', false],
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
      </CCard>

      <CModal
        id="editProfessor"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editProfessor"}
        onClose={() => {
          dispatch(setModal());
          setFormData(defaultFormData);
          setModalOptions({
            editMode: false,
            selectedId: -1,
          });
        }}
      >
        <CForm
          className="needs-validation"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          <CModalHeader>
            <CModalTitle>
              {modalOptions.editMode ? t("Edit") : t("Add")}
            </CModalTitle>
          </CModalHeader>

          <CModalBody>
            <CRow>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel={t("FirstName")}
                  placeholder={t("FirstName")}
                  value={formData.first_name}
                  onChange={(event) => handleInputChange(event, "first_name")}
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="text"
                  floatingLabel={t("LastName")}
                  placeholder={t("LastName")}
                  value={formData.last_name}
                  onChange={(event) => handleInputChange(event, "last_name")}
                />
              </CCol>
            </CRow>

            <CFormSelect
              floatingClassName="mb-3"
              floatingLabel={t("Gender")}
              onChange={(event) => handleInputChange(event, "gender")}
              value={formData.gender}
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
                  value={formData.username}
                  onChange={(event) => handleInputChange(event, "username")}
                />
              </CCol>
              <CCol xs={6} className="mb-3">
                <CFormInput
                  type="email"
                  floatingLabel={t("Email")}
                  placeholder={t("Email")}
                  value={formData.email}
                  onChange={(event) => handleInputChange(event, "email")}
                />
              </CCol>
            </CRow>

            {modalOptions.editMode && (
              <CRow>
                <CCol xs={6} className="mb-3">
                  <CFormCheck
                    type="checkbox"
                    label={t("Verified")}
                    onChange={(event) => handleInputChange(event, "is_verified")}
                    defaultChecked={formData.is_verified}
                  />
                </CCol>
                <CCol xs={6} className="mb-3">
                  <CFormCheck
                    type="checkbox"
                    label={t("Deleted")}
                    onChange={(event) => handleInputChange(event, "is_deleted")}
                    defaultChecked={formData.is_deleted}
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
              {modalOptions.editMode ? t("Update") : t("Add")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        id="deleteProfessor"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteProfessor"}
        onClose={() => {
          dispatch(setModal());
        }}
      >
        <CModalHeader>
          <CModalTitle>
            {t("Confirmation")}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <span>{t("AreYouSureToDeleteTheSelected") + " ?"}</span>
        </CModalBody>

        <CModalFooter>
          <CButton
            color="light"
            onClick={() => {
              dispatch(setModal())
            }}
          >
            {t("Cancel")}
          </CButton>
          <CButton onClick={() => deleteProfessor(modalOptions.selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Professors;
