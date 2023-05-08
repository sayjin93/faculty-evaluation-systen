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
import { cilPen, cilTrash, cilCalendar, cilCheckAlt } from "@coreui/icons";

import {
  convertDateFormat,
  formatDate2,
  formatDateFromSQL,
  renderHeader,
} from "src/hooks";
import { setModal } from "../../store/reducers/modalSlice";
import { showToast } from "../../store/reducers/toastSlice";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

const Community = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = {
    event: "",
    time: new Date(),
    description: "",
    external: 0,
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
          let date = element.time ? formatDate2(element.time) : null;
          let checked = element.external ? (
            <CIcon icon={cilCheckAlt} size="sm" />
          ) : (
            ""
          );
          let createdAt = element.createdAt
            ? convertDateFormat(element.createdAt)
            : null;
          let updatedAt = element.updatedAt
            ? convertDateFormat(element.updatedAt)
            : null;

          return (
            <CTableRow key={id}>
              <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
              <CTableDataCell>{element.event}</CTableDataCell>
              <CTableDataCell>{date}</CTableDataCell>
              <CTableDataCell>{element.description}</CTableDataCell>
              <CTableDataCell className="text-center">{checked}</CTableDataCell>
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
                    onClick={() => deleteCommunity(id)}
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

  const deleteAllCommunity = async () => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/community-service")
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "All community services are deleted successful!",
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
  const fetchCommunity = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/community-service")
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
  const fetchOneCommunity = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/community-service/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          event: response.data.event,
          time: response.data.time,
          description: response.data.description,
          external: response.data.external,
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
  const addCommunity = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/community-service", {
        event: formData.event,
        time: formData.time,
        description: formData.description,
        external: formData.external,
      })
      .then((response) => {
        const event = response.data.event;

        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content:
              "Community service with title " +
              event +
              " was added successful!",
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
  const editCommunity = async (id) => {
    await axios
      .put(process.env.REACT_APP_API_URL + "/community-service/" + id, {
        event: formData.event,
        time: formData.time,
        description: formData.description,
        external: formData.external,
      })
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Community service with id " + id + " edited successful!",
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
  const deleteCommunity = async (id) => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/community-service/" + id)
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Community service with id " + id + " deleted successful!",
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
    fetchCommunity();
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
    if (modalOptions.editMode) fetchOneCommunity(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("CommunityServices")}</CHeaderBrand>

          <CButton color="dark" onClick={() => dispatch(setModal(true))}>
            {t("Add")}
          </CButton>
        </CContainer>
      </CHeader>

      <div id="temporary" className="mb-2">
        <CRow>
          <CCol>
            <CButton color="dark" onClick={() => deleteAllCommunity()}>
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
              ? t("Edit") + " " + t("CommunityService")
              : t("Add") + " " + t("New") + " " + t("CommunityService")}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Event")}
            placeholder={t("Event")}
            value={formData.event}
            onChange={(event) => handleInputChange(event, "event")}
          />

          <label className="form-label">{t("Time")}</label>
          <div className="input-group flex-nowrap mb-3">
            <span className="input-group-text">
              <CIcon icon={cilCalendar} />
            </span>
            <Flatpickr
              className="form-control"
              value={formData.time}
              options={{
                dateFormat: "d-m-Y",
              }}
              onChange={(dateObj) => {
                const date = dateObj[0];
                handleInputChange({ target: { value: date } }, "time");
              }}
            />
          </div>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("Description")}
            placeholder={t("Description")}
            value={formData.description}
            onChange={(event) => handleInputChange(event, "description")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("External")}
            placeholder={t("External")}
            value={formData.external}
            onChange={(event) => handleInputChange(event, "external")}
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
                ? editCommunity(modalOptions.selectedId)
                : addCommunity();
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

export default Community;
