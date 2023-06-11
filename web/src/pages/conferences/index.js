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
import { cilPen, cilTrash } from "@coreui/icons";

import { convertDateFormat, renderHeader } from "src/hooks";
import { setModal, showToast } from "../../store";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

const Conferences = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    name: "",
    location: "",
    presentTitle: "",
    authors: "",
    dates: "",
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
    if (items.length > 0) {
      return (
        <CTableBody>
          {items.map((element) => {
            const id = element.id;
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
                <CTableDataCell>{element.location}</CTableDataCell>
                <CTableDataCell>{element.present_title}</CTableDataCell>
                <CTableDataCell>{element.authors}</CTableDataCell>
                <CTableDataCell>{element.dates}</CTableDataCell>
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

  const deleteAllConferences = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/conferences")
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "All conferences are deleted successful!",
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
  const addConference = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/conferences", {
        name: formData.name,
        location: formData.location,
        present_title: formData.presentTitle,
        authors: formData.authors,
        dates: formData.dates,
      })
      .then((response) => {
        const name = response.data.name;

        setStatus(response);
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
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchConferences = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/conferences")
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

    fetchConferences();
  }, [status]);

  useEffect(() => {
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.name === "" ||
        formData.location === "" ||
        formData.presentTitle === null ||
        formData.authors === "" ||
        formData.dates === "",
    });
  }, [formData]);

  useEffect(() => {
    if (modalOptions.editMode) fefetchOneConference(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Conferences")}</CHeaderBrand>

          <CButton color="dark" onClick={() => dispatch(setModal(true))}>
            {t("Add")}
          </CButton>
        </CContainer>
      </CHeader>

      <div id="temporary" className="mb-2">
        <CRow>
          <CCol>
            <CButton color="dark" onClick={() => deleteAllConferences()}>
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
              ? t("Edit") + " " + t("Conference")
              : t("Add") + " " + t("New") + " " + t("Conference")}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("ConferenceName")}
            placeholder={t("ConferenceName")}
            value={formData.name}
            onChange={(event) => handleInputChange(event, "name")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Location")}
            placeholder={t("Location")}
            value={formData.location}
            onChange={(event) => handleInputChange(event, "location")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Dates")}
            placeholder={t("Dates")}
            value={formData.dates}
            onChange={(event) => handleInputChange(event, "dates")}
          />

          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("PresentationTitle")}
            placeholder={t("PresentationTitle")}
            value={formData.presentTitle}
            onChange={(event) => handleInputChange(event, "presentTitle")}
          />

          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Authors")}
            placeholder={t("Authors")}
            value={formData.authors}
            onChange={(event) => handleInputChange(event, "authors")}
          />
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
                ? editConference(modalOptions.selectedId)
                : addConference();
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

export default Conferences;
