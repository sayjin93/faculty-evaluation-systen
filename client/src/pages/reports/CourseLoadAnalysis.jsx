import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Column } from "devextreme-react/data-grid";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CCallout,
  CSpinner,
} from "@coreui/react";
import { CChart } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";

//react-icons
import { FaRegCalendarAlt } from "react-icons/fa";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";
import { capitalizeWords, getColorForLabel } from "src/hooks";

//store
import { getAcademicYear, getFaculty } from "src/store/selectors";

//components
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";
import SelectBoxFaculty from "src/components/SelectBoxFaculty";
import CustomDataGrid from "src/components/CustomDataGrid";

//jspdf
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//image
import logoImage from "src/assets/images/uet_logo.png";

const CourseLoadAnalysis = () => {
  //#region constants
  const { t } = useTranslation();
  const handleError = useErrorHandler();
  //#endregion

  //#region refs
  const coursesChartRef = useRef(null);
  const weeklyHoursChartRef = useRef(null);
  //#endregion

  //#region selectors
  const faculty = useSelector(getFaculty);
  const academicYear = useSelector(getAcademicYear);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  //#endregion

  //#region functions
  const fetchReport = async () => {
    await api
      .get(`/report/course-load-analysis/${academicYear.id}/${faculty}`)
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const logoWidth = 60;
    const logoHeight = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoXPosition = (pageWidth - logoWidth) / 2; // Center logo horizontally
    const logoYPosition = 10;
    const textYPosition = logoYPosition + logoHeight + 10;
    const spacingBetweenTables = 10;
    let currentY = textYPosition + 20;

    // Add university logo
    doc.addImage(
      logoImage,
      "PNG",
      logoXPosition,
      logoYPosition,
      logoWidth,
      logoHeight
    );

    // Calculate text positions for centering
    const facultyText = t(facultyName);
    const facultyTextWidth = doc.getTextWidth(facultyText);
    const facultyTextXPosition = (pageWidth - facultyTextWidth) / 2;

    const academicYearText = `${t("AcademicYear")}: ${academicYear.year}`;
    const academicYearTextWidth = doc.getTextWidth(academicYearText);
    const academicYearTextXPosition = (pageWidth - academicYearTextWidth) / 2;

    // Add faculty and academic year text, centered
    doc.text(facultyText, facultyTextXPosition, textYPosition);
    doc.text(academicYearText, academicYearTextXPosition, textYPosition + 10);

    // Generate and add the table to the PDF
    const tableData = items.map((item) => [
      item.professor,
      item.courses,
      item.weekHours,
      item.bachelorCourses,
      item.masterCourses,
    ]);

    autoTable(doc, {
      head: [
        [
          t("Professor"),
          t("Courses"),
          t("WeekHours"),
          t("BachelorCourses"),
          t("MasterCourses"),
        ],
      ],
      body: tableData,
      startY: currentY,
      theme: "grid",
      styles: { cellPadding: 3, fontSize: 10 },
      didDrawPage: (data) => {
        currentY = data.cursor.y + spacingBetweenTables; // Update currentY after the table
      },
    });

    // Function to add a new page if needed
    const checkAndAddPage = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight) {
        doc.addPage();
        currentY = 20; // reset Y position on the new page
      }
    };

    // Capture and add the Courses Distribution chart
    const coursesChartCanvas =
      coursesChartRef.current.getElementsByTagName("canvas")[0];
    if (coursesChartCanvas) {
      const chartHeight = 80;
      const chartWidth = pageWidth - 20;
      checkAndAddPage(chartHeight + spacingBetweenTables);
      const coursesChartImage = coursesChartCanvas.toDataURL("image/png");
      doc.addImage(
        coursesChartImage,
        "PNG",
        10,
        currentY,
        chartWidth,
        chartHeight
      );
      currentY += chartHeight + spacingBetweenTables;
    }

    // Capture and add the Weekly Hours chart
    const weeklyHoursChartCanvas =
      weeklyHoursChartRef.current.getElementsByTagName("canvas")[0];
    if (weeklyHoursChartCanvas) {
      const chartHeight = 80;
      const chartWidth = pageWidth - 20;
      checkAndAddPage(chartHeight + spacingBetweenTables);
      const weeklyHoursChartImage =
        weeklyHoursChartCanvas.toDataURL("image/png");
      doc.addImage(
        weeklyHoursChartImage,
        "PNG",
        10,
        currentY,
        chartWidth,
        chartHeight
      );
    }

    // Save the PDF with a filename
    doc.save(`report_${t(facultyName)}_${academicYear.year}.pdf`);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (faculty > 0) fetchReport();
  }, [faculty, academicYear]);

  useEffect(() => {
    const fetchFacultyName = async () => {
      try {
        const response = await api.get(`/faculty/${faculty}`);
        setFacultyName(response.data.key);
      } catch (error) {
        handleError(error);
      }
    };

    if (faculty) {
      fetchFacultyName();
    }
  }, [faculty]);
  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <FaRegCalendarAlt />
            <span className="title">
              {t("Reports")} | {t("CourseLoadAnalysis")}
            </span>
          </h6>
          <CButton color="primary" className="float-right" onClick={exportPDF}>
            {t("GeneratePdf")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <CRow
            xs={{ cols: 1, gutterY: 3 }}
            md={{ cols: 2, gutterX: 4 }}
            className="align-items-start"
          >
            <CCol>
              <SelectBoxFaculty />
            </CCol>
            <CCol>
              <SelectBoxAcademicYear local />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <CSpinner color="primary" />
        </div>
      ) : items ? (
        <>
          <CRow className="mb-4">
            <CCol>
              <CCard
                textColor="primary"
                className="border-primary border-top-primary border-top-3"
              >
                <CCardHeader>
                  <h6 className="m-0">{t("Stats")}</h6>
                </CCardHeader>

                <CCardBody className="p-0">
                  <CustomDataGrid dataSource={items}>
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
                      alignment="center"
                      dataField="weekHours"
                      caption={t("WeekHours")}
                      dataType="number"
                    />
                    <Column
                      dataField="bachelorCourses"
                      caption={t("BachelorCourses")}
                      dataType="number"
                    />
                    <Column
                      dataField="masterCourses"
                      caption={t("MasterCourses")}
                      dataType="number"
                    />
                  </CustomDataGrid>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 3 }}>
            <CCol>
              <CCard
                textColor="primary"
                className="border-primary border-top-primary border-top-3"
              >
                <CCardHeader>
                  <h6 className="m-0">{t("CoursesDistribution")}</h6>
                </CCardHeader>

                <CCardBody ref={coursesChartRef}>
                  <CChart
                    type="bar"
                    data={{
                      labels: items.map((item) => item.professor),
                      datasets: [
                        {
                          label: t("BachelorCourses"),
                          backgroundColor: getColorForLabel("Courses"),
                          data: items.map((item) => item.bachelorCourses),
                        },
                        {
                          label: t("MasterCourses"),
                          backgroundColor: getColorForLabel("Papers"),
                          data: items.map((item) => item.masterCourses),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: getStyle("--cui-body-color"),
                          },
                        },
                      },
                      scales: {
                        x: {
                          stacked: true,
                          grid: {
                            color: getStyle("--cui-border-color-translucent"),
                          },
                          ticks: {
                            color: getStyle("--cui-body-color"),
                          },
                        },
                        y: {
                          stacked: true,
                          grid: {
                            color: getStyle("--cui-border-color-translucent"),
                          },
                          ticks: {
                            color: getStyle("--cui-body-color"),
                            stepSize: 1, // Set the step size to 1
                          },
                          min: 0, // Ensures the axis begins at 0
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CCard
                textColor="primary"
                className="border-primary border-top-primary border-top-3"
              >
                <CCardHeader>
                  <h6 className="m-0">{t("WeeklyHours")}</h6>
                </CCardHeader>

                <CCardBody ref={weeklyHoursChartRef}>
                  <CChart
                    type="line"
                    data={{
                      labels: items.map((item) => item.professor),
                      datasets: [
                        {
                          label: t("WeeklyHours"),
                          borderColor: getColorForLabel("Books"),
                          fill: false,
                          data: items.map((item) => item.weekHours),
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          labels: {
                            color: getStyle("--cui-body-color"),
                          },
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            color: getStyle("--cui-border-color-translucent"),
                          },
                          ticks: {
                            color: getStyle("--cui-body-color"),
                          },
                        },
                        y: {
                          grid: {
                            color: getStyle("--cui-border-color-translucent"),
                          },
                          ticks: {
                            color: getStyle("--cui-body-color"),
                            stepSize: 1, // Set the step size to 1
                          },
                          min: 0, // Ensures the axis begins at 0
                        },
                      },
                    }}
                  />
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </>
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDataToDisplay")}
        </CCallout>
      )}
    </>
  );
};

export default CourseLoadAnalysis;
