//#region cookies
import Cookies from "universal-cookie";

export function setCookie(props) {
  try {
    const cookies = new Cookies();
    cookies.set(props.name, props.value, props.options);
  } catch (ex) {
    //log ex
  }
}
export function getCookie(props) {
  try {
    const cookies = new Cookies();
    return cookies.get(props.name);
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

//#region others
export function countOccurrences(array, key, value) {
  // Helper function to count the occurrences of an item in an array
  return array.filter((item) => item[key] === value).length;
}
export function convertToKey(text) {
  if (!text) {
    // Handle the case where 'text' is undefined or null
    return '';
  }

  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (l) { return l.toUpperCase() });
}
//#endregion

//#region constants
export const SidebarRoutes = {
  Books: '/books',
  Communities: '/community-services',
  Conferences: '/conferences',
  Courses: '/courses',
  Departments: '/departments',
  Faculties: '/faculties',
  Papers: '/papers',
  Professors: '/professors',
  Profile: '/profile',
  Reports: '/reports',
  Settings: '/settings',
};
//#endregion