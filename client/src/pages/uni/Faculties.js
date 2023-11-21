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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash } from "@coreui/icons";
import { ImCross } from "react-icons/im"

//react-icons
import { PiBuildingsBold } from "react-icons/pi"

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast } from "src/store";
import { getModal } from "src/store/selectors";

//components
import CustomDataGrid from "src/components/CustomDataGrid";

const defaultFormData = { name: "", is_deleted: false };

const Faculties = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);
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
  const fetchFaculties = async () => {
    await api
      .get("/faculty")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOneFaculty = async (id) => {
    await api
      .get("/faculty/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          name: response.data.key,
          is_deleted: response.data.is_deleted
        });
        dispatch(setModal("editFaculty"));
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
  const addFaculty = async () => {
    await api
      .post("/faculty", {
        key: convertToKey(formData.name),
        is_deleted: formData.is_deleted
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        dispatch(
          showToast({
            type: "success",
            content:
              t("Faculty") + t("WasAddedSuccessfully"),
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
  const editFaculty = async (id) => {
    await api
      .put("/faculty/" + id, {
        key: convertToKey(formData.name),
        is_deleted: formData.is_deleted
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
  const deleteFaculty = async (id) => {
    await api
      .delete("/faculty/" + id)
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: t("FacultyWithId") + " " + id + " " + t("DeletedSuccessfully"),
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
      if (modalOptions.editMode) editFaculty(modalOptions.selectedId);
      else addFaculty();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //DataGrid
  const cellRenderFaculty = ({ data }) => {
    return t(data.key)
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
            dispatch(setModal('deleteFaculty'));
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
    fetchFaculties();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneFaculty(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <PiBuildingsBold />
            <span className="title">{t("Faculties")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editFaculty"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CustomDataGrid dataSource={items}>
            <Column
              dataField="key"
              caption={t("Name")}
              dataType="string"
              cellRender={cellRenderFaculty}
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
        id="editFaculty"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editFaculty"}
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
              floatingLabel={t("FacultyName")}
              placeholder={t("FacultyName")}
              value={formData.name !== "" ? t(formData.name) : ""}
              onChange={(event) => handleInputChange(event, "name")}
            />
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
        id="deleteFaculty"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteFaculty"}
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
          <CButton onClick={() => deleteFaculty(modalOptions.selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Faculties;
