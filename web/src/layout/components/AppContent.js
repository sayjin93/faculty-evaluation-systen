import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { CContainer, CSpinner } from "@coreui/react";

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center vh-100">
            <CSpinner color="primary" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
