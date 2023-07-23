import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  CButton,
  CButtonGroup,
  CContainer,
  CForm,
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
import { cilPen, cilTrash, cilCalendar } from "@coreui/icons";

import { convertDateFormat } from "src/hooks";
import { setModal, showToast } from "../store";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import TableHeader from "src/hooks/tableHeader";

const Papers = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    title: "",
    journal: "",
    publication: new Date(),
    professor: "",
  };
  //#endregion

  //#region selectors
  const { professors, selectedProfessor, modal, academicYearId } = useSelector(
    (state) => ({
      // @ts-ignore
      professors: state.professors.list,
      // @ts-ignore
      selectedProfessor: state.professors.selected,
      // @ts-ignore
      modal: state.modal.modal,
      // @ts-ignore
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
  const addPaper = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/papers", {
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
    await axios
      .put(process.env.REACT_APP_API_URL + "/papers/" + id, {
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
    await axios
      .delete(process.env.REACT_APP_API_URL + "/papers/" + id)
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
    if (items.length > 0) {
      return (
        <CTableBody>
          {filteredItems.map((element) => {
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
                <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                <CTableDataCell>{element.title}</CTableDataCell>
                <CTableDataCell>{element.journal}</CTableDataCell>
                <CTableDataCell>{publication}</CTableDataCell>
                <CTableDataCell>{professorFullName}</CTableDataCell>
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
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/papers/academic_year/${academicYearId}`
        )
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

    fetchPapers();
  }, [status]);

  useEffect(() => {
    const fetchOnePaper = async (id) => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/papers/" + id)
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
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Papers")}</CHeaderBrand>

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
