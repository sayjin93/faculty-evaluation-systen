import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  CButton,
  CButtonGroup,
  CCol,
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
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash } from "@coreui/icons";

import headers from "../../constants/auth";

import { convertDateFormat, renderHeader } from "src/hooks/helpers";
import { setModal } from "../../store/reducers/modalSlice";
import { showToast } from "../../store/reducers/toastSlice";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

const Courses = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    courseName: "",
    courseNumber: "",
    semester: "",
    weekHours: "",
    program: "",
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
  // @ts-ignore
  const modal = useSelector((state) => state.modal.modal);
  //#endregion

  //#region functions
  const RenderTableBody = () => {
    return (
      <CTableBody>
        {items.map((element) => {
          const id = element.id;
          let program = element.program === 1 ? "MP" : "MSc";

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
              <CTableDataCell>{createdAt}</CTableDataCell>
              <CTableDataCell>{updatedAt}</CTableDataCell>
              <CTableDataCell>
                <CButtonGroup role="group" aria-label="Basic example" size="sm">
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
  };

  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const deleteAllCourses = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/courses", {
        headers: headers,
      })
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "All courses are deleted successful!",
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
  const fetchCourses = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/courses", { headers: headers })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: error.response.statusText,
          })
        );

        if (error.response.status === 401) navigate("/login");
      });
  };
  const fetchOneCourse = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/courses/" + id, {
        headers: headers,
      })
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
        debugger;
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
      .post(
        process.env.REACT_APP_API_URL + "/courses",
        {
          name: formData.courseName,
          number: formData.courseNumber,
          semester: formData.semester,
          week_hours: formData.weekHours,
          program: formData.program,
        },
        { headers: headers }
      )
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
      .put(
        process.env.REACT_APP_API_URL + "/courses/" + id,
        {
          name: formData.courseName,
          number: formData.courseNumber,
          semester: formData.semester,
          week_hours: formData.weekHours,
          program: formData.program,
        },
        { headers: headers }
      )
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
      .delete(process.env.REACT_APP_API_URL + "/courses/" + id, {
        headers: headers,
      })
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
    fetchCourses();
  }, [status]);

  useEffect(() => {
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.courseName === "" ||
        formData.courseNumber === "" ||
        formData.semester === "" ||
        formData.weekHours === "",
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

      <div id="temporary" className="mb-2">
        <CRow>
          <CCol>
            <CButton color="dark" onClick={() => deleteAllCourses()}>
              Delete All
            </CButton>
          </CCol>
        </CRow>
      </div>

      <SelectBoxProfessors />

      <CTable responsive striped hover align="middle">
        {renderHeader(items)}
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
            {modalOptions.editMode
              ? t("Edit") + " " + t("Course")
              : t("Add") + " " + t("New") + " " + t("Course")}
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
            floatingClassName="mb-3"
            floatingLabel={t("Semester")}
            placeholder={t("Semester")}
            value={formData.semester}
            onChange={(event) => handleInputChange(event, "semester")}
          />
          <CFormInput
            type="number"
            floatingClassName="mb-3"
            floatingLabel={t("WeekHours")}
            placeholder={t("WeekHours")}
            value={formData.weekHours}
            onChange={(event) => handleInputChange(event, "weekHours")}
          />
          <CFormSelect
            floatingLabel={t("Program")}
            onChange={(event) => handleInputChange(event, "program")}
            value={formData.program}
          >
            <option value="Bachelor">{t("Bachelor")}</option>
            <option value="Master">{t("Master")}</option>
          </CFormSelect>
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
