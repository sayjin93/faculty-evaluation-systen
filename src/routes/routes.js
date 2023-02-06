import React from "react";
import { Routes, Route, useRoutes } from "react-router-dom";

const Layout = React.lazy(() => import("../components/Layout"));

const Login = React.lazy(() => import("../pages/auth/Login"));
const Register = React.lazy(() => import("../pages/auth/Register"));

const Home = React.lazy(() => import("../pages/Home"));
const Page404 = React.lazy(() => import("../pages/Page404"));

const PageRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
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
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "*",
      element: <Page404 />,
    },
  ]);

  return routes;

  return (
    <Routes>
      <Route path="*" element={<Page404 />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  );
};

export default PageRoutes;
