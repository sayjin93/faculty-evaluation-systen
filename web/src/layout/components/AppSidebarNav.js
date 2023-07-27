import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { CBadge, CNavItem, CNavTitle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilSpeedometer,
  cilUser,
  cibCodecademy,
  cilPen,
  cilBook,
  cilBullhorn,
  cilChartPie,
  cilGlobeAlt,
  cilSettings,
} from "@coreui/icons";

export const AppSidebarNav = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const items = [
    {
      component: CNavItem,
      name: t("Dashboard"),
      to: "/",
      icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      badge: {
        color: "info",
        text: t("Working").toUpperCase(),
      },
    },
    {
      component: CNavTitle,
      name: t("Components"),
    },
    {
      component: CNavItem,
      name: t("Professors"),
      to: "/professors",
      icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Courses"),
      to: "/courses",
      icon: <CIcon icon={cibCodecademy} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Papers"),
      to: "/papers",
      icon: <CIcon icon={cilPen} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Books"),
      to: "/books",
      icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Conferences"),
      to: "/conferences",
      icon: <CIcon icon={cilBullhorn} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("CommunityServices"),
      to: "/community-services",
      icon: <CIcon icon={cilGlobeAlt} customClassName="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Reports"),
      to: "/reports",
      icon: <CIcon icon={cilChartPie} customClassName="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t("Extras"),
    },
    {
      component: CNavItem,
      name: t("Settings"),
      to: "/settings",
      icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
    },
  ];

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };
  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    );
  };
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </React.Fragment>
  );
};
