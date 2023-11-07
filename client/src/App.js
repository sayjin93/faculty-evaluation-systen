import "./assets/slyles/App.scss";

import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import ToastComponent from "./components/Toast";
import { getCookie } from "./hooks";
import AppRoutes from "./routes";

function App() {
  //#region constants
  const { i18n } = useTranslation();
  //#endregion

  //#region selectors
  // @ts-ignore
  const toast = useSelector((state) => state.toast);
  //#endregion

  //#region useEffect
  useEffect(() => {
    //Check default language
    const language = getCookie({ name: "language" });
    const languageCookie = language ? language : "en";
    if (i18n.language !== languageCookie) {
      i18n.changeLanguage(languageCookie);
    }
  }, [i18n.language]);
  //#endregion

  return (
    <>
      <AppRoutes />

      <ToastComponent
        type={toast.type}
        content={toast.content}
        visible={toast.visible}
      />
    </>
  );
}

export default App;
