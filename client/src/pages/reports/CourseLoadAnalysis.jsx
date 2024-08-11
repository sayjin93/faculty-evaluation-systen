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
  const chartRef = useRef(null);
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

  console.log(items);

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
    const academicYearText = `${t("AcademicYear")}: ${academicYear.year}`;
    const academicYearTextWidth = doc.getTextWidth(academicYearText);
    const academicYearTextXPosition = (pageWidth - academicYearTextWidth) / 2;

    // Add faculty and academic year text, centered
    doc.text(academicYearText, academicYearTextXPosition, textYPosition + 10);

    // Loop through departments and generate a table for each
    items.forEach((department) => {
      // Add department name
      currentY += spacingBetweenTables;
      doc.text(t(department.department), 10, currentY);

      // Create table data
      const departmentData = [
        [t("Courses"), department.courses],
        [t("Papers"), department.papers],
        [t("Books"), department.books],
        [t("Conferences"), department.conferences],
        [t("CommunityServices"), department.communityServices],
      ];

      // Generate table
      autoTable(doc, {
        head: [[t("Activity"), t("Count")]],
        body: departmentData,
        startY: currentY + 5,
        theme: "grid",
        styles: { cellPadding: 3, fontSize: 10 },
        didDrawPage: (data) => {
          // Update currentY after the table is drawn
          currentY = data.cursor.y + spacingBetweenTables;
        },
      });
    });

    // Capture the chart image using the ref
    const chartCanvas = chartRef.current.getElementsByTagName("canvas")[0];
    if (chartCanvas) {
      const chartImage = chartCanvas.toDataURL("image/png");

      // Add the chart to the PDF at the end
      currentY += spacingBetweenTables;
      const chartHeight = 80; // Adjust the height as needed
      const chartWidth = pageWidth - 20; // Leave some margins
      doc.addImage(chartImage, "PNG", 10, currentY, chartWidth, chartHeight);

      // Update currentY to be below the chart
      currentY += chartHeight + spacingBetweenTables;
    } else {
      console.error("Chart canvas is not found.");
    }

    // Save the PDF with a filename
    doc.save(`report_${academicYear.year}.pdf`);
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
        <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 3 }}>
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
          <CCol>
            <CCard
              textColor="primary"
              className="border-primary border-top-primary border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">Chart</h6>
              </CCardHeader>

              <CCardBody>
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
                      {
                        label: t("WeeklyHours"),
                        type: "line", // A line chart on the same graph
                        borderColor: getColorForLabel("Books"),
                        fill: false,
                        data: items.map((item) => item.weekHours),
                        yAxisID: "y2", // Second Y axis for Weekly Hours
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
                        },
                        position: "left",
                      },
                      y2: {
                        position: "right",
                        grid: {
                          drawOnChartArea: false, // Only want the grid lines for one axis
                        },
                        ticks: {
                          color: getStyle("--cui-body-color"),
                        },
                      },
                    },
                  }}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDataToDisplay")}
        </CCallout>
      )}
    </>
  );
};

export default CourseLoadAnalysis;
