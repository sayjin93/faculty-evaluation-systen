import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useErrorHandler from "src/hooks/useErrorHandler";
import api from "src/hooks/api";

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
import { cilPen, cilTrash, cilCalendar } from "@coreui/icons";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

import { convertDateFormat } from "src/hooks";
import TableHeader from "src/hooks/tableHeader";

import {
  getAcademicYearId,
  getProfessors,
  getSelectedProfessor,
  getModal,
} from "../store/selectors/selectors";
import { setModal, showToast } from "../store";

import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

const Papers = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  const modal = useSelector(getModal);
  const academicYearId = useSelector(getAcademicYearId);

  const defaultFormData = {
    title: "",
    journal: "",
    publication: new Date(),
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
  const addPaper = async () => {
    await api
      .post("papers", {
        title: formData.title,
        journal: formData.journal,
        publication: formData.publication,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const title = response.data.title;
        dispatch(
          showToast({
            type: "success",
            content: "Paper with title " + title + " was added successful!",
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
  const editPaper = async (id) => {
    await api
      .put("papers/" + id, {
        title: formData.title,
        journal: formData.journal,
        publication: formData.publication,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Paper with id " + id + " edited successful!",
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
  const deletePaper = async (id) => {
    await api
      .delete("papers/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Paper with id " + id + " deleted successful!",
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
      if (modalOptions.editMode) editPaper(modalOptions.selectedId);
      else addPaper();
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

            const publication = element.publication
              ? convertDateFormat(element.publication, false)
              : null;

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
                <CTableDataCell>{element.title}</CTableDataCell>
                <CTableDataCell>{element.journal}</CTableDataCell>
                <CTableDataCell>{publication}</CTableDataCell>
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
                      onClick={() => deletePaper(id)}
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
    const fetchPapers = async () => {
      await api
        .get(`papers/academic_year/${academicYearId}`)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchPapers();
  }, [status]);

  useEffect(() => {
    const fetchOnePaper = async (id) => {
      await api
        .get("papers/" + id)
        .then((response) => {
          setFormData({
            ...formData,
            title: response.data.title,
            journal: response.data.journal,
            publication: response.data.publication,
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

    if (modalOptions.editMode) fetchOnePaper(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="m-0">{t("Papers")}</h6>
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
              feedbackInvalid={t("PleaseProvidePaperTitle")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("PaperTitle")}
              placeholder={t("PaperTitle")}
              value={formData.title}
              onChange={(event) => handleInputChange(event, "title")}
            />
            <CFormInput
              required
              feedbackInvalid={t("PleaseProvidePaperJournal")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Journal")}
              placeholder={t("Journal")}
              value={formData.journal}
              onChange={(event) => handleInputChange(event, "journal")}
            />

            <div className="mb-3">
              <label className="form-label">{t("Publication")}</label>
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="basic-addon1">
                  <CIcon icon={cilCalendar} />
                </span>
                <Flatpickr
                  required
                  aria-describedby="basic-addon1"
                  className="form-control"
                  value={formData.publication}
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  onChange={(dateObj) => {
                    const date = dateObj[0];
                    handleInputChange(
                      { target: { value: date } },
                      "publication"
                    );
                  }}
                />
              </div>
            </div>

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

export default Papers;
