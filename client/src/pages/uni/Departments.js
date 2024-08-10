import React, { useEffect, useMemo, useState } from "react";
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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMediaPlay, cilPen, cilTrash } from "@coreui/icons";

//devextreme
import { Column, HeaderFilter } from "devextreme-react/data-grid";

//icons
import { VscSymbolClass } from "react-icons/vsc";
import { ImCross } from "react-icons/im";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast } from "src/store";
import { getModal } from "src/store/selectors";

//components
import CustomDataGrid from "src/components/CustomDataGrid";

const Departments = () => {
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

  //#region memoized contants
  const departmentItems = useMemo(() => {
    return items.map(item => ({
      text: t(item.key),
      value: item.key,
    }));
  }, [items]);

  const facultyItems = useMemo(() => {
    return items.map(item => ({
      text: t(item.Faculty.key),
      value: item.Faculty.key,
    }));
  }, [items]);
  //#endregion

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
      if (action === "edit") editDepartment();
      else addDepartment();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //Actions
  const fetchDepartments = async () => {
    await api
      .get("/department")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };
  const addDepartment = async () => {
    await api
      .post("/department", {
        key: convertToKey(formData.name),
      })
      .then(() => {
        setValidated(false);
        fetchDepartments(); // refetch departments
        dispatch(
          showToast({
            type: "success",
            content: t("Department") + t("WasAddedSuccessfully"),
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
  const editDepartment = async () => {
    await api
      .put("/department/" + formData.id, {
        key: convertToKey(formData.name),
      })
      .then((response) => {
        setValidated(false);
        fetchDepartments(); // refetch departments
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
  const deleteDepartment = async () => {
    await api
      .delete("/department/" + formData.id)
      .then(() => {
        fetchDepartments(); // refetch departments
        dispatch(
          showToast({
            type: "success",
            content: t("DepartmentDeletedSuccessfully"),

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
  const restoreDepartment = async () => {
    await api
      .post("/department/restore/" + formData.id)
      .then(() => {
        fetchDepartments(); // refetch faculties
        dispatch(
          showToast({
            type: "success",
            content: t("DepartmentRestoredSuccessfully"),
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
  const cellRenderDepartment = ({ data }) => {
    return t(data.key);
  };
  const cellRenderFaculty = ({ data }) => {
    const { Faculty } = data;
    return <span className={Faculty.deletedAt ? "disabled" : ""} title={Faculty.deletedAt ? t("Deleted") : ""}>{t(Faculty.key)}</span>
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
            const selectedDepartment = items.find(item => item.id === id);
            setFormData(selectedDepartment);
            setAction("edit");
            dispatch(setModal("addEditDepartment"));
          }}
        >
          <CIcon icon={cilPen} />
        </CButton>

        <CButton
          color={deletedAt ? "success" : "danger"}
          variant="outline"
          onClick={() => {
            const selectedDepartment = items.find(item => item.id === id);
            setFormData(selectedDepartment);
            setAction(deletedAt ? "restore" : "delete");
            dispatch(setModal('deleteRestoreDepartment'));
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
    fetchDepartments();
  }, []);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <VscSymbolClass />
            <span className="title">{t("Departments")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("addEditDepartment"))}
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
                cellRender={cellRenderDepartment}
              >
                <HeaderFilter dataSource={departmentItems} />
              </Column>
              <Column
                dataField="faculty_key"
                caption={t("Faculty")}
                dataType="string"
                cellRender={cellRenderFaculty}
              >
                <HeaderFilter dataSource={facultyItems} />
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
        id="addEditDepartment"
        backdrop="static"
        visible={modal.isOpen && modal.id === "addEditDepartment"}
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
              required
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("DepartmentName")}
              placeholder={t("DepartmentName")}
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
              {action === "edit" ? t("Edit") : t("Add")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        id="deleteRestoreDepartment"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteRestoreDepartment"}
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
                restoreDepartment();
              } else {
                deleteDepartment();
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

export default Departments;
