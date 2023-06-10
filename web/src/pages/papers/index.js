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

import { convertDateFormat, renderHeader } from "src/hooks";
import { setModal, showToast } from "../../store";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

const Papers = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    title: "",
    journal: "",
    publication: new Date(),
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

          let publication = element.publication
            ? convertDateFormat(element.publication, false)
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
              <CTableDataCell>{element.journal}</CTableDataCell>
              <CTableDataCell>{publication}</CTableDataCell>
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
  };

  const handleInputChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.value,
    });
  };

  const deleteAllPapers = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/papers")
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "All papers are deleted successful!",
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

  const fetchOnePaper = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/papers/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          title: response.data.title,
          journal: response.data.journal,
          publication: response.data.publication,
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
  const addPaper = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/papers", {
        title: formData.title,
        journal: formData.journal,
        publication: formData.publication,
      })
      .then((response) => {
        const title = response.data.title;

        setStatus(response);
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
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchPapers = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/papers")
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
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.title === "" ||
        formData.journal === "" ||
        formData.publication === null,
    });
  }, [formData]);

  useEffect(() => {
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

      <div id="temporary" className="mb-2">
        <CRow>
          <CCol>
            <CButton color="dark" onClick={() => deleteAllPapers()}>
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
              ? t("Edit") + " " + t("Paper")
              : t("Add") + " " + t("New") + " " + t("Paper")}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("PaperTitle")}
            placeholder={t("PaperTitle")}
            value={formData.title}
            onChange={(event) => handleInputChange(event, "title")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Journal")}
            placeholder={t("Journal")}
            value={formData.journal}
            onChange={(event) => handleInputChange(event, "journal")}
          />

          <label className="form-label">{t("Publication")}</label>
          <div className="input-group flex-nowrap">
            <span className="input-group-text" id="basic-addon1">
              <CIcon icon={cilCalendar} />
            </span>
            <Flatpickr
              aria-describedby="basic-addon1"
              className="form-control"
              value={formData.publication}
              options={{
                dateFormat: "d-m-Y",
              }}
              onChange={(dateObj) => {
                const date = dateObj[0];
                handleInputChange({ target: { value: date } }, "publication");
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
                ? editPaper(modalOptions.selectedId)
                : addPaper();
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

export default Papers;
