import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CCallout,
  CFormInput,
  CFormSelect,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";

import { DateTime } from "luxon";

const FormModal = ({ visible, setVisible, component }) => {
  //#region constants
  const { i18n, t } = useTranslation();
  console.log(component);
  const formElementId = component.toLowerCase() + "_";
  //#endregion

  //#region states
  const [canAdd, setCanAdd] = useState(true);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (
      !component ||
      (component !== "Professor" &&
        component !== "Course" &&
        component !== "Paper" &&
        component !== "Book" &&
        component !== "Conference" &&
        component !== "Community")
    ) {
      setCanAdd(false);
    } else {
      setCanAdd(true);
    }
  }, [component]);
  //#endregion

  return (
    <CModal
      backdrop="static"
      visible={visible}
      onClose={() => setVisible(false)}
    >
      <CModalHeader>
        <CModalTitle>
          {i18n.language === "sq"
            ? t("Add") + " " + t(component) + " " + " të ri"
            : t("Add") + " " + t("New") + " " + t(component)}
        </CModalTitle>
      </CModalHeader>
      <CModalBody>
        {component === "Professor" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "firstname"}
              floatingClassName="mb-3"
              floatingLabel={t("FirstName")}
              placeholder={t("FirstName")}
            />
            <CFormInput
              type="text"
              id={formElementId + "lastname"}
              floatingClassName="mb-3"
              floatingLabel={t("LastName")}
              placeholder={t("LastName")}
            />
            <CFormSelect id={formElementId + "gender"}>
              <option>{t("Gender")}</option>
              <option value="m">{t("Male")}</option>
              <option value="f">{t("Female")}</option>
            </CFormSelect>
          </>
        ) : component === "Course" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "name"}
              floatingClassName="mb-3"
              floatingLabel={t("CourseName")}
              placeholder={t("CourseName")}
            />
            <CFormInput
              type="text"
              id={formElementId + "number"}
              floatingClassName="mb-3"
              floatingLabel={t("CourseNumber")}
              placeholder={t("CourseNumber")}
            />
            <CFormInput
              type="number"
              id={formElementId + "semeser"}
              floatingClassName="mb-3"
              floatingLabel={t("Semester")}
              placeholder={t("Semester")}
            />
            <CFormInput
              type="number"
              id={formElementId + "hours"}
              floatingClassName="mb-3"
              floatingLabel={t("WeekHours")}
              placeholder={t("WeekHours")}
            />
            <CFormSelect id={formElementId + "program"}>
              <option>{t("Program")}</option>
              <option value="Bachelor">{t("Bachelor")}</option>
              <option value="Master">{t("Master")}</option>
            </CFormSelect>
          </>
        ) : component === "Paper" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "title"}
              floatingClassName="mb-3"
              floatingLabel={t("PaperTitle")}
              placeholder={t("PaperTitle")}
            />
            <CFormInput
              type="text"
              id={formElementId + "journal"}
              floatingClassName="mb-3"
              floatingLabel={t("Journal")}
              placeholder={t("Journal")}
            />
            <CFormInput
              type="date"
              id={formElementId + "publication"}
              floatingClassName="mb-3"
              floatingLabel={t("PublicationYear")}
              defaultValue={DateTime.local().toISODate()}
            />
          </>
        ) : component === "Book" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "title"}
              floatingClassName="mb-3"
              floatingLabel={t("BookTitle")}
              placeholder={t("BookTitle")}
            />
            <CFormInput
              type="text"
              id={formElementId + "authors"}
              floatingClassName="mb-3"
              floatingLabel={t("Author(s)")}
              placeholder={t("Author(s)")}
            />
            <CFormInput
              type="text"
              id={formElementId + "publisher"}
              floatingClassName="mb-3"
              floatingLabel={t("Publisher")}
              placeholder={t("Publisher")}
            />
            <CFormInput
              type="date"
              id={formElementId + "publication"}
              floatingClassName="mb-3"
              floatingLabel={t("PublicationYear")}
              defaultValue={DateTime.local().toISODate()}
            />
          </>
        ) : component === "Conference" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "name"}
              floatingClassName="mb-3"
              floatingLabel={t("ConferenceName")}
              placeholder={t("ConferenceName")}
            />
            <CFormInput
              type="text"
              id={formElementId + "location"}
              floatingClassName="mb-3"
              floatingLabel={t("Location")}
              placeholder={t("Location")}
            />
            <CFormInput
              type="text"
              id={formElementId + "dates"}
              floatingClassName="mb-3"
              floatingLabel={t("Dates")}
              placeholder={t("Dates")}
            />
            <CFormInput
              type="text"
              id={formElementId + "presentation_title"}
              floatingClassName="mb-3"
              floatingLabel={t("PresentationTitle")}
              placeholder={t("PresentationTitle")}
            />
            <CFormInput
              type="text"
              id={formElementId + "authors"}
              floatingClassName="mb-3"
              floatingLabel={t("Authors")}
              placeholder={t("Authors")}
            />
          </>
        ) : component === "CommunityService" ? (
          <>
            <CFormInput
              type="text"
              id={formElementId + "event"}
              floatingClassName="mb-3"
              floatingLabel={t("Event")}
              placeholder={t("Event")}
            />
            <CFormInput
              type="text"
              id={formElementId + "time"}
              floatingClassName="mb-3"
              floatingLabel={t("EventTime")}
              placeholder={t("EventTime")}
            />
            <CFormInput
              type="text"
              id={formElementId + "description"}
              floatingClassName="mb-3"
              floatingLabel={t("Description")}
              placeholder={t("Description")}
            />
          </>
        ) : (
          // handle the default case when component is not matched with any condition
          <CCallout color="danger">
            <p>{t("AnErrorOccurred")} !</p>
            <p className="m-0">
              {t("PleaseContactTheAdministrator")}
              {": "}
              <Link to="mailto:jkruja2@uet.edu.al">jkruja2@uet.edu.al</Link>
            </p>
          </CCallout>
        )}
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setVisible(false)}>
          Close
        </CButton>
        <CButton disabled={!canAdd} color={canAdd ? "primary" : "light"}>
          {t("Add")}
        </CButton>
      </CModalFooter>
    </CModal>
  );
};

export default FormModal;
