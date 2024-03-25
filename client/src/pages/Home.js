import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSettings } from "@coreui/icons";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import {
  getAcademicYear,
  getLoggedUser,
  isFirstLogin,
} from "src/store/selectors";
import { showToast, setFirstLogin } from "src/store";
import { countOccurrences } from "src/hooks";

//widgets
import WidgetsDropdown from "src/widgets/WidgetsDropdown";
import CustomDataGrid from "src/components/CustomDataGrid";
import { Column } from "devextreme-react/data-grid";

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
  const [items, setItems] = useState(null);

  // Filtered Data for Selected academic Year
  const filteredAcademicYear = items?.academic_years_data.find(
    (year) => year.academic_year_id === academicYear.id
  );
  //#endregion

  //#region functions
  const calculateTotalWeekHours = (professorId) => {
    // Function to calculate total week hours for a professor
    const professorCourses = filteredAcademicYear.courses.filter(
      (course) => course.professor_id === professorId
    );
    return professorCourses.reduce(
      (totalHours, course) => totalHours + course.week_hours,
      0
    );
  }

  const getProfessorStatistics = () => {
    // Function to get statistics for all professors
    const professors = items?.professors;
    const statistics = [];

    if (professors) {
      professors.forEach((professor) => {
        const professorId = professor.id;
        const professorName = `${professor.first_name} ${professor.last_name}`;

        const coursesCount = countOccurrences(
          filteredAcademicYear.courses,
          "professor_id",
          professor.id
        );
        const papersCount = countOccurrences(
          filteredAcademicYear.papers,
          "professor_id",
          professor.id
        );
        const booksCount = countOccurrences(
          filteredAcademicYear.books,
          "professor_id",
          professor.id
        );
        const conferencesCount = countOccurrences(
          filteredAcademicYear.conferences,
          "professor_id",
          professor.id
        );
        const communityServiceCount = countOccurrences(
          filteredAcademicYear.communityServices,
          "professor_id",
          professor.id
        );

        const totalWeekHours = calculateTotalWeekHours(professor.id) || 0;

        const professorStat = {
          id: professorId,
          professor: professorName,
          courses: coursesCount,
          papers: papersCount,
          books: booksCount,
          conferences: conferencesCount,
          community_service: communityServiceCount,
          total_week_hours: totalWeekHours,
        };

        statistics.push(professorStat);
      });
    }

    return statistics;
  }

  // Call the function to get the statistics for all professors
  const professorStatistics = getProfessorStatistics();
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchDashboard = async () => {
      await api
        .get("/report/dashboard")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchDashboard();

    if (firstLogin) {
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
                <CIcon icon={cilSettings} />
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
                  {items?.professors.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Courses")}</div>
                <div className="fs-5 fw-semibold">
                  {filteredAcademicYear?.courses.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Papers")}</div>
                <div className="fs-5 fw-semibold">
                  {filteredAcademicYear?.papers.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Books")}</div>
                <div className="fs-5 fw-semibold">
                  {filteredAcademicYear?.books.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("Conferences")}
                </div>
                <div className="fs-5 fw-semibold">
                  {filteredAcademicYear?.conferences.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-secondary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("CommunityServices")}
                </div>
                <div className="fs-5 fw-semibold">
                  {filteredAcademicYear?.communityServices.length}
                </div>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <WidgetsDropdown />

      <CCard
        textColor="primary"
        className="border-primary border-top-primary border-top-3 mb-4"
      >
        <CCardHeader>{t("ProfessorsStatistics")}</CCardHeader>

        <CCardBody>
          <CustomDataGrid dataSource={professorStatistics}>
            <Column
              dataField="professor"
              caption={t("Professor")}
              dataType="string"
            />
            <Column
              dataField="courses"
              caption={t("Courses")}
              dataType="number"
            />
            <Column
              dataField="total_week_hours"
              caption={t("WeekHours")}
              dataType="number"
            />
            <Column
              dataField="papers"
              caption={t("Papers")}
              dataType="number"
            />
            <Column
              dataField="books"
              caption={t("Books")}
              dataType="number"
            />
            <Column
              dataField="conferences"
              caption={t("Conferences")}
              dataType="number"
            />
            <Column
              dataField="community_service"
              caption={t("CommunityServices")}
              dataType="number"
            />
          </CustomDataGrid>
        </CCardBody>
      </CCard>
    </>
  );
};

export default Home;
