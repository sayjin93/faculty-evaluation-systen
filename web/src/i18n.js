import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationSQ from "./assets/locales/sq.json";
import translationEN from "./assets/locales/en.json";
import { getCookie } from "./hooks";

//language cookie
const language = getCookie({ key: "language" });
const languageCookie = language || "en";

// the translations
const resources = {
  sq: { translation: translationSQ },
  en: { translation: translationEN },
};

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources,
    lng: languageCookie, // default language
    fallbackLng: "en",
    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  });

export default i18n;
