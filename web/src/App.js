import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { CSpinner } from "@coreui/react";
import { getCookie, isNullOrUndefined } from "./hooks";
import AppRoutes from "./routes";
import "./assets/slyles/App.scss";
import ToastComponent from "./components/Toast";

function App() {
  //#region constants
  const { i18n } = useTranslation();
  // @ts-ignore
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
  });
  //#endregion

  return (
    <Suspense fallback={<CSpinner color="primary" />}>
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
