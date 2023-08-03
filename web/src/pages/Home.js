import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { batch, useDispatch, useSelector } from "react-redux";

import {
  getAcademicYear,
  getLoggedUser,
  isFirstLogin,
} from "../store/selectors/selectors";
import { showToast, setFirstLogin } from "../store";
import { convertDateFormat, countOccurrences } from "../hooks";

import axios from "axios";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import useErrorHandler from "src/hooks/useErrorHandler";

import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilPen } from "@coreui/icons";

const Home = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const academicYear = useSelector(getAcademicYear);
  const loggedUser = useSelector(getLoggedUser);
  const firstLogin = useSelector(isFirstLogin);

  //#endregion

  //#region states
  const [items, setItems] = useState({
    professors: [],
    books: [],
    communityServices: [],
    conferences: [],
    courses: [],
    papers: [],
  });
  //#endregion

  //#region functions

  function calculateTotalWeekHours(professorId) {
    // Function to calculate total week hours for a professor
    const professorCourses = items.courses.filter(
      (course) => course.professor_id === professorId
    );
    return professorCourses.reduce(
      (totalHours, course) => totalHours + course.week_hours,
      0
    );
  }
  function getProfessorStatistics() {
    // Function to get statistics for all professors
    const professors = items.professors;
    const statistics = [];

    professors.forEach((professor) => {
      const professorName = `${professor.first_name} ${professor.last_name}`;

      const coursesCount = countOccurrences(
        items.courses,
        "professor_id",
        professor.id
      );
      const papersCount = countOccurrences(
        items.papers,
        "professor_id",
        professor.id
      );
      const booksCount = countOccurrences(
        items.books,
        "professor_id",
        professor.id
      );
      const conferencesCount = countOccurrences(
        items.conferences,
        "professor_id",
        professor.id
      );
      const communityServiceCount = countOccurrences(
        items.communityServices,
        "professor_id",
        professor.id
      );
      const totalWeekHours = calculateTotalWeekHours(professor.id);

      const professorStat = {
        professor: professorName,
        createdAt: professor.createdAt,
        courses: coursesCount,
        papers: papersCount,
        books: booksCount,
        conferences: conferencesCount,
        community_service: communityServiceCount,
        total_week_hours: totalWeekHours,
      };

      statistics.push(professorStat);
    });

    return statistics;
  }

  // Call the function to get the statistics for all professors
  const professorStatistics = getProfessorStatistics();
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchDashboard = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/dashboard/academic_year/${academicYear.id}`,
          {
            headers: {
              "auth-token": localStorage.getItem("jwt_token"),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchDashboard();

    if (firstLogin) {
      batch(() => {
        dispatch(
          showToast({
            type: "success",
            content:
              t("Welcome") +
              " " +
              loggedUser.first_name +
              " " +
              loggedUser.last_name,
          })
        );
        dispatch(setFirstLogin(false));
      });
    }
  }, []);

  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 className="card-title mb-0">{t("AcademicYear")}</h4>
              <div className="small text-medium-emphasis">
                {academicYear.year}
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="light"
                className="float-end"
                onClick={() => navigate("/settings")}
              >
                <CIcon icon={cilPen} />
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-info py-1 px-3">
                <div className="text-medium-emphasis small">
                  {t("Professors")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.professors.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Courses")}</div>
                <div className="fs-5 fw-semibold">{items.courses.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Papers")}</div>
                <div className="fs-5 fw-semibold">{items.papers.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Books")}</div>
                <div className="fs-5 fw-semibold">{items.books.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("Conferences")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.conferences.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-secondary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("CommunityServices")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.communityServices.length}
                </div>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <WidgetsDropdown />

      <CRow>
        <CCol xs>
          <CCard
            textColor="primary"
            className="border-primary border-top-primary border-top-3 mb-4"
          >
            <CCardHeader>{t("ProfessorsStatistics")}</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>{t("Professor")}</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("Courses")}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("WeekHours")}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("Papers")}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("Books")}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("Conferences")}
                    </CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      {t("CommunityServices")}
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {professorStatistics.map((item, index) => {
                    return (
                      <CTableRow
                        v-for="item in professorStatistics"
                        key={index}
                      >
                        <CTableDataCell>
                          <div>{item.professor}</div>
                          <div className="small text-medium-emphasis">
                            {t("CreatedAt")}:{" "}
                            {convertDateFormat(item.createdAt)}
                          </div>
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.courses}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.total_week_hours}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.papers}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.books}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.conferences}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          {item.community_service}
                        </CTableDataCell>
                      </CTableRow>
                    );
                  })}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Home;
