import i18n from "i18next";
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from "react-i18next";

import { getCookie } from "./hooks";

//language cookie
const language = getCookie({ name: "language" });
const languageCookie = language || "en";

i18n
  .use(HttpApi)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    lng: languageCookie, // default language
    fallbackLng: "en",
    debug: process.env.REACT_APP_ENV === "development",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    saveMissing: true,
    backend: {
      loadPath: '/locales/{{lng}}.json',
      addPath: `${process.env.REACT_APP_API_URL}/locales/add/key`,
    },
  });

export default i18n;
