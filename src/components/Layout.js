import React from "react";

import AppSidebar from "./layout/AppSidebar";
import AppHeader from "./layout/AppHeader";
import AppContent from "./layout/AppContent";
import AppFooter from "./layout/AppFooter";

function Layout() {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  );
}

export default Layout;
