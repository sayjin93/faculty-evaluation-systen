import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

import Public from "./public";
import Private from "./private";

const DefaultLayout = lazy(() => import("../layout/DefaultLayout"));

const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));

const Home = lazy(() => import("../pages/Home"));

const Professors = lazy(() => import("../pages/professors"));
const Courses = lazy(() => import("../pages/courses"));
const Papers = lazy(() => import("../pages/papers"));
const Books = lazy(() => import("../pages/books"));
const Conferences = lazy(() => import("../pages/conferences"));
const Community = lazy(() => import("../pages/community"));
const Reports = lazy(() => import("../pages/reports"));

const Settings = lazy(() => import("../pages/Settings"));
const Page404 = lazy(() => import("../pages/Page404"));

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Private>
          <DefaultLayout />
        </Private>
      ),
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
          element: <Community />,
        },
        {
          path: "/reports",
          element: <Reports />,
        },
        {
          path: "/settings",
          element: <Settings />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        // <Public>
          <Login />
        // </Public>
      ),
    },
    {
      path: "/register",
      element: (
        // <Public>
          <Register />
        // </Public>
      ),
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  return routes;
};

export default AppRoutes;
