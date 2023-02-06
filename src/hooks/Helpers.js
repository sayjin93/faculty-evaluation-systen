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

  return [year, month, day].join("-");
}
