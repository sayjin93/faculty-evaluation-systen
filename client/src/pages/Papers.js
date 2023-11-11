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
import { cilPen, cilTrash, cilCalendar } from "@coreui/icons";

//react-icons
import { PiArticleMediumLight } from "react-icons/pi"

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

//flatpickr
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

//components
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import CustomDataGrid from "src/components/CustomDataGrid";

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
  const [selectedId, setSelectedId] = useState(null);

  const filteredItems =
    Number(selectedProfessor) !== 0
      ? items.filter((item) => item.professor_id === Number(selectedProfessor))
      : items;

  //#endregion

  //#region functions
  const fetchPapers = async () => {
    await api
      .get(`/paper/academic_year/${academicYearId}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOnePaper = async (id) => {
    await api
      .get("/paper/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          title: response.data.title,
          journal: response.data.journal,
          publication: response.data.publication,
          professor: response.data.professor_id,
        });
        dispatch(setModal("editPaper"));
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
  const addPaper = async () => {
    await api
      .post("/paper", {
        title: formData.title,
        journal: formData.journal,
        publication: formData.publication,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const paperName = response.data.title;
        dispatch(
          showToast({
            type: "success",
            content: t("Paper") + " " + paperName + " " + t("WasAddedSuccessfully"),
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
      .put("/paper/" + id, {
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
  const deletePaper = async (id) => {
    await api
      .delete("/paper/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: t("PaperWithId") + " " + id + " " + t("DeletedSuccessfully"),
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
      if (modalOptions.editMode) editPaper(modalOptions.selectedId);
      else addPaper();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //DataGrid
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
            dispatch(setModal('deletePaper'));
          }}
        >
          <CIcon icon={cilTrash} />
        </CButton>
      </CButtonGroup>
    )
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchPapers();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOnePaper(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <PiArticleMediumLight />
            <span className="title">{t("Papers")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editPaper"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <SelectBoxProfessors className="mb-3" />

          <CustomDataGrid dataSource={filteredItems}>
            <Column
              dataField="title"
              caption={t("Title")}
              dataType="string"
            />
            <Column
              dataField="journal"
              caption={t("Journal")}
              dataType="string"
            />
            <Column
              alignment="center"
              dataField="publication"
              caption={t("Publication")}
              dataType="date"
              format="dd/MM/yyyy"
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
        </CCardBody>
      </CCard>

      <CModal
        id="editPaper"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editPaper"}
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
                dispatch(setModal());
                setValidated(false);
              }}
            >
              {t("Close")}
            </CButton>
            <CButton type="submit">
              {modalOptions.editMode ? t("Update") : t("Add")}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CModal
        id="deletePaper"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deletePaper"}
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
          <CButton onClick={() => deletePaper(selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Papers;
