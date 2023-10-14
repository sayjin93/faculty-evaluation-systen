import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import useErrorHandler from "src/hooks/useErrorHandler";

//components
import AppSidebar from "./components/AppSidebar";
import AppHeader from "./components/AppHeader";
import AppContent from "./components/AppContent";
import AppFooter from "./components/AppFooter";
import AcademicYearAdd from "./AcademicYearAdd";

import { changeAcademicYear } from "../store";

const Layout = () => {
  //#region constants
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const academicYear = useSelector((state) => state.settings.academicYear);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchAcademicYears = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/academic-year/active", {
          headers: {
            "auth-token": localStorage.getItem("jwt_token"),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const data = response.data;
          if (data.length > 0) {
            dispatch(changeAcademicYear(data[0]));
          } else {
            dispatch(changeAcademicYear(""));
          }
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchAcademicYears();
  }, [dispatch]);
  //#endregion

  if (!academicYear) return <AcademicYearAdd />;

  return (
    <>
      <AppSidebar />

      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />

        <div className="body flex-grow-1 px-3">
          <div className="placeholder-img"></div>
          <AppContent />
        </div>

        <AppFooter />
      </div>
    </>
  );
};

export default Layout;
