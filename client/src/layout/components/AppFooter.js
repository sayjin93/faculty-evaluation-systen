import React from "react";
import { t } from "i18next";

//coreUI
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">
          Copyright &copy; {new Date().getFullYear()}
        </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">{t("DevelopedBy")}</span>
        <a href="https://jkruja.com" target="_blank" rel="noopener noreferrer">
          Jurgen Kruja
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
