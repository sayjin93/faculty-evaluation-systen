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

//react-icons
import { GiVideoConference } from "react-icons/gi"

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";
import { convertToKey } from "src/hooks";

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

const Conferences = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  const modal = useSelector(getModal);
  const academicYearId = useSelector(getAcademicYearId);

  const defaultFormData = {
    name: "",
    location: "",
    presentTitle: "",
    authors: "",
    dates: "",
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
  const fetchConferences = async () => {
    await api
      .get(`/conference/academic_year/${academicYearId}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fefetchOneConference = async (id) => {
    await api
      .get("/conference/" + id)
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
        dispatch(setModal("editConference"));
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
  const addConference = async () => {
    await api
      .post("/conference", {
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

        const conferenceName = response.data.name;
        dispatch(
          showToast({
            type: "success",
            content: t("Conference") + " " + conferenceName + " " + t("WasAddedSuccessfully"),
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
    await api
      .put("/conference/" + id, {
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
  const deleteConference = async (id) => {
    await api
      .delete("/conference/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: t("ConferenceWithId") + " " + id + " " + t("DeletedSuccessfully"),
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
      if (modalOptions.editMode) editConference(modalOptions.selectedId);
      else addConference();
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
            dispatch(setModal('deleteConference'));
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
    fetchConferences();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fefetchOneConference(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <GiVideoConference />
            <span className="title">{t("Conferences")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editConference"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <SelectBoxProfessors className="mb-3" />

          <CustomDataGrid dataSource={filteredItems}>
            <Column
              dataField="name"
              caption={t("Name")}
              dataType="string"
            />
            <Column
              dataField="location"
              caption={t("Location")}
              dataType="string"
            />
            <Column
              dataField="present_title"
              caption={t("PresentTitle")}
              dataType="string"
            />
            <Column
              dataField="authors"
              caption={t("Authors")}
              dataType="string"
            />

            <Column
              dataField="dates"
              caption={t("Dates")}
              dataType="string"
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
        id="editConference"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editConference"}
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
        id="deleteConference"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteConference"}
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
          <CButton onClick={() => deleteConference(selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Conferences;
