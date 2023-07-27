import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CHeader,
  CHeaderBrand,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";

import TableHeader from "src/hooks/tableHeader";
import { convertDateFormat, formatDate2, formatDateFromSQL } from "src/hooks";

import { showToast } from "src/store";

import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt } from "@coreui/icons";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region selectors
  const { selectedProfessor, academicYearId } = useSelector((state) => ({
    // @ts-ignore
    selectedProfessor: state.professors.selected,
    // @ts-ignore
    academicYearId: state.settings.academicYear.id,
  }));
  //#endregion

  //#region states
  const [items, setItems] = useState({
    books: [],
    communityServices: [],
    conferences: [],
    courses: [],
    papers: [],
  });
  //#endregion

  //#region functions
  const exportPDF = () => {
    const doc = new jsPDF();

    // Function to add table to PDF document
    const addTableToPDF = (title, head, dataArray, yPosition) => {
      doc.text(title, 10, yPosition);

      autoTable(doc, {
        head: [head],
        body: dataArray,
        startY: yPosition + 5, // Adjust the startY position for the table body
      });
      // doc.addPage();
    };

    const coursesHead = [
      "#",
      "Name",
      "Number",
      "Semester",
      "Week Hours",
      "Program",
    ];
    const coursesArray = items.courses.map((course) => [
      course.id,
      course.name,
      course.number,
      course.semester,
      course.week_hours,
      course.program,
    ]);

    const papersHead = ["#", "Title", "Journal", "Publication"];
    const papersArray = items.papers.map((course) => [
      course.id,
      course.title,
      course.journal,
      convertDateFormat(course.publication, false),
    ]);

    const booksHead = ["#", "Title", "Publication House", "Publication Rear"];
    const booksArray = items.books.map((book) => [
      book.id,
      book.title,
      book.publication_house,
      convertDateFormat(book.publication_year, false),
    ]);

  // Set spacing between tables
  const spacingBetweenTables = 10;

  // Calculate the startY position for each table
  const startYPositionForCourses = 20;
  const startYPositionForPapers = startYPositionForCourses + 10 + coursesArray.length * 10 + 10 + spacingBetweenTables;
  const startYPositionForBooks = startYPositionForPapers + 10 + papersArray.length * 10 + 10 + spacingBetweenTables;

  // Generate each table
  addTableToPDF("Courses", coursesHead, coursesArray, startYPositionForCourses);
  addTableToPDF("Papers", papersHead, papersArray, startYPositionForPapers);
  addTableToPDF("Books", booksHead, booksArray, startYPositionForBooks);


    // Save the PDF with a filename
    doc.save("report.pdf");
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchReports = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/reports/academic_year/${academicYearId}/professor/${selectedProfessor}`
        )
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          debugger;
          if (error.code === "ERR_NETWORK") {
            dispatch(
              showToast({
                type: "danger",
                content: error.message,
              })
            );
          } else if (error.code === "ERR_BAD_REQUEST") {
            // Remove the JWT token from the Local Storage
            localStorage.removeItem("jwt_token");

            // Redirect the user to the login page
            navigate("/login", { replace: true });

            // Show alert
            dispatch(
              showToast({
                type: "danger",
                content: error.response.statusText,
              })
            );
          }
        });
    };

    fetchReports();
  }, [selectedProfessor, academicYearId]);
  //#endregion

  return (
    <>
      <CHeader className="mb-3">
        <CContainer fluid>
          <CHeaderBrand>{t("Reports")}</CHeaderBrand>

          <CButton color="primary" onClick={exportPDF}>
            {t("GeneratePdf")}
          </CButton>
        </CContainer>
      </CHeader>

      <CRow sm={{ cols: 1 }} lg={{ cols: 2 }} className="align-items-start">
        <CCol>
          <SelectBoxProfessors hasAll={false} />
        </CCol>
        <CCol>
          <SelectBoxAcademicYear />
        </CCol>
      </CRow>

      <CRow sm={{ cols: 1 }} lg={{ cols: 2 }} className="align-items-start">
        <CCol>
          <CTable
            id="testTable"
            small
            responsive
            striped
            hover
            align="middle"
            className="table-custom"
          >
            <CTableHead className="table-custom-header">
              <CTableRow>
                <CTableHeaderCell scope="colgroup" colSpan={6}>
                  {t("Courses")}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <TableHeader items={items.courses} timestamp={false} />

            <CTableBody>
              {items.courses.length > 0 ? (
                items.courses.map((element) => {
                  const id = element.id;

                  let program =
                    element.program === "Bachelor" ? "Bachelor" : "MSc";

                  return (
                    <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.name}</CTableDataCell>
                      <CTableDataCell>{element.number}</CTableDataCell>
                      <CTableDataCell>{element.semester}</CTableDataCell>
                      <CTableDataCell>{element.week_hours}</CTableDataCell>
                      <CTableDataCell>{program}</CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableHeaderCell colSpan={6}>
                    {t("NoDataToDisplay")}
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>

        <CCol>
          <CTable
            small
            responsive
            striped
            hover
            align="middle"
            className="table-custom"
          >
            <CTableHead className="table-custom-header">
              <CTableRow>
                <CTableHeaderCell scope="colgroup" colSpan={6}>
                  {t("Papers")}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <TableHeader items={items.papers} timestamp={false} />

            <CTableBody>
              {items.papers.length > 0 ? (
                items.papers.map((element) => {
                  const id = element.id;

                  let publication = element.publication
                    ? convertDateFormat(element.publication, false)
                    : null;

                  return (
                    <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.title}</CTableDataCell>
                      <CTableDataCell>{element.journal}</CTableDataCell>
                      <CTableDataCell>{publication}</CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    {t("NoDataToDisplay")}
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>

        <CCol>
          <CTable
            small
            responsive
            striped
            hover
            align="middle"
            className="table-custom"
          >
            <CTableHead className="table-custom-header">
              <CTableRow>
                <CTableHeaderCell scope="colgroup" colSpan={6}>
                  {t("Books")}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <TableHeader items={items.books} timestamp={false} />

            <CTableBody>
              {items.books.length > 0 ? (
                items.books.map((element) => {
                  const id = element.id;

                  let publication = element.publication_year
                    ? formatDateFromSQL(element.publication_year, true)
                    : null;

                  return (
                    <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.title}</CTableDataCell>
                      <CTableDataCell>
                        {element.publication_house}
                      </CTableDataCell>
                      <CTableDataCell>{publication}</CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableHeaderCell colSpan={4}>
                    {t("NoDataToDisplay")}
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>

        <CCol>
          <CTable
            small
            responsive
            striped
            hover
            align="middle"
            className="table-custom"
          >
            <CTableHead className="table-custom-header">
              <CTableRow>
                <CTableHeaderCell scope="colgroup" colSpan={6}>
                  {t("CommunityServices")}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <TableHeader items={items.communityServices} timestamp={false} />
            <CTableBody>
              {items.communityServices.length > 0 ? (
                items.communityServices.map((element) => {
                  const id = element.id;
                  const date = element.time ? formatDate2(element.time) : null;
                  const checked = element.external ? (
                    <CIcon icon={cilCheckAlt} size="sm" />
                  ) : (
                    ""
                  );
                  return (
                    <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.event}</CTableDataCell>
                      <CTableDataCell>{date}</CTableDataCell>
                      <CTableDataCell>{element.description}</CTableDataCell>
                      <CTableDataCell className="text-center">
                        {checked}
                      </CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableHeaderCell colSpan={5}>
                    {t("NoDataToDisplay")}
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>

      <CRow className="align-items-start">
        <CCol>
          <CTable
            small
            responsive
            striped
            hover
            align="middle"
            className="table-custom"
          >
            <CTableHead className="table-custom-header">
              <CTableRow>
                <CTableHeaderCell scope="colgroup" colSpan={6}>
                  {t("Conferences")}
                </CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <TableHeader items={items.conferences} timestamp={false} />

            <CTableBody>
              {items.conferences.length > 0 ? (
                items.conferences.map((element) => {
                  const id = element.id;

                  return (
                    <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
                      <CTableDataCell>{element.name}</CTableDataCell>
                      <CTableDataCell>{element.location}</CTableDataCell>
                      <CTableDataCell>{element.present_title}</CTableDataCell>
                      <CTableDataCell>{element.authors}</CTableDataCell>
                      <CTableDataCell>{element.dates}</CTableDataCell>
                    </CTableRow>
                  );
                })
              ) : (
                <CTableRow>
                  <CTableHeaderCell colSpan={6}>
                    {t("NoDataToDisplay")}
                  </CTableHeaderCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </CCol>
      </CRow>
    </>
  );
};

export default Reports;
