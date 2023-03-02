import React from "react";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CButtonGroup,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt } from "@coreui/icons";

import {
  fixTableHeaderName,
  formatDate2,
  isNullOrUndefined,
} from "src/hooks/helpers";

const PageTable = (props) => {
  //#region constants
  const { t } = useTranslation();
  const { items, component } = props;
  //#endregion

  //#region functions
  const RenderHeader = () => {
    try {
      const header = Object.keys(items[0]); // extract keys from the first object

      return (
        <CTableHead>
          <CTableRow color="dark">
            {header.map((element) => {
              let thead = fixTableHeaderName(element);
              if (element === "id") thead = "#";
              if (element === "professor_id") return;
              if (element === "academic_year_id") return;
              if (element === "scientific_work_id") return;

              return (
                <CTableHeaderCell key={element} scope="col">
                  {thead}
                </CTableHeaderCell>
              );
            })}
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
      );
    } catch (err) {
      // console.log(err);
    }
  };
  const RenderContent = () => {
    if (component === "Professor") {
      return items.map((element) => {
        const id = element.id;
        let gender = element.gender;
        if (gender === "m") gender = t("Male");
        else gender = t("Female");
        return (
          <CTableRow key={id}>
            <CTableHeaderCell scope="row">{element.id}</CTableHeaderCell>
            <CTableDataCell>{element.first_name}</CTableDataCell>
            <CTableDataCell>{element.last_name}</CTableDataCell>
            <CTableDataCell>{gender}</CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    } else if (component === "Courses") {
      return items.map((element) => {
        const id = element.id;
        let program = element.program;
        if (program === 1) program = "MP";
        else program = "MSc";
        return (
          <CTableRow key={element.id}>
            <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
            <CTableDataCell>{element.name}</CTableDataCell>
            <CTableDataCell>{element.number}</CTableDataCell>
            <CTableDataCell>{element.semester}</CTableDataCell>
            <CTableDataCell>{element.week_hours}</CTableDataCell>
            <CTableDataCell>{program}</CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    } else if (component === "Papers") {
      return items.map((element) => {
        const id = element.id;
        return (
          <CTableRow key={element.id}>
            <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
            <CTableDataCell>{element.title}</CTableDataCell>
            <CTableDataCell>{element.journal}</CTableDataCell>
            <CTableDataCell>{element.publication}</CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    } else if (component === "Books") {
      return items.map((element) => {
        const id = element.id;
        return (
          <CTableRow key={element.id}>
            <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
            <CTableDataCell>{element.title}</CTableDataCell>
            <CTableDataCell>{element.publication_house}</CTableDataCell>
            <CTableDataCell>{element.publication_year}</CTableDataCell>
            <CTableDataCell>{element.authors}</CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    } else if (component === "Conferences") {
      return items.map((element) => {
        const id = element.id;
        return (
          <CTableRow key={element.id}>
            <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
            <CTableDataCell>{element.name}</CTableDataCell>
            <CTableDataCell>{element.location}</CTableDataCell>
            <CTableDataCell>{element.present_title}</CTableDataCell>
            <CTableDataCell>{element.authors}</CTableDataCell>
            <CTableDataCell>{element.dates}</CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    } else if (component === "Community") {
      return items.map((element) => {
        const id = element.id;
        let date = element.time;
        if (isNullOrUndefined(date)) date = formatDate2(date);

        return (
          <CTableRow key={element.id}>
            <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
            <CTableDataCell>{element.event}</CTableDataCell>
            <CTableDataCell>{date}</CTableDataCell>
            <CTableDataCell>{element.description}</CTableDataCell>
            <CTableDataCell className="text-center">
              {element.eternal == 1 ? (
                <CIcon icon={cilCheckAlt} size="sm" />
              ) : (
                ""
              )}
            </CTableDataCell>
            <CTableDataCell>
              <CButtonGroup role="group" aria-label="Basic example" size="sm">
                <CButton
                  color="primary"
                  variant="outline"
                  onClick={() => handleEdit(id)}
                >
                  {t("Edit")}
                </CButton>
                <CButton
                  color="danger"
                  variant="outline"
                  onClick={() => handleDelete(id)}
                >
                  {t("Delete")}
                </CButton>
              </CButtonGroup>
            </CTableDataCell>
          </CTableRow>
        );
      });
    }
  };

  const handleEdit = (id) => {
    console.log("Edit " + id);
  };
  const handleDelete = (id) => {
    console.log("Delete " + id);
  };
  //#endregion

  return (
    <CTable responsive striped hover align="middle">
      <RenderHeader />
      <CTableBody>
        <RenderContent />
      </CTableBody>
    </CTable>
  );
};

export default PageTable;
