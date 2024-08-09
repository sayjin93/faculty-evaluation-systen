import React, { useEffect, useState } from "react";
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
} from "@coreui/react";

//react-icons
import { FaSitemap } from "react-icons/fa";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";
import { capitalizeWords } from "src/hooks";

//store
import {
  getAcademicYear,
  getFaculty
} from "src/store/selectors";

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

  //#region selectors
  const faculty = useSelector(getFaculty);
  const academicYear = useSelector(getAcademicYear);
  //#endregion

  //#region states
  const [items, setItems] = useState(null);
  const [facultyName, setFacultyName] = useState("");
  //#endregion

  //#region functions
  const fetchReport = async () => {
    await api
      .get(
        `/report/department-wise-distribution/academic_year/${academicYear.id}/faculty_id/${faculty}`
      )
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
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
    const facultyText = t(facultyName);
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
        theme: 'grid',
        styles: { cellPadding: 3, fontSize: 10 },
        didDrawPage: (data) => {
          // Update currentY after the table is drawn
          currentY = data.cursor.y + spacingBetweenTables;
        },
      });
    });

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
            <FaSitemap />
            <span className="title">{t("Reports")} | {t("DepartmentWiseDistribution")}</span>
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

      {items ? (
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          xxl={{ cols: 2 }}
          className="align-items-start g-4"
        >
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
                    {/* <CTableHead color="light">
                        <CTableRow>
                          <CTableHeaderCell
                            scope="col"
                          >
                            {t("Activity")}
                          </CTableHeaderCell>
                          <CTableHeaderCell
                            scope="col"
                            className="text-center"
                          >
                            {t("Count")}
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead> */}

                    <CTableBody>
                      {Object.keys(department).map((key) => (
                        <CTableRow key={key}>
                          {key !== 'department' && (
                            <>
                              <CTableDataCell scope="col">
                                {t(capitalizeWords(key))}
                              </CTableDataCell>
                              <CTableDataCell scope="col" className="text-center">
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
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDataToDisplay")}
        </CCallout>
      )}
    </>
  );
};

export default DepartmentWiseDistribution;
