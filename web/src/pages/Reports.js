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

import logoImage from "../../src/assets/images/uet_logo.png"; // Replace with the path to your logo image

const Reports = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region selectors
  const { professors, selectedProfessor, academicYear } = useSelector(
    (state) => ({
      // @ts-ignore
      professors: state.professors.list,
      // @ts-ignore
      selectedProfessor: state.professors.selected,
      // @ts-ignore
      academicYear: state.settings.academicYear,
    })
  );

  // Find the professor with the matching ID
  const professor = professors.find((prof) => prof.id === selectedProfessor);
  const professorFullName = professor
    ? `${professor.first_name} ${professor.last_name}`
    : "";

  console.log(professorFullName);
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
    const logoWidth = 50;
    const logoHeight = 30;
    const logoXPosition = 10;
    const logoYPosition = 10;
    const textXPosition = logoXPosition + logoWidth + 30;
    const textYPosition = logoYPosition + 10;
    const spacingBetweenTables = 10;
  
    // Function to add image to PDF document
    const addImageToPDF = () => {
      doc.addImage(logoImage, "PNG", logoXPosition, logoYPosition, logoWidth, logoHeight);
    };
  
    // Function to add text rows parallel to the logo
    const addTextToPDF = () => {
      const professorText = `${t("Professor")}: ${professorFullName}`;
      doc.text(professorText, textXPosition, textYPosition);
  
      const academicYearText = `${t("AcademicYear")}: ${academicYear.year}`;
      doc.text(academicYearText, textXPosition, textYPosition + 10);
    };
  
    // Function to generate a table and add it to PDF document
    const generateTable = (title, head, dataArray, yPosition) => {
      doc.text(title, 10, yPosition);
      autoTable(doc, {
        head: [head],
        body: dataArray.length > 0 ? dataArray : [[t("NoDataToDisplay")]],
        startY: yPosition + 5,
        styles: dataArray.length === 0 && { halign: "center" },
      });
    };
  
    // Arrays and headers for different tables
    const coursesHead = ["#", t("Name"), t("Number"), t("Semester"), t("WeekHours"), t("Program")];
    const coursesArray = items.courses.map((course) => [
      course.id,
      course.name,
      course.number,
      course.semester,
      course.week_hours,
      course.program,
    ]);
  
    const papersHead = ["#", t("Title"), t("Journal"), t("Publication")];
    const papersArray = items.papers.map((course) => [
      course.id,
      course.title,
      course.journal,
      convertDateFormat(course.publication, false),
    ]);
  
    const booksHead = ["#", t("Title"), t("PublicationHouse"), t("PublicationYear")];
    const booksArray = items.books.map((book) => [
      book.id,
      book.title,
      book.publication_house,
      convertDateFormat(book.publication_year, false),
    ]);
  
    const communitiesHead = ["#", t("Event"), t("Date"), t("Description"), t("External")];
    const communitiesArray = items.communityServices.map((community) => [
      community.id,
      community.event,
      convertDateFormat(community.date, false),
      community.description,
      community.external,
    ]);
  
    const conferencesHead = ["#", t("Name"), t("Location"), t("PresentTitle"), t("Authors"), t("Dates")];
    const conferencesArray = items.conferences.map((conference) => [
      conference.id,
      conference.name,
      conference.location,
      conference.present_title,
      conference.authors,
      conference.dates,
    ]);
  
    // Calculate the startY position for each table
    const startYPositionForCourses = logoYPosition + logoHeight + spacingBetweenTables * 1.5;
    const startYPositionForPapers = startYPositionForCourses + 10 + coursesArray.length * 10 + 10 + spacingBetweenTables;
    const startYPositionForBooks = startYPositionForPapers + 10 + papersArray.length * 10 + 10 + spacingBetweenTables;
    const startYPositionForCommunities = startYPositionForBooks + 10 + booksArray.length * 10 + 10 + spacingBetweenTables;
    const startYPositionForConferences = startYPositionForCommunities + 10 + communitiesArray.length * 10 + 10 + spacingBetweenTables * 2;
  
    // Add image and text to PDF
    addImageToPDF();
    addTextToPDF();
  
    // Generate each table and add to PDF
    generateTable(t("Courses"), coursesHead, coursesArray, startYPositionForCourses);
    generateTable(t("Papers"), papersHead, papersArray, startYPositionForPapers);
    generateTable(t("Books"), booksHead, booksArray, startYPositionForBooks);
    generateTable(t("CommunityServices"), communitiesHead, communitiesArray, startYPositionForCommunities);
    generateTable(t("Conferences"), conferencesHead, conferencesArray, startYPositionForConferences);
  
    // Save the PDF with a filename
    doc.save(`report_${professorFullName}_${academicYear.year}.pdf`);
  };
  
  
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchReports = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/reports/academic_year/${academicYear.id}/professor/${selectedProfessor}`
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
  }, [selectedProfessor, academicYear]);
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
                  const date = element.date ? formatDate2(element.date) : null;
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
