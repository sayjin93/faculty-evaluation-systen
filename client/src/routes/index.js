import React, { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { CSpinner } from "@coreui/react";

import Public from "./public";
import Private from "./private";
import PrivateAdmin from "./privateAdmin";


//default layout for private pages
import DefaultLayout from "../layout/DefaultLayout";
import Page404 from "../pages/Page404";
import { SidebarRoutes } from "src/hooks";

//public pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const VerifyToken = lazy(() => import("../pages/auth/VerifyToken"));
const Reset = lazy(() => import("../pages/auth/Reset"));
const ResetToken = lazy(() => import("../pages/auth/ResetToken"));

//private pages
const Home = lazy(() => import("../pages/home"));
const Faculties = lazy(() => import("../pages/uni/Faculties"));
const Departments = lazy(() => import("../pages/uni/Departments"));
const Professors = lazy(() => import("../pages/Professors"));
const Courses = lazy(() => import("../pages/Courses"));
const Papers = lazy(() => import("../pages/Papers"));
const Books = lazy(() => import("../pages/Books"));
const Conferences = lazy(() => import("../pages/Conferences"));
const Communities = lazy(() => import("../pages/Communities"));
const Reports = lazy(() => import("../pages/Reports"));
const Settings = lazy(() => import("../pages/Settings"));
const Translations = lazy(() => import("../pages/Translations"));
const Profile = lazy(() => import("../pages/Profile"));

const privateRoutes = [
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: SidebarRoutes.Faculties,
        element: (
          <PrivateAdmin>
            <Faculties />
          </PrivateAdmin>
        ),
      },
      {
        path: SidebarRoutes.Departments,
        element: (
          <PrivateAdmin>
            <Departments />
          </PrivateAdmin>
        ),
      },
      {
        path: SidebarRoutes.Courses,
        element: <Courses />,
      },
      {
        path: SidebarRoutes.Professors,
        element: (
          <PrivateAdmin>
            <Professors />
          </PrivateAdmin>
        ),
      },
      {
        path: SidebarRoutes.Papers,
        element: <Papers />,
      },
      {
        path: SidebarRoutes.Books,
        element: <Books />,
      },
      {
        path: SidebarRoutes.Conferences,
        element: <Conferences />,
      },
      {
        path: SidebarRoutes.Communities,
        element: <Communities />,
      },
      {
        path: SidebarRoutes.Reports,
        element: <Reports />,
      },
      {
        path: SidebarRoutes.Settings,
        element: <Settings />,
      },
      {
        path: SidebarRoutes.Translations,
        element: (
          <PrivateAdmin>
            <Translations />
          </PrivateAdmin>
        ),
      },
      {
        path: SidebarRoutes.Profile,
        element: <Profile />,
      },

    ],
  },
];

const publicRoutes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify/:token",
    element: <VerifyToken />,
  },
  {
    path: "/reset",
    element: <Reset />,
  },
  {
    path: "/reset/:token",
    element: <ResetToken />,
  },
];

const AppRoutes = () => {
  const routes = useRoutes([
    ...privateRoutes.map((route) => ({
      ...route,
      element: <Private>{route.element}</Private>,
    })),
    ...publicRoutes.map((route) => ({
      ...route,
      element: (
        <Public>
          <Suspense
            fallback={
              <div className="d-flex justify-content-center align-items-center vh-100">
                <CSpinner color="primary" />
              </div>
            }
          >
            {route.element}
          </Suspense>
        </Public>
      ),
    })),
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  return routes;
};

export default AppRoutes;
