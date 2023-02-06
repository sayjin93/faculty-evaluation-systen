import React, { Suspense } from "react";
import AppRoutes from "./routes";

import "./assets/slyles/App.scss";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={loading}>
      <AppRoutes />
    </Suspense>
  );
}

export default App;
