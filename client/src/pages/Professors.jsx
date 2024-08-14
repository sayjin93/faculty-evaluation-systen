import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//devextreme
import DataSource from "devextreme/data/data_source";
import { SelectBox, TextBox } from "devextreme-react";
import { Column, HeaderFilter } from "devextreme-react/data-grid";
import { Validator, RequiredRule } from "devextreme-react/validator";

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
import { PiBuildingsBold } from "react-icons/pi";

const defaultFormData = {
  id: 0,
  first_name: "",
  last_name: "",
  gender: "m",
  username: "",
  email: "",
  department_id: null,
  is_verified: true,
};
const Professors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);
  //#endregion

  //#region refs
  const departmentValidatorRef = useRef(null);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [validated, setValidated] = useState(false);
  const [action, setAction] = useState(null);
  //#endregion

  console.log("formData", formData);

  //#region memoized data
  const fromUngroupedData = useMemo(() => {
    return new DataSource({
      store: {
        type: "array",
        data: departments,
        key: "id",
      },
      group: "faculty_id",
    });
  }, [departments]);
  //#endregion

  //#region functions
  const fetchDepartments = async () => {
    try {
      const response = await api.get("/department");
      const responseData = response.data;

      // Use a Set to track unique faculty_ids and filter the faculties
      const uniqueFacultiesMap = new Map();

      responseData.forEach((item) => {
        if (!uniqueFacultiesMap.has(item.faculty_id)) {
          uniqueFacultiesMap.set(item.faculty_id, {
            id: item.faculty_id,
            key: item.Faculty.key, // Use the Faculty.key
          });
        }
      });

      const uniqueFaculties = Array.from(uniqueFacultiesMap.values());
      setFaculties(uniqueFaculties);
      setDepartments(responseData);
    } catch (error) {
      handleError(error);
    }
  };

  //form
  const closeForm = () => {
    dispatch(setModal());
    setFormData(defaultFormData);
    setAction(null);
    setValidated(false);
  };
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
    let newValue;

    if (fieldName === "department_id") {
      newValue = event.value;
    } else if (fieldName === "is_verified") {
      // Handle checkbox inputs differently for "is_verified"
      newValue = event.target.checked;
    } else {
      // For other fields, use the textbox value
      newValue = event.target.value;
    }

    setFormData({
      ...formData,
      [fieldName]: newValue,
    });
  };
  const handleAddEditFormSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const validateDepartment =
      departmentValidatorRef.current.instance.validate();

    if (form.checkValidity() === false || !validateDepartment.isValid) {
      event.stopPropagation();
    } else {
      if (action === "edit") editProfessor();
      else addProfessor();
      dispatch(setModal());
    }
    setValidated(true);
  };
  //selectbox
  const Field = (data) => {
    return (
      <TextBox
        placeholder={t("SelectDepartment")}
        defaultValue={data && t(data.key)}
      />
    );
  };
  const Item = (data) => {
    return <div>{t(data.key)}</div>;
  };
  const Group = ({ key }) => {
    const selectedFaculty = faculties.find((faculty) => faculty.id === key);

    return (
      <div className="custom-icon">
        <PiBuildingsBold className="nav-icon" /> {t(selectedFaculty.key)}
      </div>
    );
  };

  //Professors Actions
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
  const fetchOneProfessor = async (id) => {
    await api
      .get("/professor/" + id)
      .then((response) => {
        const { data } = response;

        setFormData({
          ...formData,
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          gender: data.gender,
          username: data.username,
          email: data.email,
          department_id: data.department_id,
          is_verified: data.is_verified,
        });
        setAction("edit");
        dispatch(setModal("addEditProfessor"));
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
        email: formData.email,
        department_id: formData.department_id,
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
        department_id: formData.department_id,
        is_verified: formData.is_verified,
      })
      .then((response) => {
        setValidated(false);
        fetchProfessors(); // refetch professors

        debugger;
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
          onClick={() => fetchOneProfessor(id)}
        >
          <CIcon icon={cilPen} />
        </CButton>

        <CButton
          color={deletedAt ? "success" : "danger"}
          variant="outline"
          onClick={() => {
            const selectedProfessor = items.find((item) => item.id === id);
            setFormData(selectedProfessor);
            setAction(deletedAt ? "restore" : "delete");
            dispatch(setModal("deleteRestoreProfessor"));
          }}
        >
          {deletedAt ? (
            <CIcon icon={cilMediaPlay} />
          ) : (
            <CIcon icon={cilTrash} />
          )}
        </CButton>
      </CButtonGroup>
    );
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchProfessors();
    fetchDepartments();
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
            onClick={() => {
              dispatch(setModal("addEditProfessor"));
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
                <HeaderFilter
                  dataSource={[
                    {
                      text: t("Deleted"),
                      value: ["deletedAt", "<>", null],
                    },
                    {
                      text: t("Active"),
                      value: ["deletedAt", "=", null],
                    },
                  ]}
                />
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
        onClose={closeForm}
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
            <CRow xs={{ cols: 2, gutter: 3 }} lg={{ cols: 3 }}>
              <CCol>
                <CFormInput
                  required
                  type="text"
                  floatingLabel={t("FirstName")}
                  placeholder={t("FirstName")}
                  value={formData?.first_name}
                  onChange={(event) => handleFullName(event, "first_name")}
                />
              </CCol>
              <CCol>
                <CFormInput
                  required
                  type="text"
                  floatingLabel={t("LastName")}
                  placeholder={t("LastName")}
                  value={formData?.last_name}
                  onChange={(event) => handleFullName(event, "last_name")}
                />
              </CCol>
              <CCol>
                <CFormSelect
                  floatingClassName="mb-3"
                  floatingLabel={t("Gender")}
                  onChange={(event) => handleInputChange(event, "gender")}
                  value={formData?.gender}
                >
                  <option value="m">{t("Male")}</option>
                  <option value="f">{t("Female")}</option>
                </CFormSelect>
              </CCol>
            </CRow>

            <CRow xs={{ cols: 2, gutter: 3 }} className="mb-3">
              <CCol>
                <CFormInput
                  required
                  type="text"
                  floatingLabel={t("Username")}
                  placeholder={t("Username")}
                  value={formData?.username}
                  onChange={(event) => handleInputChange(event, "username")}
                />
              </CCol>
              <CCol>
                <CFormInput
                  required
                  type="email"
                  floatingLabel={t("Email")}
                  placeholder={t("Email")}
                  value={formData?.email}
                  onChange={(event) => handleInputChange(event, "email")}
                />
              </CCol>
            </CRow>

            <CRow xs={{ cols: 1, gutter: 3 }} className="mb-3">
              <CCol>
                <SelectBox
                  dataSource={
                    departments.length > 0 ? fromUngroupedData : departments
                  }
                  valueExpr="id"
                  displayExpr="key"
                  grouped={true}
                  searchEnabled={true}
                  searchExpr="key"
                  fieldRender={Field}
                  itemRender={Item}
                  deferRendering={false}
                  groupRender={Group}
                  value={formData?.department_id}
                  onValueChanged={(event) =>
                    handleInputChange(event, "department_id")
                  }
                >
                  <Validator ref={departmentValidatorRef}>
                    <RequiredRule message={t("DepartmentIsRequired")} />
                  </Validator>
                </SelectBox>
              </CCol>
            </CRow>

            {action === "edit" && (
              <CRow xs={{ cols: 1, gutter: 3 }}>
                <CCol>
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
            <CButton color="secondary" onClick={closeForm}>
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
        onClose={closeForm}
      >
        <CModalHeader>
          <CModalTitle>{t("Confirmation")}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <span>
            {action === "restore"
              ? t("AreYouSureToRestoreTheSelected") + " ?"
              : t("AreYouSureToDeleteTheSelected") + " ?"}
          </span>
        </CModalBody>

        <CModalFooter>
          <CButton color="light" onClick={closeForm}>
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
