//#region cookies
import Cookies from "universal-cookie";

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

export function fixTableHeaderName(text) {
  // Replace underscores with spaces and capitalize the first letter of each word
  const formattedName = text
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());

  return formattedName;
}
