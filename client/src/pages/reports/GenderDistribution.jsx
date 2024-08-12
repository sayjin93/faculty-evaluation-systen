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

//store
import {
  getAcademicYear,
  getFaculty,
  getDepartment,
} from "src/store/selectors";

//components
import SelectBoxFaculty from "src/components/SelectBoxFaculty";
import SelectBoxDepartment from "src/components/SelectBoxDepartment";
import CustomDataGrid from "src/components/CustomDataGrid";

//jspdf
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

//image
import logoImage from "src/assets/images/uet_logo.png";

const GenderDistribution = () => {
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
  const department = useSelector(getDepartment);
  const academicYear = useSelector(getAcademicYear);
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState(null);
  //#endregion

  console.log("items", items);

  //#region functions
  const fetchReport = async () => {
    const departmentId = department?.id || 0;
    await api
      .get(`/report/gender-distribution/${faculty.id}/${departmentId}`)
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
    const facultyText = t(faculty.key);
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
    doc.save(
      `${t("CourseLoadAnalysis")}_${t(faculty.key)}_${academicYear.year}.pdf`
    );
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchReport();
  }, [faculty, department]);
  //#endregion

  // Data aggregation for the "Gender-wise Involvement in Activities" table
  const aggregateActivityData = (activityData) => {
    const totalMale = activityData.reduce((acc, curr) => acc + curr.male, 0);
    const totalFemale = activityData.reduce(
      (acc, curr) => acc + curr.female,
      0
    );
    return {
      maleParticipation: totalMale,
      femaleParticipation: totalFemale,
      totalParticipation: totalMale + totalFemale,
    };
  };

  const activityParticipationData = [
    {
      activityType: t("Publications"),
      ...aggregateActivityData(
        items?.activityParticipation?.publications || []
      ),
    },
    {
      activityType: t("Conferences"),
      ...aggregateActivityData(items?.activityParticipation?.conferences || []),
    },
    {
      activityType: t("Courses Taught"),
      ...aggregateActivityData(items?.activityParticipation?.courses || []),
    },
    {
      activityType: t("Community Services"),
      ...aggregateActivityData(
        items?.activityParticipation?.communityServices || []
      ),
    },
  ];

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <FaRegCalendarAlt />
            <span className="title">
              {t("Reports")} | {t("GenderDistribution")}
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
              <SelectBoxDepartment />
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
                  <h6 className="m-0">{t("DistributionAcrossDepartments")}</h6>
                </CCardHeader>

                <CCardBody className="p-0">
                  <CustomDataGrid dataSource={items.genderDistribution}>
                    <Column
                      dataField="department"
                      caption={t("Department")}
                      dataType="string"
                    />
                    <Column
                      dataField="male"
                      caption={t("Male")}
                      dataType="number"
                      alignment="right"
                    />
                    <Column
                      dataField="female"
                      caption={t("Female")}
                      dataType="number"
                      alignment="right"
                    />
                    <Column
                      dataField="total"
                      caption={t("Total")}
                      dataType="number"
                      alignment="right"
                    />
                  </CustomDataGrid>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          <CRow
            className="mb-4"
            xs={{ cols: 1, gutterY: 3 }}
            md={{ cols: 2, gutterX: 4 }}
            lg={{ cols: 3, gutterX: 4 }}
          >
            {items.genderDistribution.map((item, index) => (
              <CCol key={index}>
                <CCard
                  textColor="primary"
                  className="border-primary border-top-primary border-top-3"
                >
                  <CCardHeader>
                    <h6 className="m-0">{t(item.department)}</h6>
                  </CCardHeader>
                  <CCardBody>
                    <CChart
                      type="doughnut"
                      data={{
                        labels: [t("Male"), t("Female")],
                        datasets: [
                          {
                            backgroundColor: [
                              getStyle("--cui-info"),
                              getStyle("--cui-warning"),
                            ], // Colors for male and female
                            data: [item.male, item.female], // Male and female data
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
                      }}
                    />
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>

          <CRow xs={{ cols: 1, gutter: 3 }} lg={{ cols: 2, gutter: 4 }}>
            <CCol>
              <CCard
                textColor="primary"
                className="border-primary border-top-primary border-top-3"
              >
                <CCardHeader>
                  <h6 className="m-0">
                    {t("GenderWiseInvolvementInActivities")}
                  </h6>
                </CCardHeader>

                <CCardBody className="p-0">
                  <CustomDataGrid dataSource={activityParticipationData}>
                    <Column
                      dataField="activityType"
                      caption={t("ActivityType")}
                      dataType="string"
                    />
                    <Column
                      dataField="maleParticipation"
                      caption={t("Male")}
                      dataType="number"
                      alignment="right"
                    />
                    <Column
                      dataField="femaleParticipation"
                      caption={t("Female")}
                      dataType="number"
                      alignment="right"
                    />
                    <Column
                      dataField="totalParticipation"
                      caption={t("Total")}
                      dataType="number"
                      alignment="right"
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
                  <h6 className="m-0">{t("Chart")}</h6>
                </CCardHeader>

                <CCardBody>
                  <CChart
                    type="radar"
                    data={{
                      labels: [
                        t("Publications"),
                        t("Conferences"),
                        t("Courses"),
                        t("CommunityServices"),
                      ],
                      datasets: [
                        {
                          label: t("Male"),
                          backgroundColor: "rgba(54, 162, 235, 0.2)",
                          borderColor: "rgba(54, 162, 235, 1)",
                          pointBackgroundColor: "rgba(54, 162, 235, 1)",
                          pointBorderColor: "#fff",
                          pointHoverBackgroundColor: "#fff",
                          pointHoverBorderColor: "rgba(54, 162, 235, 1)",
                          data: [
                            aggregateActivityData(
                              items?.activityParticipation?.publications || []
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.conferences || []
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.courses || []
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.communityServices ||
                                []
                            ).maleParticipation,
                          ],
                        },
                        {
                          label: t("Female"),
                          backgroundColor: "rgba(255, 99, 132, 0.2)",
                          borderColor: "rgba(255, 99, 132, 1)",
                          pointBackgroundColor: "rgba(255, 99, 132, 1)",
                          pointBorderColor: "#fff",
                          pointHoverBackgroundColor: "#fff",
                          pointHoverBorderColor: "rgba(255, 99, 132, 1)",
                          data: [
                            aggregateActivityData(
                              items?.activityParticipation?.publications || []
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.conferences || []
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.courses || []
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.communityServices ||
                                []
                            ).femaleParticipation,
                          ],
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
                        r: {
                          grid: {
                            color: getStyle("--cui-border-color-translucent"),
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
        </>
      ) : (
        <CCallout color="danger" className="bg-white">
          {t("NoDataToDisplay")}
        </CCallout>
      )}
    </>
  );
};

export default GenderDistribution;
