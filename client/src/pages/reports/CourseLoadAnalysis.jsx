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

//react-icons
import { FaRegCalendarAlt } from "react-icons/fa";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";
import { capitalizeWords, getColorForLabel } from "src/hooks";

//store
import { getAcademicYear } from "src/store/selectors";

//components
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";

//jspdf
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//image
import logoImage from "src/assets/images/uet_logo.png";
import { CChart } from "@coreui/react-chartjs";
import { getStyle } from "@coreui/utils";

const CourseLoadAnalysis = () => {
  //#region constants
  const { t } = useTranslation();
  const handleError = useErrorHandler();
  //#endregion

  //#region refs
  const chartRef = useRef(null);
  //#endregion

  //#region selectors
  const academicYear = useSelector(getAcademicYear);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState(null);
  //#endregion

  console.log(items);

  //#region functions
  const fetchReport = async () => {
    await api
      .get(`/report/course-load-analysis/${academicYear.id}`)
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
    fetchReport();
  }, [academicYear]);
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
          <CRow xs={{ cols: 1, gutterY: 3 }} className="align-items-start">
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
          <p>sad</p>
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
