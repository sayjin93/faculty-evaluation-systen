import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Column } from "devextreme-react/data-grid";

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

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast } from "src/store";
import {
  getAcademicYearId,
  getProfessors,
  getSelectedProfessor,
  getModal,
} from "src/store/selectors/selectors";

//components
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import CustomDataGrid from "src/components/CustomDataGrid";

const Courses = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  const modal = useSelector(getModal);
  const academicYearId = useSelector(getAcademicYearId);

  const defaultFormData = {
    courseName: "",
    courseNumber: "",
    semester: 0,
    weekHours: 0,
    program: "",
    professor: "",
  };
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

  const filteredItems =
    Number(selectedProfessor) !== 0
      ? items.filter((item) => item.professor_id === Number(selectedProfessor))
      : items;
  //#endregion

  //#region functions
  const fetchCourses = async () => {
    await api
      .get(`/course/academic_year/${academicYearId}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOneCourse = async (id) => {
    await api
      .get("/course/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          courseName: response.data.name,
          courseNumber: response.data.number,
          semester: response.data.semester,
          weekHours: response.data.week_hours,
          program: response.data.program,
          professor: response.data.professor_id,
        });
        dispatch(setModal("editCourse"));
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
  const addCourse = async () => {
    await api
      .post("/course", {
        name: formData.courseName,
        number: formData.courseNumber,
        semester: formData.semester,
        week_hours: formData.weekHours,
        program: formData.program,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const courseName = response.data.name;
        dispatch(
          showToast({
            type: "success",
            content: t("Course") + " " + courseName + " " + t("WasAddedSuccessfully"),
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
  const editCourse = async (id) => {
    await api
      .put("/course/" + id, {
        name: formData.courseName,
        number: formData.courseNumber,
        semester: formData.semester,
        week_hours: formData.weekHours,
        program: formData.program,
        professor_id: formData.professor,
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
  const deleteCourse = async (id) => {
    await api
      .delete("/course/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: t("CourseWithId") + " " + id + " " + t("DeletedSuccessfully"),
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
              content: error,
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
      if (modalOptions.editMode) editCourse(modalOptions.selectedId);
      else addCourse();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //DataGrid
  const cellRenderProgram = ({ data }) => {
    const program = data.program === "Bachelor" ? "Bachelor" : "MSc";

    return program;
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
            setSelectedId(id);
            dispatch(setModal('deleteCourse'));
          }}
        >
          <CIcon icon={cilTrash} />
        </CButton>
      </CButtonGroup>
    )
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchCourses();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneCourse(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="m-0">{t("Courses")}</h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editCourse"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <SelectBoxProfessors className="mb-3" />

          {professors.length > 0 && (
            <CustomDataGrid dataSource={filteredItems}>
              <Column
                cssClass="bold"
                dataField="id"
                caption="#"
                dataType="number"
                width={55}
              />
              <Column
                dataField="name"
                caption={t("Name")}
                dataType="string"
              />
              <Column
                dataField="number"
                caption={t("Number")}
                dataType="string"
              />
              <Column
                alignment="center"
                dataField="semester"
                caption={t("Semester")}
                dataType="number"
                width={80}
              />
              <Column
                alignment="center"
                dataField="week_hours"
                caption={t("WeekHours")}
                dataType="number"
              />
              <Column
                dataField="program"
                caption={t("Program")}
                cellRender={cellRenderProgram}
              />
              <Column
                alignment="left"
                dataField="professor_full_name"
                caption={t("Professor")}
                dataType="string"
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
                cellRender={cellRenderActions}
              />
            </CustomDataGrid>
          )}

        </CCardBody>
      </CCard>

      <CModal
        id="editCourse"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editCourse"}

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
              required
              feedbackInvalid={t("PleaseProvideCourseName")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("CourseName")}
              placeholder={t("CourseName")}
              value={formData.courseName}
              onChange={(event) => handleInputChange(event, "courseName")}
            />
            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideCourseNumber")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("CourseNumber")}
              placeholder={t("CourseNumber")}
              value={formData.courseNumber}
              onChange={(event) => handleInputChange(event, "courseNumber")}
            />
            <CFormInput
              required
              feedbackInvalid={t("TheSemesterMustHaveAValueOf1Or2")}
              type="number"
              min={1}
              max={2}
              floatingClassName="mb-3"
              floatingLabel={`${t("Semester")} [1 ${t("Or")} 2]`}
              placeholder={t("Semester")}
              value={formData.semester === 0 ? "" : formData.semester}
              onChange={(event) => handleInputChange(event, "semester")}
            />
            <CFormInput
              required
              feedbackInvalid={t("MinimumValueAllowedIs") + " 1"}
              type="number"
              min={1}
              floatingClassName="mb-3"
              floatingLabel={t("WeekHours")}
              placeholder={t("WeekHours")}
              value={formData.weekHours === 0 ? "" : formData.weekHours}
              onChange={(event) => handleInputChange(event, "weekHours")}
            />
            <CFormSelect
              className="cursor"
              required
              feedbackInvalid={t("PleaseChooseProgram")}
              floatingClassName="mb-3"
              floatingLabel={t("Program")}
              onChange={(event) => handleInputChange(event, "program")}
              value={formData.program}
            >
              <option value="" disabled>
                {t("Choose") + "..."}
              </option>
              <option value="Bachelor">{t("Bachelor")}</option>
              <option value="Master">{t("Master")}</option>
            </CFormSelect>

            <CFormSelect
              className="cursor"
              required
              feedbackInvalid={t("PleaseSelectAProfessor")}
              floatingClassName="mb-3"
              floatingLabel={t("Professor")}
              value={formData.professor}
              onChange={(event) => handleInputChange(event, "professor")}
            >
              <option value="" disabled>
                {t("Choose") + "..."}
              </option>
              {professors.map((professor) => {
                const fullName =
                  professor.first_name + " " + professor.last_name;
                return (
                  <option key={professor.id} value={professor.id}>
                    {fullName}
                  </option>
                );
              })}
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
        id="deleteCourse"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteCourse"}
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
          <CButton onClick={() => deleteCourse(selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Courses;
