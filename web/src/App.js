import "./assets/slyles/App.scss";

import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { CSpinner } from "@coreui/react";
import ToastComponent from "./components/Toast";
import { getCookie, isNullOrUndefined } from "./hooks";
import AppRoutes from "./routes";

function App() {
  //#region constants
  const { i18n } = useTranslation();
  //#endregion

  //#region selectors
  const toast = useSelector((state) => state.toast);
  //#endregion

  //#region useEffect
  useEffect(() => {
    //Check default language
    const language = getCookie({ key: "language" });
    const languageCookie = isNullOrUndefined(language) ? language : "en";
    if (i18n.language !== languageCookie) {
      i18n.changeLanguage(languageCookie);
    }
  }, [i18n]);
  //#endregion

  return (
    <Suspense
      fallback={
        <div className="d-flex justify-content-center align-items-center vh-100">
          <CSpinner color="primary" />
        </div>
      }
    >
      <AppRoutes />

      <ToastComponent
        type={toast.type}
        content={toast.content}
        visible={toast.visible}
      />
    </Suspense>
  );
}

export default App;
