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
import { cilPen, cilTrash, cilCalendar } from "@coreui/icons";

import headers from "../../constants/auth";

import {
  convertDateFormat,
  formatDateFromSQL,
  renderHeader,
} from "src/hooks/helpers";
import { setModal } from "../../store/reducers/modalSlice";
import { showToast } from "../../store/reducers/toastSlice";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

const Books = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    title: "",
    publicationHouse: "",
    publicationYear: new Date(),
    authors: "",
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
  // @ts-ignore
  const toast = useSelector((state) => state.modal.toast);
  //#endregion

  //#region functions
  const RenderTableBody = () => {
    return (
      <CTableBody>
        {items.map((element) => {
          const id = element.id;

          let publication = element.publication_year
            ? formatDateFromSQL(element.publication_year, true)
            : null;
          let createdAt = element.createdAt
            ? convertDateFormat(element.createdAt)
            : null;
          let updatedAt = element.updatedAt
            ? convertDateFormat(element.updatedAt)
            : null;

          return (
            <CTableRow key={id}>
              <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
              <CTableDataCell>{element.title}</CTableDataCell>
              <CTableDataCell>{element.publication_house}</CTableDataCell>
              <CTableDataCell>{publication}</CTableDataCell>
              <CTableDataCell>{element.authors}</CTableDataCell>
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
                    onClick={() => deleteBook(id)}
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

  const deleteAllBooks = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/books", {
        headers: headers,
      })
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "All books are deleted successful!",
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
  const fetchBooks = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/books", { headers: headers })
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
  const fetchOneBook = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/books/" + id, {
        headers: headers,
      })
      .then((response) => {
        setFormData({
          ...formData,
          title: response.data.title,
          publicationHouse: response.data.publication_house,
          publicationYear: response.data.publication_year,
          authors: response.data.authors,
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
  const addBook = async () => {
    await axios
      .post(
        process.env.REACT_APP_API_URL + "/books",
        {
          title: formData.title,
          publication_house: formData.publicationHouse,
          publication_year: formData.publicationYear,
          authors: formData.authors,
        },
        { headers: headers }
      )
      .then((response) => {
        const title = response.data.title;

        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Book with title " + title + " was added successful!",
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
    await axios
      .put(
        process.env.REACT_APP_API_URL + "/books/" + id,
        {
          title: formData.title,
          publication_house: formData.publicationHouse,
          publication_year: formData.publicationYear,
          authors: formData.authors,
        },
        { headers: headers }
      )
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Book with id " + id + " edited successful!",
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
    await axios
      .delete(process.env.REACT_APP_API_URL + "/books/" + id, {
        headers: headers,
      })
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Book with id " + id + " deleted successful!",
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
    fetchBooks();
  }, [status]);

  useEffect(() => {
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.title === "" ||
        formData.publicationHouse === "" ||
        formData.publicationYear === null ||
        formData.authors === "",
    });
  }, [formData]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneBook(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Books")}</CHeaderBrand>

          <CButton color="dark" onClick={() => dispatch(setModal(true))}>
            {t("Add")}
          </CButton>
        </CContainer>
      </CHeader>

      <div id="temporary" className="mb-2">
        <CRow>
          <CCol>
            <CButton color="dark" onClick={() => deleteAllBooks()}>
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
              ? t("Edit") + " " + t("Book")
              : t("Add") + " " + t("New") + " " + t("Book")}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("BookTitle")}
            placeholder={t("BookTitle")}
            value={formData.title}
            onChange={(event) => handleInputChange(event, "title")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Author(s)")}
            placeholder={t("Author(s)")}
            value={formData.authors}
            onChange={(event) => handleInputChange(event, "authors")}
          />

          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Publisher")}
            placeholder={t("Publisher")}
            value={formData.publicationHouse}
            onChange={(event) => handleInputChange(event, "publicationHouse")}
          />

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
                ? editBook(modalOptions.selectedId)
                : addBook();
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

export default Books;
