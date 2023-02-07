import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">Copyright &copy; 2023.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Developed by</span>
        <a href="https://jkruja.com" target="_blank" rel="noopener noreferrer">
          Jurgen Kruja
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
