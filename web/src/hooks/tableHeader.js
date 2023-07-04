import React from "react";
import { useTranslation } from "react-i18next";
import { CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";

function TableHeader({ items }) {
  const { t } = useTranslation();

  const fixTableHeaderName = (text) => {
    // Replace underscores with spaces and capitalize the first letter of each word
    const formattedName = text
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

    return formattedName;
  };

  if (items.length > 0) {
    const header = Object.keys(items[0]); // extract keys from the first object

    return (
      <CTableHead>
        <CTableRow color="dark">
          {header.map((element) => {
            let thead = fixTableHeaderName(element);
            if (element === "id") thead = "#";
            else if (element === "academic_year_id") return;
            //professors
            else if (element === "first_name") thead = t("FirstName");
            else if (element === "last_name") thead = t("LastName");
            else if (element === "gender") thead = t("Gender");
            //courses
            else if (element === "name") thead = t("Name");
            else if (element === "number") thead = t("Number");
            else if (element === "semester") thead = t("Semester");
            else if (element === "week_hours") thead = t("WeekHours");
            else if (element === "program") thead = t("Program");
            else if (element === "professor_id") thead = t("Professor");
            else if (element === "createdAt") thead = t("CreatedAt");
            else if (element === "updatedAt") thead = t("UpdatedAt");

            return (
              <CTableHeaderCell
                key={element}
                scope="col"
                className={element === "external" ? "text-center" : "text-left"}
              >
                {thead}
              </CTableHeaderCell>
            );
          })}
          <CTableHeaderCell scope="col"></CTableHeaderCell>
        </CTableRow>
      </CTableHead>
    );
  } else {
    return;
  }
}

export default TableHeader;
