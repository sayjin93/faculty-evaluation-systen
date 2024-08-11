import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { CSpinner } from "@coreui/react";

//components
import AppSidebar from "./components/AppSidebar";
import AppHeader from "./components/AppHeader";
import AppContent from "./components/AppContent";
import AppFooter from "./components/AppFooter";
import AcademicYearAdd from "./AcademicYearAdd";

//store
import { changeAcademicYear } from "../store";

import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

const Layout = () => {
  //#region constants
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  // @ts-ignore
  const academicYear = useSelector((state) => state.settings.academicYear);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  //#endregion

  //#region functions
  const fetchAcademicYears = async () => {
    await api
      .get("/academic-year/active")
      .then((response) => {
        const activeAcademicYear = response.data;
        if (activeAcademicYear.length > 0) {
          dispatch(changeAcademicYear(activeAcademicYear[0]));
        } else {
          dispatch(changeAcademicYear(""));
        }
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchAcademicYears();
  }, []);
  //#endregion

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <CSpinner color="primary" />
      </div>
    );
  } else if (!isLoading && !academicYear) {
    return <AcademicYearAdd />;
  }

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
