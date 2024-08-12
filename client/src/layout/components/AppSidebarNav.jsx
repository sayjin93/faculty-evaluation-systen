import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SidebarRoutes } from "src/hooks";

//coreUI
import { CBadge, CNavGroup, CNavItem, CNavTitle } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cibCodecademy } from "@coreui/icons";

//react-icons
import { LuLayoutDashboard, LuSettings2 } from "react-icons/lu";
import {
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaSitemap,
} from "react-icons/fa";
import {
  PiBuildingsBold,
  PiBooksDuotone,
  PiArticleMediumLight,
  PiGenderIntersexDuotone,
} from "react-icons/pi";
import { VscSymbolClass } from "react-icons/vsc";
import { GiVideoConference } from "react-icons/gi";
import { RiCommunityLine } from "react-icons/ri";
import { TbReportSearch } from "react-icons/tb";
import { HiLanguage } from "react-icons/hi2";

//store
import { getIsAdmin } from "src/store/selectors";

export const AppSidebarNav = () => {
  //#region constants
  const { t, i18n } = useTranslation();
  const location = useLocation();
  //#endregion

  //#region selectors
  const isAdmin = useSelector(getIsAdmin);
  //#endregion

  //#region data
  const items = useMemo(
    () => [
      {
        component: CNavItem,
        name: t("Dashboard"),
        to: "/",
        icon: <LuLayoutDashboard className="nav-icon" />,
      },
      {
        component: CNavTitle,
        name: t("University"),
        admin: true,
      },
      {
        component: CNavItem,
        name: t("Faculties"),
        to: SidebarRoutes.Faculties,
        icon: <PiBuildingsBold className="nav-icon" />,
        admin: true,
      },
      {
        component: CNavItem,
        name: t("Departments"),
        to: SidebarRoutes.Departments,
        icon: <VscSymbolClass className="nav-icon" />,
        admin: true,
      },
      {
        component: CNavTitle,
        name: t("Components"),
      },
      {
        component: CNavItem,
        name: t("Professors"),
        to: SidebarRoutes.Professors,
        icon: (
          <FaChalkboardTeacher
            className="nav-icon"
            style={{ height: "18px" }}
          />
        ),
        admin: true,
      },
      {
        component: CNavItem,
        name: t("Courses"),
        to: SidebarRoutes.Courses,
        icon: <CIcon icon={cibCodecademy} customClassName="nav-icon" />,
      },
      {
        component: CNavItem,
        name: t("Papers"),
        to: SidebarRoutes.Papers,
        icon: <PiArticleMediumLight className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: t("Books"),
        to: SidebarRoutes.Books,
        icon: <PiBooksDuotone className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: t("Conferences"),
        to: SidebarRoutes.Conferences,
        icon: <GiVideoConference className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: t("CommunityServices"),
        to: SidebarRoutes.Communities,
        icon: <RiCommunityLine className="nav-icon" />,
      },
      {
        component: CNavGroup,
        name: t("Reports"),
        icon: <TbReportSearch className="nav-icon" />,
        badge: {
          color: "info",
          text: t("New").toUpperCase(),
        },
        items: [
          {
            component: CNavItem,
            name: t("ProfessorActivity"),
            to: SidebarRoutes.ProfessorActivityByAcademicYear,
            icon: <FaChalkboardTeacher className="nav-icon" />,
          },
          {
            component: CNavItem,
            name: t("DepartmentWiseDistribution"),
            to: SidebarRoutes.DepartmentWiseDistribution,
            icon: <FaSitemap className="nav-icon" />,
          },
          {
            component: CNavItem,
            name: t("CourseLoadAnalysis"),
            to: SidebarRoutes.CourseLoadAnalysis,
            icon: <FaRegCalendarAlt className="nav-icon" />,
          },
          {
            component: CNavItem,
            name: t("GenderDistribution"),
            to: SidebarRoutes.GenderDistribution,
            icon: <PiGenderIntersexDuotone className="nav-icon" />,
          },
        ],
      },
      {
        component: CNavTitle,
        name: t("Extras"),
      },
      {
        component: CNavItem,
        name: t("Settings"),
        to: SidebarRoutes.Settings,
        icon: <LuSettings2 className="nav-icon" />,
      },
      {
        component: CNavItem,
        name: t("Translations"),
        to: SidebarRoutes.Translations,
        icon: <HiLanguage className="nav-icon" />,
        admin: true,
      },
    ],
    [isAdmin, i18n.language]
  );
  //#endregion

  //#region functions
  const filteredItems = isAdmin ? items : items.filter((item) => !item.admin);

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
    const { component, name, badge, icon, admin, ...rest } = item;
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
    const { component, name, icon, to, badge, admin, ...rest } = item; // Added badge here
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon, badge)} // Passing badge to navLink
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
    filteredItems &&
    filteredItems.map((item, index) =>
      item.items ? navGroup(item, index) : navItem(item, index)
    )
  );
};
