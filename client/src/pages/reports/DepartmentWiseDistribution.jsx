import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CCallout,
  CSpinner,
} from "@coreui/react";
import { CChart } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";

//react-icons
import { FaSitemap } from "react-icons/fa";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";
import { capitalizeWords, getColorForLabel } from "src/hooks";

//store
import { getAcademicYear, getFaculty } from "src/store/selectors";

//components
import SelectBoxFaculty from "src/components/SelectBoxFaculty";
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";

//jspdf
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//image
import logoImage from "src/assets/images/uet_logo.png";

const DepartmentWiseDistribution = () => {
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
  //#endregion

  //#region functions
  const fetchReport = async () => {
    await api
      .get(
        `/report/department-wise-distribution/${academicYear.id}/${faculty.id}`
      )
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
    const facultyText = t(faculty.key);
    const facultyTextWidth = doc.getTextWidth(facultyText);
    const facultyTextXPosition = (pageWidth - facultyTextWidth) / 2;

    const academicYearText = `${t("AcademicYear")}: ${academicYear.year}`;
    const academicYearTextWidth = doc.getTextWidth(academicYearText);
    const academicYearTextXPosition = (pageWidth - academicYearTextWidth) / 2;

    // Add faculty and academic year text, centered
    doc.text(facultyText, facultyTextXPosition, textYPosition);
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
    doc.save(
      `${t("DepartmentWiseDistribution")}_${t(faculty.key)}_${
        academicYear.year
      }.pdf`
    );
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchReport();
  }, [faculty, academicYear]);
  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <FaSitemap />
            <span className="title">
              {t("Reports")} | {t("DepartmentWiseDistribution")}
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
        <CRow xs={{ cols: 1, gutter: 4 }} lg={{ cols: 3, gutter: 4 }}>
          <CCol>
            <CRow xs={{ cols: 1, gutter: 4 }}>
              {items.map((department, index) => (
                <CCol key={index}>
                  <CCard
                    textColor="primary"
                    className="border-primary border-top-primary border-top-3"
                  >
                    <CCardHeader>
                      <h6 className="m-0">{t(department.department)}</h6>
                    </CCardHeader>

                    <CCardBody className="p-0">
                      <CTable
                        small
                        align="middle"
                        className="mb-0"
                        hover
                        responsive
                        borderless
                        striped
                      >
                        <CTableBody>
                          {Object.keys(department).map((key) => (
                            <CTableRow key={key}>
                              {key !== "department" && (
                                <>
                                  <CTableDataCell scope="col">
                                    {t(capitalizeWords(key))}
                                  </CTableDataCell>
                                  <CTableDataCell
                                    scope="col"
                                    className="text-center"
                                  >
                                    {department[key]}
                                  </CTableDataCell>
                                </>
                              )}
                            </CTableRow>
                          ))}
                        </CTableBody>
                      </CTable>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </CCol>
          <CCol lg={8}>
            <CCard
              textColor="primary"
              className="border-primary border-top-primary border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">Chart</h6>
              </CCardHeader>

              <CCardBody ref={chartRef}>
                <CChart
                  id="departmentChart"
                  type="bar"
                  data={{
                    labels: items.map((item) => t(item.department)),
                    datasets: [
                      {
                        label: t("Courses"),
                        backgroundColor: getColorForLabel("Courses"),
                        data: items.map((item) => item.courses),
                      },
                      {
                        label: t("Papers"),
                        backgroundColor: getColorForLabel("Papers"),
                        data: items.map((item) => item.papers),
                      },
                      {
                        label: t("Books"),
                        backgroundColor: getColorForLabel("Books"),
                        data: items.map((item) => item.books),
                      },
                      {
                        label: t("Conferences"),
                        backgroundColor: getColorForLabel("Conferences"),
                        data: items.map((item) => item.conferences),
                      },
                      {
                        label: t("CommunityServices"),
                        backgroundColor: getColorForLabel("Communities"),
                        data: items.map((item) => item.communityServices),
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
        </CRow>
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDataToDisplay")}
        </CCallout>
      )}
    </>
  );
};

export default DepartmentWiseDistribution;
