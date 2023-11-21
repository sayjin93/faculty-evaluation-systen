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
import { PiBooksDuotone } from "react-icons/pi"

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
} from "src/store/selectors";

//flatpickr
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

//components
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import CustomDataGrid from "src/components/CustomDataGrid";

const Books = () => {
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
    publicationHouse: "",
    publicationYear: new Date(),
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
  const fetchBooks = async () => {
    await api
      .get(`/book/academic_year/${academicYearId}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOneBook = async (id) => {
    await api
      .get("/book/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          title: response.data.title,
          publicationHouse: response.data.publication_house,
          publicationYear: response.data.publication_year,
          professor: response.data.professor_id,
        });
        dispatch(setModal('editBook'));
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
  const addBook = async () => {
    await api
      .post("/book", {
        title: formData.title,
        publication_house: formData.publicationHouse,
        publication_year: formData.publicationYear,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const bookName = response.data.title;
        dispatch(
          showToast({
            type: "success",
            content: t("Book") + " " + bookName + " " + t("WasAddedSuccessfully"),
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
  const editBook = async (id) => {
    await api
      .put("/book/" + id, {
        title: formData.title,
        publication_house: formData.publicationHouse,
        publication_year: formData.publicationYear,
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
  const deleteBook = async (id) => {
    await api
      .delete("/book/" + id)
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: t("BookWithId") + " " + id + " " + t("DeletedSuccessfully"),
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
      if (modalOptions.editMode) editBook(modalOptions.selectedId);
      else addBook();
      dispatch(setModal())
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
            setModalOptions({
              ...modalOptions,
              selectedId: id,
            });
            dispatch(setModal('deleteBook'));
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
    fetchBooks();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneBook(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <PiBooksDuotone />
            <span className="title">{t("Books")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editBook"))}
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
              dataField="publication_house"
              caption={t("PublicationHouse")}
              dataType="string"
            />
            <Column
              alignment="center"
              dataField="publication_year"
              caption={t("PublicationYear")}
              dataType="date"
              format="year"
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
        id="editBook"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editBook"}
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
              feedbackInvalid={t("PleaseProvideBookTitle")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("BookTitle")}
              placeholder={t("BookTitle")}
              value={formData.title}
              onChange={(event) => handleInputChange(event, "title")}
            />

            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideBookPublisher")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Publisher")}
              placeholder={t("Publisher")}
              value={formData.publicationHouse}
              onChange={(event) => handleInputChange(event, "publicationHouse")}
            />

            <div className="mb-3">
              <label className="form-label">{t("PublicationYear")}</label>
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="basic-addon1">
                  <CIcon icon={cilCalendar} />
                </span>
                <Flatpickr
                  aria-describedby="basic-addon1"
                  className="form-control"
                  value={formData.publicationYear}
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  onChange={(dateObj) => {
                    const date = dateObj[0];
                    handleInputChange(
                      { target: { value: date } },
                      "publicationYear"
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
              floatingLabel={t("Author")}
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
                dispatch(setModal())
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
        id="deleteBook"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteBook"}
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
          <CButton onClick={() => deleteBook(modalOptions.selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Books;
