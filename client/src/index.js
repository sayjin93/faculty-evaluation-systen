import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";

import { BrowserRouter } from "react-router-dom";

// import i18n (needs to be bundled ;))
import "./i18n";

// Devextreme licensing
import config from "devextreme/core/config";
const DEVEXTREME_KEY = "ewogICJmb3JtYXQiOiAxLAogICJjdXN0b21lcklkIjogImYwNzlmYWIyLTY3OGItNDY0MC1iOTU3LWZiZmE5MzJhOTFiOCIsCiAgIm1heFZlcnNpb25BbGxvd2VkIjogMjMyCn0=.UGF02rbLoRBdAvkl7yuII+N7jDGJj3h3BXQmivqf0W+bV0IsxyVPzhJDiEyx+BaDDMg6eI53/qiqTgn/RzDCfsY2ap+II+q4kPNUqxjcIM3JqlEdnSIM1glx4bo7TPE1rxcV0A=="
config({ licenseKey: DEVEXTREME_KEY });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
