import React from "react";
import { NavLink, Outlet } from "react-router-dom";

import AppSidebar from "./layout/AppSidebar";
import AppHeader from "./layout/AppHeader";
import AppContent from "./layout/AppContent";
import AppFooter from "./layout/AppFooter";

function Layout() {
  const links = [
    { label: "Dashboard", path: "/" },
    { label: "New Order", path: "/order" },
    { label: "Add Company", path: "/create" },
  ];

  const renderedLinks = links.map((link) => {
    return (
      <li key={link.label} className="nav-item">
        <NavLink className={`nav-link`} to={link.path}>
          {link.label}
        </NavLink>
      </li>
    );
  });

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
