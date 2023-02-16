import React, { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CSpinner } from "@coreui/react";
import { getCookie, isNullOrUndefined } from "./hooks/helpers";
import AppRoutes from "./routes";
import "./assets/slyles/App.scss";

function App() {
  //#region constants
  const { i18n } = useTranslation();
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
    </Suspense>
  );
}

export default App;
