import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { convertDateFormat } from "src/hooks";

import TableHeader from "src/hooks/tableHeader";
import useErrorHandler from "../hooks/useErrorHandler";

import { setModal, showToast } from "../store";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
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

const Conferences = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const defaultFormData = {
    name: "",
    location: "",
    presentTitle: "",
    authors: "",
    dates: "",
    professor: "",
  };
  //#endregion

  //#region selectors
  const { professors, selectedProfessor, modal, academicYearId } = useSelector(
    (state) => ({
      professors: state.professors.list,
      selectedProfessor: state.professors.selected,
      modal: state.modal.modal,
      academicYearId: state.settings.academicYear.id,
    })
  );
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
  const addConference = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/conferences", {
        name: formData.name,
        location: formData.location,
        present_title: formData.presentTitle,
        authors: formData.authors,
        dates: formData.dates,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const name = response.data.name;
        dispatch(
          showToast({
            type: "success",
            content: "Conference with name " + name + " was added successful!",
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
  const editConference = async (id) => {
    await axios
      .put(process.env.REACT_APP_API_URL + "/conferences/" + id, {
        name: formData.name,
        location: formData.location,
        present_title: formData.presentTitle,
        authors: formData.authors,
        dates: formData.dates,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Conference with id " + id + " edited successful!",
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
  const deleteConference = async (id) => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/conferences/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Conference with id " + id + " deleted successful!",
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
      if (modalOptions.editMode) editConference(modalOptions.selectedId);
      else addConference();
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

            // Find the professor with the matching ID
            const professor = professors.find(
              (prof) => prof.id === element.professor_id
            );
            const professorFullName = professor
              ? professor.first_name + " " + professor.last_name
              : "";

            let createdAt = element.createdAt
              ? convertDateFormat(element.createdAt)
              : null;
            let updatedAt = element.updatedAt
              ? convertDateFormat(element.updatedAt)
              : null;

            return (
              <CTableRow key={id}>
                <CTableHeaderCell scope="row" className="text-end">
                  {index + 1}
                </CTableHeaderCell>
                <CTableDataCell>{element.name}</CTableDataCell>
                <CTableDataCell>{element.location}</CTableDataCell>
                <CTableDataCell>{element.present_title}</CTableDataCell>
                <CTableDataCell>{element.authors}</CTableDataCell>
                <CTableDataCell>{element.dates}</CTableDataCell>
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
                      onClick={() => deleteConference(id)}
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
            <CTableHeaderCell colSpan={8}>
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
    const fetchConferences = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/conferences/academic_year/${academicYearId}`
        )
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchConferences();
  }, [status]);

  useEffect(() => {
    const fefetchOneConference = async (id) => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/conferences/" + id)
        .then((response) => {
          setFormData({
            ...formData,
            name: response.data.name,
            location: response.data.location,
            presentTitle: response.data.present_title,
            authors: response.data.authors,
            dates: response.data.dates,
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

    if (modalOptions.editMode) fefetchOneConference(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="m-0">{t("Conferences")}</h6>
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
              feedbackInvalid={t("PleaseProvideConferenceName")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("ConferenceName")}
              placeholder={t("ConferenceName")}
              value={formData.name}
              onChange={(event) => handleInputChange(event, "name")}
            />
            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideConferenceLocation")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Location")}
              placeholder={t("Location")}
              value={formData.location}
              onChange={(event) => handleInputChange(event, "location")}
            />
            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideConferenceDates")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Dates")}
              placeholder={t("Dates")}
              value={formData.dates}
              onChange={(event) => handleInputChange(event, "dates")}
            />

            <CFormInput
              required
              feedbackInvalid={t("PleaseProvidePresentationTitle")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("PresentationTitle")}
              placeholder={t("PresentationTitle")}
              value={formData.presentTitle}
              onChange={(event) => handleInputChange(event, "presentTitle")}
            />

            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideAuthors")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Authors")}
              placeholder={t("Authors")}
              value={formData.authors}
              onChange={(event) => handleInputChange(event, "authors")}
            />

            <CFormSelect
              required
              feedbackInvalid={t("PleaseSelectAProfessor")}
              className="cursor"
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

export default Conferences;
