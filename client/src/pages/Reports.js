import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { t } from "i18next";

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
  CTableHeaderCell,
  CTableRow,
  CCallout
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCheckAlt } from "@coreui/icons";

//hooks
import api from "src/hooks/api";
import TableHeader from "src/hooks/tableHeader";
import useErrorHandler from "src/hooks/useErrorHandler";
import { convertDateFormat, formatDate2, formatDateFromSQL } from "src/hooks";

//store
import {
  getAcademicYear,
  getProfessors,
  getSelectedProfessor,
} from "src/store/selectors/selectors";

//components
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";

//jspdf
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//image
import logoImage from "src/assets/images/uet_logo.png";

const Reports = () => {
  //#region constants
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const academicYear = useSelector(getAcademicYear);
  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  //#endregion

  //#region filtered data
  //Find the professor with the matching ID
  const professor = professors.find(
    (prof) => prof.id === Number(selectedProfessor)
  );
  //Get the matched professor full name
  const professorFullName = professor
    ? `${professor.first_name} ${professor.last_name}`
    : "";
  //#endregion

  //#region states
  const [items, setItems] = useState({
    books: [],
    communities: [],
    conferences: [],
    courses: [],
    papers: [],
  });
  //#endregion

  //#region functions
  const fetchReport = async () => {
    await api
      .get(
        `/report/academic_year/${academicYear.id}/professor/${selectedProfessor}`
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
    const logoXPosition = 10;
    const logoYPosition = 10;
    const textXPosition = logoXPosition + logoWidth + 30;
    const textYPosition = logoYPosition + 10;
    const spacingBetweenTables = 10;
    const spaceEmptyTable = 30;

    // Function to add image to PDF document
    const addImageToPDF = () => {
      doc.addImage(
        logoImage,
        "PNG",
        logoXPosition,
        logoYPosition,
        logoWidth,
        logoHeight
      );
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

    //#region columns
    const coursesHead = [
      "#",
      t("Name"),
      t("Number"),
      t("Semester"),
      t("WeekHours"),
      t("Program"),
    ];
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

    const booksHead = [
      "#",
      t("Title"),
      t("PublicationHouse"),
      t("PublicationYear"),
    ];
    const booksArray = items.books.map((book) => [
      book.id,
      book.title,
      book.publication_house,
      convertDateFormat(book.publication_year, false),
    ]);

    const communitiesHead = [
      "#",
      t("Event"),
      t("Date"),
      t("Description"),
      t("External"),
    ];
    const communitiesArray = items.communities.map((community) => [
      community.id,
      community.event,
      convertDateFormat(community.date, false),
      community.description,
      community.external,
    ]);

    const conferencesHead = [
      "#",
      t("Name"),
      t("Location"),
      t("PresentTitle"),
      t("Authors"),
      t("Dates"),
    ];
    const conferencesArray = items.conferences.map((conference) => [
      conference.id,
      conference.name,
      conference.location,
      conference.present_title,
      conference.authors,
      conference.dates,
    ]);
    //#endregion

    // Add image and text to PDF
    addImageToPDF();
    addTextToPDF();

    // Generate each table and add to PDF
    let cumulativeHeight =
      logoYPosition + logoHeight + spacingBetweenTables + 5;

    generateTable(t("Courses"), coursesHead, coursesArray, cumulativeHeight);
    cumulativeHeight +=
      items.courses.length > 0
        ? 10 + coursesArray.length * 10 + spacingBetweenTables
        : spaceEmptyTable;

    generateTable(t("Papers"), papersHead, papersArray, cumulativeHeight);
    cumulativeHeight +=
      items.papers.length > 0
        ? 10 + papersArray.length * 10 + spacingBetweenTables
        : spaceEmptyTable;

    generateTable(t("Books"), booksHead, booksArray, cumulativeHeight);
    cumulativeHeight +=
      items.books.length > 0
        ? 10 + booksArray.length * 10 + spacingBetweenTables
        : spaceEmptyTable;

    generateTable(
      t("CommunityServices"),
      communitiesHead,
      communitiesArray,
      cumulativeHeight
    );
    cumulativeHeight +=
      items.communities.length > 0
        ? 10 + communitiesArray.length * 10 + spacingBetweenTables
        : spaceEmptyTable;

    generateTable(
      t("Conferences"),
      conferencesHead,
      conferencesArray,
      cumulativeHeight
    );
    cumulativeHeight +=
      items.conferences.length > 0
        ? 10 + booksArray.length * 10 + spacingBetweenTables
        : spaceEmptyTable;

    // Save the PDF with a filename
    doc.save(`report_${professorFullName}_${academicYear.year}.pdf`);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchReport();
  }, [selectedProfessor, academicYear]);
  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="m-0">{t("Reports")}</h6>
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
              <SelectBoxProfessors hasAll={false} />
            </CCol>
            <CCol>
              <SelectBoxAcademicYear />
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {professor && academicYear ? (
        <CRow
          xs={{ cols: 1, gutter: 4 }}
          lg={{ cols: 2 }}
          className="align-items-start g-4"
        >
          <CCol>
            <CCard
              textColor="primary"
              className="border-primary border-top-primary border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">{t("Courses")}</h6>
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
                  <TableHeader
                    color="primary"
                    items={items?.courses}
                    timestamp={false}
                  />

                  <CTableBody>
                    {items && items.courses.length > 0 ? (
                      items.courses.map((element, index) => {
                        const id = element.id;

                        let program =
                          element.program === "Bachelor" ? "Bachelor" : "MSc";

                        return (
                          <CTableRow key={id}>
                            <CTableHeaderCell scope="row" className="text-end">
                              {index + 1}
                            </CTableHeaderCell>
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
              </CCardBody>
            </CCard>
          </CCol>

          <CCol>
            <CCard
              textColor="secondary"
              className="border-secondary border-top-secondary border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">{t("Papers")}</h6>
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
                  <TableHeader
                    color="secondary"
                    items={items?.papers}
                    timestamp={false}
                  />

                  <CTableBody>
                    {items && items.papers.length > 0 ? (
                      items.papers.map((element, index) => {
                        const id = element.id;

                        let publication = element.publication
                          ? convertDateFormat(element.publication, false)
                          : null;

                        return (
                          <CTableRow key={id}>
                            <CTableHeaderCell scope="row" className="text-end">
                              {index + 1}
                            </CTableHeaderCell>
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
              </CCardBody>
            </CCard>
          </CCol>

          <CCol>
            <CCard
              textColor="success"
              className="border-success border-top-success border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">{t("Books")}</h6>
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
                  <TableHeader
                    color="success"
                    items={items?.books}
                    timestamp={false}
                  />

                  <CTableBody>
                    {items && items.books.length > 0 ? (
                      items.books.map((element, index) => {
                        const id = element.id;

                        let publication = element.publication_year
                          ? formatDateFromSQL(element.publication_year, true)
                          : null;

                        return (
                          <CTableRow key={id}>
                            <CTableHeaderCell scope="row" className="text-end">
                              {index + 1}
                            </CTableHeaderCell>
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
              </CCardBody>
            </CCard>
          </CCol>

          <CCol>
            <CCard
              textColor="info"
              className="border-info border-top-info border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">{t("CommunityServices")}</h6>
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
                  <TableHeader
                    color="info"
                    items={items?.communities}
                    timestamp={false}
                  />
                  <CTableBody>
                    {items && items.communities.length > 0 ? (
                      items.communities.map((element, index) => {
                        const id = element.id;
                        const date = element.date
                          ? formatDate2(element.date)
                          : null;
                        const checked = element.external ? (
                          <CIcon icon={cilCheckAlt} size="sm" />
                        ) : (
                          ""
                        );
                        return (
                          <CTableRow key={id}>
                            <CTableHeaderCell scope="row" className="text-end">
                              {index + 1}
                            </CTableHeaderCell>
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
              </CCardBody>
            </CCard>
          </CCol>

          <CCol className="w-100">
            <CCard
              textColor="dark"
              className="border-dark border-top-dark border-top-3"
            >
              <CCardHeader>
                <h6 className="m-0">{t("Conferences")}</h6>
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
                  <TableHeader
                    color="dark"
                    items={items?.conferences}
                    timestamp={false}
                  />

                  <CTableBody>
                    {items && items.conferences.length > 0 ? (
                      items.conferences.map((element, index) => {
                        const id = element.id;

                        return (
                          <CTableRow key={id}>
                            <CTableHeaderCell scope="row" className="text-end">
                              {index + 1}
                            </CTableHeaderCell>
                            <CTableDataCell>{element.name}</CTableDataCell>
                            <CTableDataCell>{element.location}</CTableDataCell>
                            <CTableDataCell>
                              {element.present_title}
                            </CTableDataCell>
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDatatoDisplay")}
        </CCallout>
      )
      }
    </>
  );
};

export default Reports;
