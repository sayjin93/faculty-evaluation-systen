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

//react-icons
import { FaRegCalendarAlt } from "react-icons/fa";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { getSelectedFaculty, getSelectedDepartment } from "src/store/selectors";

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
  const chartRefs = useRef([]);
  const involvementInActivitiesChartRef = useRef(null);
  //#endregion

  //#region selectors
  const selectedFaculty = useSelector(getSelectedFaculty);
  const selectedDepartment = useSelector(getSelectedDepartment);
  //#endregion

  //#region states
  const [items, setItems] = useState(null);
  //#endregion

  //#region functions
  const fetchReport = async () => {
    if (
      selectedDepartment.faculty_id === 0 ||
      selectedDepartment.faculty_id === selectedFaculty.id
    ) {
      await api
        .get(
          `/report/gender-distribution/${selectedFaculty.id}/${selectedDepartment.id}`
        )
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          handleError(error);
        });
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const logoWidth = 60;
    const logoHeight = 30;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const logoXPosition = (pageWidth - logoWidth) / 2;
    const logoYPosition = 10;
    const textYPosition = logoYPosition + logoHeight + 10;
    const spacingBetweenSections = 10;
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

    // Centered text for Faculty and Departmeny
    const facultyText = t(selectedFaculty.key);
    const facultyTextWidth = doc.getTextWidth(facultyText);
    const facultyTextXPosition = (pageWidth - facultyTextWidth) / 2;

    const departmentText = `${t("Department")}: ${
      selectedDepartment.id > 0 ? t(selectedDepartment.key) : t("All")
    }`;
    const departmentTextWidth = doc.getTextWidth(departmentText);
    const departmentTextXPosition = (pageWidth - departmentTextWidth) / 2;

    doc.text(facultyText, facultyTextXPosition, textYPosition);
    doc.text(departmentText, departmentTextXPosition, textYPosition + 10);

    // Gender Distribution Table
    currentY += spacingBetweenSections;
    const genderTableData =
      items?.genderDistribution?.map((item) => [
        t(item.department),
        item.male,
        item.female,
        item.total,
      ]) || [];

    autoTable(doc, {
      head: [[t("Department"), t("Male"), t("Female"), t("Total")]],
      body: genderTableData,
      startY: currentY,
      theme: "grid",
      styles: { cellPadding: 3, fontSize: 10 },
      didDrawPage: (data) => {
        currentY = data.cursor.y + spacingBetweenSections;
      },
    });

    // Check if a new page is needed
    const checkAndAddPage = (requiredHeight) => {
      if (currentY + requiredHeight > pageHeight) {
        doc.addPage();
        currentY = 20;
      }
    };

    const chartWidth = (pageWidth - 30) / 2; // Calculate width for 2 charts in a row
    const chartHeight = chartWidth; // Maintain aspect ratio

    let chartsInRow = 0;
    let startX = 10; // Initial x position for the first chart

    // Courses Distribution Chart with headers
    items.genderDistribution.forEach((item, index) => {
      // Add card header
      doc.setFontSize(12);
      doc.text(t(item.department), startX, currentY);
      currentY += 6; // Move down for chart

      const chartCanvas =
        chartRefs.current[index]?.getElementsByTagName("canvas")[0];
      if (chartCanvas) {
        const chartImage = chartCanvas.toDataURL("image/png", 1.0); // Max quality

        // Add chart image to PDF
        doc.addImage(
          chartImage,
          "PNG",
          startX,
          currentY,
          chartWidth,
          chartHeight
        );

        // Move to the next chart position
        chartsInRow += 1;
        startX += chartWidth + 10; // Adjust x position for the next chart

        if (chartsInRow === 2) {
          // Reset to the next row after 2 charts
          chartsInRow = 0;
          startX = 10;
          currentY += chartHeight + spacingBetweenSections + 10; // Add space for next row of charts
          checkAndAddPage(chartHeight + spacingBetweenSections + 10);
        } else {
          currentY -= 6; // Adjust Y position to keep headers aligned
        }
      }
    });

    // Handle case where an odd number of charts leaves one chart alone
    if (chartsInRow === 1) {
      currentY += chartHeight + spacingBetweenSections + 10; // Add space for next row of charts
    }

    // Add Gender-wise Involvement in Activities Table
    currentY += spacingBetweenSections;
    checkAndAddPage(30); // Check if a new page is needed before adding the table
    autoTable(doc, {
      head: [[t("ActivityType"), t("Male"), t("Female"), t("Total")]],
      body: activityParticipationData.map((item) => [
        t(item.activityType),
        item.maleParticipation,
        item.femaleParticipation,
        item.totalParticipation,
      ]),
      startY: currentY,
      theme: "grid",
      styles: { cellPadding: 3, fontSize: 10 },
      didDrawPage: (data) => {
        currentY = data.cursor.y + spacingBetweenSections;
      },
    });

    // Add Radar Chart (Involvement in Activities Chart)
    const radarChartCanvas =
      involvementInActivitiesChartRef.current?.getElementsByTagName(
        "canvas"
      )[0];
    if (radarChartCanvas) {
      const radarChartImage = radarChartCanvas.toDataURL("image/png", 1.0); // Max quality

      checkAndAddPage(chartHeight + spacingBetweenSections);
      doc.addImage(
        radarChartImage,
        "PNG",
        10,
        currentY,
        pageWidth - 20,
        (pageWidth - 20) * 0.6 // Maintain aspect ratio
      );
    }

    // Save the PDF with a filename
    doc.save(
      `${t("GenderDistribution")}_${t(selectedFaculty.key)}_${
        selectedDepartment.id > 0 ? selectedDepartment.key : ""
      }.pdf`
    );
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (selectedFaculty.id > 0) fetchReport();
  }, [selectedFaculty, selectedDepartment]);
  //#endregion

  // Data aggregation for the "Gender-wise Involvement in Activities" table
  const aggregateActivityData = (activityData, index) => {
    const totalMale = activityData.reduce((acc, curr) => acc + curr.male, 0);
    const totalFemale = activityData.reduce(
      (acc, curr) => acc + curr.female,
      0
    );
    return {
      id: index + 1,
      maleParticipation: totalMale,
      femaleParticipation: totalFemale,
      totalParticipation: totalMale + totalFemale,
    };
  };

  const activityParticipationData = [
    {
      activityType: t("Courses"),
      ...aggregateActivityData(items?.activityParticipation?.courses || [], 2),
    },
    {
      activityType: t("Papers"),
      ...aggregateActivityData(items?.activityParticipation?.papers || [], 0),
    },
    {
      activityType: t("Books"),
      ...aggregateActivityData(items?.activityParticipation?.books || [], 3),
    },
    {
      activityType: t("Conferences"),
      ...aggregateActivityData(
        items?.activityParticipation?.conferences || [],
        1
      ),
    },
    {
      activityType: t("Communities"),
      ...aggregateActivityData(
        items?.activityParticipation?.communities || [],
        4
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

      {items ? (
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
                  ref={(el) => (chartRefs.current[index] = el)}
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
                              "rgb(54, 162, 235)",
                              "rgb(255, 99, 132)",
                            ],
                            data: [item.male, item.female], // Male and female data
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
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

                <CCardBody ref={involvementInActivitiesChartRef}>
                  <CChart
                    type="radar"
                    data={{
                      labels: [
                        t("Courses"),
                        t("Papers"),
                        t("Books"),
                        t("Conferences"),
                        t("Communities"),
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
                              items?.activityParticipation?.courses || [],
                              2
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.papers || [],
                              0
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.books || [],
                              3
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.conferences || [],
                              1
                            ).maleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.communities || [],
                              4
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
                              items?.activityParticipation?.courses || [],
                              2
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.papers || [],
                              0
                            ).femaleParticipation,

                            aggregateActivityData(
                              items?.activityParticipation?.books || [],
                              3
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.conferences || [],
                              1
                            ).femaleParticipation,
                            aggregateActivityData(
                              items?.activityParticipation?.communities || [],
                              4
                            ).femaleParticipation,
                          ],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
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
