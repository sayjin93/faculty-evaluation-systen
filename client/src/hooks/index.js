//#region imports
import Cookies from "universal-cookie";
import {
  cifAl,
  cifGb,
  cifIt,
  cifDe,
  cifFr,
  cifEs,
  cifGr,
  cifNl,
  cifTr,
  cifMk,
  cifRu,
} from "@coreui/icons";
//#endregion

//#region cookies
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
export function convertToKey(text) {
  if (!text) {
    // Handle the case where 'text' is undefined or null
    return "";
  }

  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}
export function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}
export function lowercaseNoSpace(text) {
  return text.replace(/\s+/g, "").toLowerCase();
}
export function arraysAreEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}
// helpers.js (or any utility file)
export function getColorForLabel(label) {
  const colorMap = {
    'Courses': 'rgba(255, 99, 132, 1)',             // Red
    'Papers': 'rgba(255, 159, 64, 1)',              // Orange
    'Books': 'rgba(75, 192, 192, 1)',               // Green
    'Conferences': 'rgba(54, 162, 235, 1)',         // Blue
    'Communities': 'rgba(201, 203, 207, 1)',        // Gray

    'CoursesOpacity': 'rgba(255, 99, 132, .4)',     // Red
    'PapersOpacity': 'rgba(255, 159, 64, .4)',      // Orange
    'BooksOpacity': 'rgba(75, 192, 192, .4)',       // Green
    'ConferencesOpacity': 'rgba(54, 162, 235, .4)', // Blue
    'CommunitiesOpacity': 'rgba(201, 203, 207, .4)' // Gray
  };

  return colorMap[label] || '#000000'; // Default to black if label not found
};

//#endregion

//#region constants
export const SidebarRoutes = {
  Books: "/books",
  Communities: "/community-services",
  Conferences: "/conferences",
  Courses: "/courses",
  Departments: "/departments",
  Faculties: "/faculties",
  Papers: "/papers",
  Professors: "/professors",
  Profile: "/profile",
  ProfessorActivityByAcademicYear: "/reports/professor-activity",
  DepartmentWiseDistribution: "/reports/department-wise-distribution",
  CourseLoadAnalysis: "/reports/course-load-analysis",
  GenderDistribution: "/reports/gender-distribution",
  TextSummarizer: "/ai/text-summarizer",
  Settings: "/settings",
  Translations: "/translations",

};

export const languageMap = [
  { code: "sq", icon: cifAl, name: "Shqip" },
  { code: "de", icon: cifDe, name: "Deutsch" },
  { code: "es", icon: cifEs, name: "Español" },
  { code: "fr", icon: cifFr, name: "Français" },
  { code: "en", icon: cifGb, name: "English" },
  { code: "el", icon: cifGr, name: "Ελληνικά" },
  { code: "it", icon: cifIt, name: "Italiano" },
  { code: "mk", icon: cifMk, name: "Македонски" },
  { code: "nl", icon: cifNl, name: "Nederlands" },
  { code: "ru", icon: cifRu, name: "русский" },
  { code: "tr", icon: cifTr, name: "Türkçe" },
  // Add more mappings as needed for other languages -> https://coreui.io/react/docs/components/icon/
];
//#endregion
