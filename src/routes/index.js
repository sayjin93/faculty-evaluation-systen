import React from "react";
import { useRoutes } from "react-router-dom";

import Public from "./public";
import Private from "./private";

const DefaultLayout = React.lazy(() => import("../layout/DefaultLayout"));

const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));

const Home = React.lazy(() => import("../pages/Home"));

const Professors = React.lazy(() => import("../pages/professors"));
const Courses = React.lazy(() => import("../pages/courses"));
const Papers = React.lazy(() => import("../pages/papers"));
const Books = React.lazy(() => import("../pages/books"));
const Conferences = React.lazy(() => import("../pages/conferences"));
const Community = React.lazy(() => import("../pages/community"));
const Reports = React.lazy(() => import("../pages/reports"));

const Settings = React.lazy(() => import("../pages/Settings"));
const Page404 = React.lazy(() => import("../pages/Page404"));

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
          path: "/professors",
          element: <Professors />,
        },
        {
          path: "/courses",
          element: <Courses />,
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
        <Public>
          <Login />
        </Public>
      ),
    },
    {
      path: "/register",
      element: (
        <Public>
          <Register />
        </Public>
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
