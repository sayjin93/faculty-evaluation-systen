import React from "react";
import { useTranslation } from "react-i18next";

//coreUI
import { CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";

const fixTableHeaderName = (text) => {
  // Replace underscores with spaces and capitalize the first letter of each word
  const formattedName = text
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  return formattedName;
};

const TableHeader = ({ items, timestamp = true, color = "light" }) => {
  //#constants
  const { t } = useTranslation();
  //#endregion

  if (items && items.length > 0) {
    const header = Object.keys(items[0]); // extract keys from the first object

    return (
      <CTableHead color={color}>
        <CTableRow>
          {header.map((element) => {
            let thead = fixTableHeaderName(element);
            if (element === "id") thead = "#";
            else if (element === "academic_year_id") return null;
            //general
            else if (element === "professor_id") {
              if (timestamp) thead = t("Professor");
              else return null;
            } else if (element === "createdAt") {
              if (timestamp) thead = t("CreatedAt");
              else return null;
            } else if (element === "updatedAt") {
              if (timestamp) thead = t("UpdatedAt");
              else return null;
            }
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
            //papers
            else if (element === "title") thead = t("Title");
            else if (element === "journal") thead = t("Journal");
            else if (element === "publication") thead = t("Publication");
            //books
            else if (element === "publication_house")
              thead = t("PublicationHouse");
            else if (element === "publication_year")
              thead = t("PublicationYear");
            //conferences
            else if (element === "location") thead = t("Location");
            else if (element === "present_title") thead = t("PresentTitle");
            else if (element === "authors") thead = t("Authors");
            else if (element === "dates") thead = t("Dates");
            //community
            else if (element === "event") thead = t("Event");
            else if (element === "date") thead = t("Date");
            else if (element === "description") thead = t("Description");
            else if (element === "external") thead = t("External");

            return (
              <CTableHeaderCell
                key={element}
                scope="col"
                className={
                  element === "external"
                    ? "text-center"
                    : element === "id"
                      ? "text-end"
                      : "text-left"
                }
              >
                {thead}
              </CTableHeaderCell>
            );
          })}

          {/* Kolone me header bosh per butonat edit/delete */}
          {timestamp && <CTableHeaderCell scope="col"></CTableHeaderCell>}
        </CTableRow>
      </CTableHead>
    );
  } else {
    return;
  }
}

export default TableHeader;
