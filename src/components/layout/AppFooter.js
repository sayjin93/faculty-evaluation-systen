import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <a href="https://uet.edu.al/" target="_blank" rel="noopener noreferrer">
          UET
        </a>
        <span className="ms-1">&copy; 2023.</span>
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
