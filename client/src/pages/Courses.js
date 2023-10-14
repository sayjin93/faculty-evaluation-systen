import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useErrorHandler from "src/hooks/useErrorHandler";

import axios from "axios";

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
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash } from "@coreui/icons";

import { convertDateFormat } from "src/hooks";

import {
  getAcademicYearId,
  getProfessors,
  getSelectedProfessor,
  getModal,
} from "../store/selectors/selectors";
import { setModal, showToast } from "../store";

import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import TableHeader from "src/hooks/tableHeader";

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

  const filteredItems =
    Number(selectedProfessor) !== 0
      ? items.filter((item) => item.professor_id === Number(selectedProfessor))
      : items;

  //#endregion

  //#region functions
  const addCourse = async () => {
    await axios
      .post("courses", {
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
            content: "Course " + courseName + " was added successful!",
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
    await axios
      .put("courses/" + id, {
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
            content: "Course with id " + id + " edited successful!",
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
    await axios
      .delete("courses/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Course with id " + id + " deleted successful!",
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
      dispatch(setModal(false));
    }
    setValidated(true);
  };

  const RenderTableBody = () => {
    if (filteredItems.length > 0) {
      return (
        <CTableBody>
          {filteredItems.map((element, index) => {
            const id = element.id;

            const program = element.program === "Bachelor" ? "Bachelor" : "MSc";

            // Find the professor with the matching ID
            const professor = professors.find(
              (prof) => prof.id === element.professor_id
            );
            const professorFullName = professor
              ? professor.first_name + " " + professor.last_name
              : "";

            const createdAt = element.createdAt
              ? convertDateFormat(element.createdAt)
              : null;
            const updatedAt = element.updatedAt
              ? convertDateFormat(element.updatedAt)
              : null;

            return (
              <CTableRow key={id}>
                <CTableHeaderCell scope="row" className="text-end">
                  {index + 1}
                </CTableHeaderCell>
                <CTableDataCell>{element.name}</CTableDataCell>
                <CTableDataCell>{element.number}</CTableDataCell>
                <CTableDataCell>{element.semester}</CTableDataCell>
                <CTableDataCell>{element.week_hours}</CTableDataCell>
                <CTableDataCell>{program}</CTableDataCell>
                <CTableDataCell>{professorFullName}</CTableDataCell>
                <CTableDataCell>{createdAt}</CTableDataCell>
                <CTableDataCell>{updatedAt}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CButtonGroup
                    role="group"
                    aria-label="Basic example"
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
                      onClick={() => deleteCourse(id)}
                    >
                      <CIcon icon={cilTrash} />
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            );
          })}
        </CTableBody>
      );
    } else {
      return (
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell colSpan={10}>
              {t("NoDataToDisplay")}
            </CTableHeaderCell>
          </CTableRow>
        </CTableBody>
      );
    }
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchCourses = async () => {
      await axios
        .get(`courses/academic_year/${academicYearId}`)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchCourses();
  }, [status]);

  useEffect(() => {
    const fetchOneCourse = async (id) => {
      await axios
        .get("courses/" + id)
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
          dispatch(setModal(true));
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
            onClick={() => dispatch(setModal(true))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>
        <CCardBody>
          <SelectBoxProfessors className="mb-3" />

          <CTable
            align="middle"
            className="mb-0 border"
            hover
            responsive
            bordered
          >
            <TableHeader items={items} />

            <RenderTableBody />
          </CTable>
        </CCardBody>
      </CCard>

      <CModal
        backdrop="static"
        visible={modal}
        onClose={() => {
          dispatch(setModal(false));
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
                dispatch(setModal(false));
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
    </>
  );
};

export default Courses;
