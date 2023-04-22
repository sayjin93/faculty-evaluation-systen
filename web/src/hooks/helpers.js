import React from "react";
import { CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react";
import Cookies from "universal-cookie";
//#region cookies
export function setCookie(props) {
  try {
    const cookies = new Cookies();
    cookies.set(props.key, props.value, props.options);
  } catch (ex) {
    //log ex
  }
}
export function getCookie(props) {
  try {
    const cookies = new Cookies();
    return cookies.get(props.key);
  } catch (ex) {
    //log ex
    return "";
  }
}
export function removeCookie(props) {
  try {
    if (process.env.https) {
      document.cookie = "" + props.key + "=; Max-Age=0;secure;path=/";
    } else {
      document.cookie = "" + props.key + "=; Max-Age=0;path=/";
    }
  } catch (ex) {
    //log ex
    return "";
  }
}
//#endregion

//#region dates
export function formatDateFromSQL(dateString, yearOnly = false) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  if (yearOnly) {
    return year;
  }
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
export function convertDateFormat(dateString, showTime = true) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const dateStr = `${day}/${month}/${year}`;
  const timeStr = `${hours}:${minutes}`;
  return showTime ? `${dateStr} ${timeStr}` : dateStr;
}
export function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-"); // Outputs "yyyy-MM-dd"
}
export function formatDate2(date2) {
  const date = new Date(date2);

  const day = ("0" + date.getUTCDate()).slice(-2);
  const month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  const year = date.getUTCFullYear();

  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate; // Outputs "dd/MM/yyyy"
}
//#endregion

//#region table
export function renderHeader(items) {
  try {
    const header = Object.keys(items[0]); // extract keys from the first object

    return (
      <CTableHead>
        <CTableRow color="dark">
          {header.map((element) => {
            let thead = fixTableHeaderName(element);
            if (element === "id") thead = "#";
            if (element === "professor_id") return null;
            if (element === "academic_year_id") return null;
            if (element === "scientific_work_id") return null;

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
    console.log(err);
  }
}
export function fixTableHeaderName(text) {
  // Replace underscores with spaces and capitalize the first letter of each word
  const formattedName = text
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  return formattedName;
}
//#endregion

export function isNullOrUndefined(props) {
  try {
    if (props !== null && props !== undefined && props !== "") {
      return true;
    }
  } catch (ex) {
    //ignre ex
  }
  return false;
}
