import React from "react";
import { useRoutes } from "react-router-dom";

import Public from "./public";
import Private from "./private";

const Layout = React.lazy(() => import("../components/Layout"));

const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));

const Home = React.lazy(() => import("../pages/Home"));
const Page404 = React.lazy(() => import("../pages/Page404"));

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: (
        <Private>
          <Layout />
        </Private>
      ),
      children: [
        {
          index: true,
          id: "Home",
          element: <Home />,
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
