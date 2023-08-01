import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import useErrorHandler from "../hooks/useErrorHandler";

import axios from "axios";

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
import { cilPen, cilTrash } from "@coreui/icons";

import { convertDateFormat } from "src/hooks";
import { setModal, showToast } from "../store";
import TableHeader from "src/hooks/tableHeader";

const Professors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const defaultFormData = { firstname: "", lastname: "", gender: "m" };
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

  // @ts-ignore
  const modal = useSelector((state) => state.modal.modal);
  //#endregion

  //#region functions
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
        setValidated(false);

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
        setValidated(false);
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
        if (error.response && error.response.status === 409) {
          dispatch(
            showToast({
              type: "danger",
              content:
                "Cannot delete the professor because it has related records in another table.",
            })
          );
        } else {
          dispatch(
            showToast({
              type: "danger",
              content: error.message,
            })
          );
        }
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
      if (modalOptions.editMode) editProfessor(modalOptions.selectedId);
      else addProfessor();
      dispatch(setModal(false));
    }
    setValidated(true);
  };

  const RenderTableBody = () => {
    if (items.length > 0) {
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
                <CTableHeaderCell scope="row" className="text-end">
                  {id}
                </CTableHeaderCell>
                <CTableDataCell>{element.first_name}</CTableDataCell>
                <CTableDataCell>{element.last_name}</CTableDataCell>
                <CTableDataCell>{gender}</CTableDataCell>
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
    } else {
      return (
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell colSpan={7}>
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
    const fetchProfessors = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/professors")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchProfessors();
  }, [status]);

  useEffect(() => {
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

    if (modalOptions.editMode) fetchOneProfessor(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="m-0">{t("Professors")}</h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal(true))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>
        <CCardBody>
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

export default Professors;
