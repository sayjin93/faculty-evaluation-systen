import React, { lazy, Suspense } from "react";
import { useRoutes } from "react-router-dom";
import { CSpinner } from "@coreui/react";

import Public from "./public";
import Private from "./private";

//default layout for private pages
import DefaultLayout from "../layout/DefaultLayout";
import Page404 from "../pages/Page404";

//public pages
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

//private pages
const Home = lazy(() => import("../pages/Home"));
const Professors = lazy(() => import("../pages/Professors"));
const Courses = lazy(() => import("../pages/Courses"));
const Papers = lazy(() => import("../pages/Papers"));
const Books = lazy(() => import("../pages/Books"));
const Conferences = lazy(() => import("../pages/Conferences"));
const Communities = lazy(() => import("../pages/Communities"));
const Reports = lazy(() => import("../pages/Reports"));
const Settings = lazy(() => import("../pages/Settings"));
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
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/professors",
        element: <Professors />,
      },
      {
        path: "/papers",
        element: <Papers />,
      },
      {
        path: "/books",
        element: <Books />,
      },
      {
        path: "/conferences",
        element: <Conferences />,
      },
      {
        path: "/community-services",
        element: <Communities />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/profile",
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
