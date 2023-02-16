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
import { fixTableHeaderName } from "src/hooks/helpers";

const PageTable = (props) => {
  //#region constants
  const { t } = useTranslation();
  const { columns, items, component } = props;
  //#endregion

  //#region functions
  const RenderHeader = () => {
    return columns.map((element) => {
      let thead = fixTableHeaderName(element);
      if (element === "id") thead = "#";
      return (
        <CTableHeaderCell key={element} scope="col">
          {thead}
        </CTableHeaderCell>
      );
    });
  };
  const RenderContent = () => {
    if (component === "professor") {
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
    } else if (component === "courses") {
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
            <CTableDataCell>{element.semeser}</CTableDataCell>
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
      <CTableHead>
        <CTableRow color="dark">
          <RenderHeader />
          <CTableHeaderCell scope="col"></CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <RenderContent />
      </CTableBody>
    </CTable>
  );
};

export default PageTable;
