import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
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

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";


//store
import { setModal, showToast } from "src/store";
import { getModal } from "src/store/selectors/selectors";
import CustomDataGrid from "src/components/CustomDataGrid";
import { Column } from "devextreme-react/data-grid";

const Professors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);

  const defaultFormData = { firstname: "", lastname: "", gender: "m" };
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
  const [selectedId, setSelectedId] = useState(null);
  //#endregion

  //#region functions
  const fetchProfessors = async () => {
    await api
      .get("/professor")
      .then((response) => {
        setItems(response.data.data);
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
          firstname: response.data.first_name,
          lastname: response.data.last_name,
          gender: response.data.gender,
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
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
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
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
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
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
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
    let icon = data.value === "m" ? <BsGenderMale className="text-primary" /> : <BsGenderFemale className="text-danger" />
    let gender = data.value === "m" ? t("Male") : t("Female");

    return (
      <div className="flex flex-gap-10">
        <span>{icon}</span>
        <span>{gender}</span>
      </div>)
  }
  const cellRenderGenderActions = ({ data }) => {
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
            setSelectedId(id);
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
          <h6 className="m-0">{t("Professors")}</h6>
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
              cssClass="bold"
              dataField="id"
              caption="#"
              dataType="number"
              width={55}
            />
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
              cellRender={cellRenderGenderActions}
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
              value={formData.firstname}
              onChange={(event) => handleInputChange(event, "firstname")}
            />
            <CFormInput
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("LastName")}
              placeholder={t("LastName")}
              value={formData.lastname}
              onChange={(event) => handleInputChange(event, "lastname")}
            />
            <CFormSelect
              floatingLabel={t("Gender")}
              onChange={(event) => handleInputChange(event, "gender")}
              value={formData.gender}
            >
              <option value="m">{t("Male")}</option>
              <option value="f">{t("Female")}</option>
            </CFormSelect>
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
              {modalOptions.editMode ? t("Edit") : t("Add")}
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
          <CButton onClick={() => deleteProfessor(selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Professors;
