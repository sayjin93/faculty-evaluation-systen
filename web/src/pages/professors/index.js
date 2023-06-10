import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  CButton,
  CButtonGroup,
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
import { useNavigate } from "react-router-dom";

const Professors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultFormData = { firstname: "", lastname: "", gender: "m" };
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
          let gender = element.gender === "m" ? t("Male") : t("Female");
          let createdAt = element.createdAt
            ? convertDateFormat(element.createdAt)
            : null;
          let updatedAt = element.updatedAt
            ? convertDateFormat(element.updatedAt)
            : null;

          return (
            <CTableRow key={id}>
              <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
              <CTableDataCell>{element.first_name}</CTableDataCell>
              <CTableDataCell>{element.last_name}</CTableDataCell>
              <CTableDataCell>{gender}</CTableDataCell>
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
                    onClick={() => deleteProfessor(id)}
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

  const fetchProfessors = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/professors")
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

        if (error.response.status === 401) {
          // Remove the JWT token from the Local Storage
          // localStorage.removeItem("jwt_token");

          // Redirect the user to the login page
          navigate("/login", { replace: true });
        }
      });
  };
  const fetchOneProfessor = async (id) => {
    await axios
      .get(process.env.REACT_APP_API_URL + "/professors/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          firstname: response.data.first_name,
          lastname: response.data.last_name,
          gender: response.data.gender,
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
  const addProfessor = async () => {
    await axios
      .post(process.env.REACT_APP_API_URL + "/professors", {
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
      })
      .then((response) => {
        const firstName = response.data.first_name;
        const lastName = response.data.last_name;

        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content:
              "Professor " +
              firstName +
              " " +
              lastName +
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
  const editProfessor = async (id) => {
    await axios
      .put(process.env.REACT_APP_API_URL + "/professors/" + id, {
        firstname: formData.firstname,
        lastname: formData.lastname,
        gender: formData.gender,
      })
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Professor with id " + id + " edited successful!",
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
  const deleteProfessor = async (id) => {
    await axios
      .delete(process.env.REACT_APP_API_URL + "/professors/" + id)
      .then((response) => {
        setStatus(response);
        dispatch(
          showToast({
            type: "success",
            content: "Professor with id " + id + " deleted successful!",
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
    fetchProfessors();
  }, [status]);

  useEffect(() => {
    setModalOptions({
      ...modalOptions,
      disabled:
        formData.firstname === "" ||
        formData.lastname === "" ||
        formData.gender === "",
    });
  }, [formData]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneProfessor(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Professors")}</CHeaderBrand>

          <CButton color="dark" onClick={() => dispatch(setModal(true))}>
            {t("Add")}
          </CButton>
        </CContainer>
      </CHeader>

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
            {modalOptions.editMode ? t("Edit") : t("Add")}
          </CModalTitle>
        </CModalHeader>

        <CModalBody>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("FirstName")}
            placeholder={t("FirstName")}
            value={formData.firstname}
            onChange={(event) => handleInputChange(event, "firstname")}
          />
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel={t("LastName")}
            placeholder={t("LastName")}
            value={formData.lastname}
            onChange={(event) => handleInputChange(event, "lastname")}
          />
          <CFormSelect
            floatingLabel={t("Gender")}
            onChange={(event) => handleInputChange(event, "gender")}
            value={formData.gender}
          >
            <option value="m">{t("Male")}</option>
            <option value="f">{t("Female")}</option>
          </CFormSelect>
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
                ? editProfessor(modalOptions.selectedId)
                : addProfessor();
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

export default Professors;
