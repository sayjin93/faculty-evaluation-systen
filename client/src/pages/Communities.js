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
  CFormCheck,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen, cilTrash, cilCalendar, cilCheckAlt } from "@coreui/icons";

//react-icons
import { RiCommunityLine } from "react-icons/ri";

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

//flatpick
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";

//component
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import CustomDataGrid from "src/components/CustomDataGrid";

const Communities = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  const modal = useSelector(getModal);
  const academicYearId = useSelector(getAcademicYearId);

  const defaultFormData = {
    event: "",
    date: new Date(),
    description: "",
    external: false,
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
  const fetchCommunity = async () => {
    await api
      .get(`/community/academic_year/${academicYearId}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  const fetchOneCommunity = async (id) => {
    await api
      .get("/community/" + id)
      .then((response) => {
        setFormData({
          ...formData,
          event: response.data.event,
          date: response.data.date,
          description: response.data.description,
          external: response.data.external,
          professor: response.data.professor_id,
        });
        dispatch(setModal("editCommunity"));
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
    await api
      .post("/community", {
        event: formData.event,
        date: formData.date,
        description: formData.description,
        external: formData.external,
        academic_year_id: academicYearId,
        professor_id: formData.professor,
      })
      .then((response) => {
        setStatus(response);
        setValidated(false);

        const communityName = response.data.event;
        dispatch(
          showToast({
            type: "success",
            content: t("Community") + " " + communityName + " " + t("WasAddedSuccessfully"),

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
    await api
      .put("/community/" + id, {
        event: formData.event,
        date: formData.date,
        description: formData.description,
        external: formData.external,
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
  const deleteCommunity = async (id) => {
    await api
      .delete("/community/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: t("CommunityWithId") + " " + id + " " + t("DeletedSuccessfully"),
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

  const handleCheckChange = (event, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: event.target.checked,
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      if (modalOptions.editMode) editCommunity(modalOptions.selectedId);
      else addCommunity();
      dispatch(setModal());
    }
    setValidated(true);
  };

  //DataGrid
  const cellRenderExternal = ({ data }) => {
    const checked = data.external ? (
      <CIcon icon={cilCheckAlt} size="sm" />
    ) : (
      ""
    );
    return checked;
  };

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
            dispatch(setModal('deleteCommunity'));
          }}
        >
          <CIcon icon={cilTrash} />
        </CButton>
      </CButtonGroup>
    )
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchCommunity();
  }, [status]);

  useEffect(() => {
    if (modalOptions.editMode) fetchOneCommunity(modalOptions.selectedId);
  }, [modalOptions.editMode]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <RiCommunityLine />
            <span className="title">{t("CommunityServices")}</span>
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
              dataField="event"
              caption={t("Event")}
              dataType="string"
            />
            <Column
              alignment="center"
              dataField="date"
              caption={t("Date")}
              dataType="date"
              format="dd/MM/yyyy"
            />
            <Column

              dataField="description"
              caption={t("Description")}
              dataType="string"
            />
            <Column
              alignment="center"
              dataField="external"
              caption={t("External")}
              cellRender={cellRenderExternal}
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
        id="editCommunity"
        backdrop="static"
        visible={modal.isOpen && modal.id === "editCommunity"}
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
              feedbackInvalid={t("PleaseProvideEventName")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Event")}
              placeholder={t("Event")}
              value={formData.event}
              onChange={(event) => handleInputChange(event, "event")}
            />

            <div className="mb-3">
              <label className="form-label">{t("Date")}</label>
              <div className="input-group flex-nowrap">
                <span className="input-group-text" id="basic-addon1">
                  <CIcon icon={cilCalendar} />
                </span>
                <Flatpickr
                  aria-describedby="basic-addon1"
                  className="form-control"
                  value={formData.date}
                  options={{
                    dateFormat: "d-m-Y",
                  }}
                  onChange={(dateObj) => {
                    const date = dateObj[0];
                    handleInputChange({ target: { value: date } }, "date");
                  }}
                />
              </div>
            </div>

            <CFormInput
              required
              feedbackInvalid={t("PleaseProvideEventDescription")}
              type="text"
              floatingClassName="mb-3"
              floatingLabel={t("Description")}
              placeholder={t("Description")}
              value={formData.description}
              onChange={(event) => handleInputChange(event, "description")}
            />

            <div className="mb-3">
              <CFormCheck
                type="checkbox"
                label={t("External")}
                onChange={(event) => handleCheckChange(event, "external")}
                defaultChecked={formData.external}
              />
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
        id="deleteCommunity"
        backdrop="static"
        visible={modal.isOpen && modal.id === "deleteCommunity"}
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
          <CButton onClick={() => deleteCommunity(selectedId)} color="danger">
            {t("Delete")}
          </CButton>
        </CModalFooter>

      </CModal>
    </>
  );
};

export default Communities;
