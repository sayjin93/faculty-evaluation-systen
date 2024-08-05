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
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash, cilMediaPlay } from "@coreui/icons";
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

const Faculties = () => {
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

  console.log("items", items);
  console.log("formData", formData);
  console.log("action", action);

  //#region functions
  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };
  const handleAddEditFormSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (action === "edit") editFaculty();
      else addFaculty();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //Actions
  const fetchFaculties = async () => {
    // setIsLoading(true);

    await api
      .get("/faculty")
      .then((response) => {
        setItems(response.data);
        setIsLoading(false);

      })
      .catch((error) => {
        handleError(error);
        setIsLoading(false);
      });
  };
  const addFaculty = async () => {
    await api
      .post("/faculty", {
        key: convertToKey(formData.name),
      })
      .then(() => {
        setValidated(false);
        fetchFaculties(); // refetch faculties
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
  const editFaculty = async () => {
    await api
      .put("/faculty/" + formData.id, {
        key: convertToKey(formData.name),
      })
      .then((response) => {
        setValidated(false);
        fetchFaculties(); // refetch faculties
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
  const deleteFaculty = async () => {
    await api
      .delete("/faculty/" + formData.id)
      .then(() => {
        fetchFaculties(); // refetch faculties
        dispatch(
          showToast({
            type: "success",
            content: t("FacultyDeletedSuccessfully"),
          })
        );
      })
      .catch((error) => {
        if (error.response && error.response.status === 409) {
          dispatch(
            showToast({
              type: "danger",
              content: t("CannotDeleteItDueToForeignKeyConstraint"),
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
  const restoreFaculty = async () => {
    await api
      .post("/faculty/restore/" + formData.id)
      .then(() => {
        fetchFaculties(); // refetch faculties
        dispatch(
          showToast({
            type: "success",
            content: t("FacultyRestoredSuccessfully"),
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
  const cellRenderFaculty = ({ data }) => {
    return t(data.key)
  }
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
      <CButtonGroup
        role="group"
        aria-label="Button Actions"
        size="sm"
      >
        <CButton
          color="primary"
          variant="outline"
          onClick={() => {
            const selectedFaculty = items.find(item => item.id === id);
            setFormData(selectedFaculty);
            setAction("edit");
            dispatch(setModal("addEditFaculty"));
          }}
        >
          <CIcon icon={cilPen} />
        </CButton>

        <CButton
          color={deletedAt ? "success" : "danger"}
          variant="outline"
          onClick={() => {
            const selectedFaculty = items.find(item => item.id === id);
            setFormData(selectedFaculty);
            setAction(deletedAt ? "restore" : "delete");
            dispatch(setModal('deleteRestoreFaculty'));
          }}
        >
          {deletedAt ? <CIcon icon={cilMediaPlay} /> : <CIcon icon={cilTrash} />}
        </CButton>
      </CButtonGroup>
    )
  };

  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchFaculties();
  }, []);
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
            disabled={isLoading}
            color="primary"
            className="float-right"
            onClick={() => {
              setAction("add");
              dispatch(setModal("addEditFaculty"))
            }}
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
                dataField="key"
                caption={t("Name")}
                dataType="string"
                cellRender={cellRenderFaculty}
              />
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
        id="addEditFaculty"
        backdrop="static"
        visible={modal.isOpen && modal.id === "addEditFaculty"}
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
            <CFormInput
              type="text"
              required
              floatingClassName="mb-3"
              floatingLabel={t("FacultyName")}
              placeholder={t("FacultyName")}
              defaultValue={formData?.key && t(formData?.key)}
              onChange={(event) => handleInputChange(event, "name")}
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
              {action === "edit" ? t("Update") : t("Add")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        id="deleteRestoreFaculty"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteRestoreFaculty"}
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
              dispatch(setModal())
            }}
          >
            {t("Cancel")}
          </CButton>
          <CButton
            onClick={() => {
              if (action === "restore") {
                restoreFaculty();
              } else {
                deleteFaculty();
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

export default Faculties;
