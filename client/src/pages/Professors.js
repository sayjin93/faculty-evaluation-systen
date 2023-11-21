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
  CForm,
  CFormCheck,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash } from "@coreui/icons";
import { BsGenderMale, BsGenderFemale } from "react-icons/bs"
import { ImCross } from "react-icons/im"

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

  const defaultFormData = { first_name: "", last_name: "", gender: "m", is_deleted: false };
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
        is_deleted: formData.is_deleted,
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
    const textboxVal = event.target.value

    setFormData({
      ...formData,
      [fieldName]: fieldName === "is_deleted" ? checkboxVal : textboxVal,
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
            <CFormInput
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("FirstName")}
              placeholder={t("FirstName")}
              value={formData.first_name}
              onChange={(event) => handleInputChange(event, "first_name")}
            />
            <CFormInput
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("LastName")}
              placeholder={t("LastName")}
              value={formData.last_name}
              onChange={(event) => handleInputChange(event, "last_name")}
            />
            <CFormSelect
              floatingClassName="mb-3"
              floatingLabel={t("Gender")}
              onChange={(event) => handleInputChange(event, "gender")}
              value={formData.gender}
            >
              <option value="m">{t("Male")}</option>
              <option value="f">{t("Female")}</option>
            </CFormSelect>
            <CFormCheck
              type="checkbox"
              label={t("Deleted")}
              onChange={(event) => handleInputChange(event, "is_deleted")}
              defaultChecked={formData.is_deleted}
            />
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
