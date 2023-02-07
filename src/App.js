import React, { Suspense } from "react";
import AppRoutes from "./routes";
import { CSpinner } from "@coreui/react";
import "./assets/slyles/App.scss";

function App() {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
