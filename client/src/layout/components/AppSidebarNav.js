import React, { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import { CBadge, CNavItem, CNavTitle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cibCodecademy } from "@coreui/icons";

//react-icons
import { LuLayoutDashboard, LuSettings2 } from "react-icons/lu";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GiVideoConference } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { PiBooksDuotone, PiArticleMediumLight } from "react-icons/pi";
import { TbReportSearch } from "react-icons/tb";

export const AppSidebarNav = () => {
  //#region constants
  const { t } = useTranslation();
  const location = useLocation();

  const items = useMemo(() => [
    {
      component: CNavItem,
      name: t("Dashboard"),
      to: "/",
      icon: <LuLayoutDashboard className="nav-icon" />,
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
      icon: <FaChalkboardTeacher className="nav-icon" style={{ height: "18px" }} />,
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
      icon: <PiArticleMediumLight className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Books"),
      to: "/books",
      icon: <PiBooksDuotone className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Conferences"),
      to: "/conferences",
      icon: <GiVideoConference className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("CommunityServices"),
      to: "/community-services",
      icon: <RiCommunityLine className="nav-icon" />,
    },
    {
      component: CNavItem,
      name: t("Reports"),
      to: "/reports",
      icon: <TbReportSearch className="nav-icon" />,
    },
    {
      component: CNavTitle,
      name: t("Extras"),
    },
    {
      component: CNavItem,
      name: t("Settings"),
      to: "/settings",
      icon: <LuSettings2 className="nav-icon" />,
    },
  ], []);
  //#endregion

  //#region functions
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
  //#endregion

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index)
        )}
    </React.Fragment>
  );
};
