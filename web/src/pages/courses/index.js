import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  CButton,
  CButtonGroup,
  CContainer,
  CFormInput,
  CFormSelect,
  CHeader,
  CHeaderBrand,
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
import { setModal, showToast } from "../../store";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import TableHeader from "src/hooks/tableHeader";

const Courses = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    courseName: "",
    courseNumber: "",
    semester: 0,
    weekHours: 0,
    program: 1,
  };
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(defaultFormData);
  const [status, setStatus] = useState(null);
  const [modalOptions, setModalOptions] = useState({
    editMode: false,
    selectedId: -1,
    disabled: true,
  });

  const { modal, academicYearId, professorId } = useSelector((state) => ({
    // @ts-ignore
    modal: state.modal.modal,
    // @ts-ignore
    academicYearId: state.settings.academicYear.id,
    // @ts-ignore
    professorId: state.settings.professorId,
  }));

  //#endregion

  //#region functions
  const RenderTableBody = () => {
    if (items.length > 0) {
      return (
        <CTableBody>
          {items.map((element) => {
            const id = element.id;

            let program = element.program === "Bachelor" ? "Bachelor" : "MSc";

            let createdAt = element.createdAt
              ? convertDateFormat(element.createdAt)
              : null;
            let updatedAt = element.updatedAt
              ? convertDateFormat(element.updatedAt)
              : null;

            return (
              <CTableRow key={id}>
                <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                <CTableDataCell>{element.name}</CTableDataCell>
                <CTableDataCell>{element.number}</CTableDataCell>
                <CTableDataCell>{element.semester}</CTableDataCell>
                <CTableDataCell>{element.week_hours}</CTableDataCell>
                <CTableDataCell>{program}</CTableDataCell>
                <CTableDataCell>{element.professor_id}</CTableDataCell>
                <CTableDataCell>{createdAt}</CTableDataCell>
                <CTableDataCell>{updatedAt}</CTableDataCell>
                <CTableDataCell>
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
            <CTableHeaderCell>{t("NoDataToDisplay")}</CTableHeaderCell>
          </CTableRow>
        </CTableBody>
      );
    }
  };

  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const fetchOneCourse = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/courses/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          courseName: response.data.name,
          courseNumber: response.data.number,
          semester: response.data.semester,
          weekHours: response.data.week_hours,
          program: response.data.program,
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
  const addCourse = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/courses", {
        name: formData.courseName,
        number: formData.courseNumber,
        semester: formData.semester,
        week_hours: formData.weekHours,
        program: formData.program,
        academic_year_id: academicYearId,
        professor_id: professorId,
      })
      .then((response) => {
        const courseName = response.data.name;

        setStatus(response);
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
      .put(process.env.REACT_APP_API_URL + "/courses/" + id, {
        name: formData.courseName,
        number: formData.courseNumber,
        semester: formData.semester,
        week_hours: formData.weekHours,
        program: formData.program,
        academic_year_id: academicYearId,
        professor_id: professorId,
      })
      .then((response) => {
        setStatus(response);
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
      .delete(process.env.REACT_APP_API_URL + "/courses/" + id)
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
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchCourses = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/courses")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          if (error.code === "ERR_NETWORK") {
            dispatch(
              showToast({
                type: "danger",
                content: error.message,
              })
            );
          } else if (error.code === "ERR_BAD_REQUEST") {
            // Remove the JWT token from the Local Storage
            localStorage.removeItem("jwt_token");

            // Redirect the user to the login page
            navigate("/login", { replace: true });

            // Show alert
            dispatch(
              showToast({
                type: "danger",
                content: error.response.statusText,
              })
            );
          }
        });
    };

    fetchCourses();
  }, [status]);

  useEffect(() => {
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.courseName === "" ||
        formData.courseNumber === "" ||
        formData.semester < 1 ||
        formData.semester > 2 ||
        formData.weekHours < 1,
    });
  }, [formData]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneCourse(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Courses")}</CHeaderBrand>

          <CButton color="dark" onClick={() => dispatch(setModal(true))}>
            {t("Add")}
          </CButton>
        </CContainer>
      </CHeader>

      <SelectBoxProfessors />

      <CTable responsive striped hover align="middle">
        <TableHeader items={items} />
        <RenderTableBody />
      </CTable>

      <CModal
        backdrop="static"
        visible={modal}
        onClose={() => {
          dispatch(setModal(false));
          setFormData(defaultFormData);
          setModalOptions({
            editMode: false,
            selectedId: -1,
            disabled: true,
          });
        }}
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
            floatingLabel={t("CourseName")}
            placeholder={t("CourseName")}
            value={formData.courseName}
            onChange={(event) => handleInputChange(event, "courseName")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("CourseNumber")}
            placeholder={t("CourseNumber")}
            value={formData.courseNumber}
            onChange={(event) => handleInputChange(event, "courseNumber")}
          />
          <CFormInput
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
            type="number"
            min={1}
            floatingClassName="mb-3"
            floatingLabel={t("WeekHours")}
            placeholder={t("WeekHours")}
            value={formData.weekHours === 0 ? "" : formData.weekHours}
            onChange={(event) => handleInputChange(event, "weekHours")}
          />
          <CFormSelect
            floatingClassName="mb-3"
            floatingLabel={t("Program")}
            onChange={(event) => handleInputChange(event, "program")}
            value={formData.program}
          >
            <option value="1">{t("Bachelor")}</option>
            <option value="2">{t("Master")}</option>
          </CFormSelect>
          <SelectBoxProfessors modal />
        </CModalBody>
        <CModalFooter>
          <CButton
            color="secondary"
            onClick={() => {
              dispatch(setModal(false));
            }}
          >
            {t("Close")}
          </CButton>
          <CButton
            disabled={modalOptions.disabled}
            onClick={() => {
              modalOptions.editMode
                ? editCourse(modalOptions.selectedId)
                : addCourse();
              dispatch(setModal(false));
            }}
          >
            {modalOptions.editMode ? t("Edit") : t("Add")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Courses;
