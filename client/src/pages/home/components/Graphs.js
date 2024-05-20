import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CRow,
  CCol,
  CWidgetStatsA,
} from "@coreui/react";
import { getStyle } from "@coreui/utils";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";
import CIcon from "@coreui/icons-react";

//icons
import { cilArrowBottom, cilArrowTop } from "@coreui/icons";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//components
import Skeleton from "src/components/Skeleton";

const Graphs = ({ userId, isAdmin }) => {
  //#region constants
  const { t } = useTranslation();
  const handleError = useErrorHandler();
  //#endregion

  //#region states
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  //#endregion

  //#region functions
  const generateArrow = (value) => {
    if (value > 0) return <CIcon icon={cilArrowTop} />;
    else if (value < 0) return <CIcon icon={cilArrowBottom} />;
    else return "";
  };
  const fetchAdminStatsCards = async () => {
    await api
      .get("/report/statsCards")
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };
  const fetchProfessorStats = async () => {
    await api
      .get(`/report/statsCards/professor/${userId}`)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => {
        handleError(error);
      });

    setIsLoading(false);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    isAdmin ? fetchAdminStatsCards() : fetchProfessorStats()
  }, []);
  //#endregion

  return (
    <CRow>
      <CCol sm={6} lg={3}>
        {(() => {
          if (isLoading) {
            return <Skeleton className="h-162 mb-4" />;
          } else if (!isLoading && stats.papersByYear) {
            const { total, progress, labels, data } = stats.papersByYear;

            return (
              <CWidgetStatsA
                className="mb-4"
                color="primary"
                value={
                  <>
                    {total + " "}
                    <span className="fs-6 fw-normal">
                      ({progress}% {generateArrow(progress)})
                    </span>
                  </>
                }
                title={t("Papers")}
                chart={
                  <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: "70px" }}
                    data={{
                      labels: labels,
                      datasets: [
                        {
                          label: t("Papers"),
                          backgroundColor: "transparent",
                          borderColor: "rgba(255,255,255,.55)",
                          pointBackgroundColor: getStyle("--cui-primary"),
                          data: data,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          // min: Math.min(...data) - 10,
                          // max: Math.max(...data) + 10,
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                          tension: 0.4,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            );
          }
        })()}
      </CCol>

      <CCol sm={6} lg={3}>
        {(() => {
          if (isLoading) {
            return <Skeleton className="h-162 mb-4" />;
          } else if (!isLoading && stats.booksByYear) {
            const { total, progress, labels, data } = stats.booksByYear;

            return (
              <CWidgetStatsA
                className="mb-4"
                color="info"
                value={
                  <>
                    {total + " "}
                    <span className="fs-6 fw-normal">
                      ({progress}% {generateArrow(progress)})
                    </span>
                  </>
                }
                title={t("Books")}
                chart={
                  <CChartLine
                    className="mt-3 mx-3"
                    style={{ height: "70px" }}
                    data={{
                      labels: labels,
                      datasets: [
                        {
                          label: t("Books"),
                          backgroundColor: "transparent",
                          borderColor: "rgba(255,255,255,.55)",
                          pointBackgroundColor: getStyle("--cui-info"),
                          data: data,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawBorder: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          display: false,
                          grid: {
                            display: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 1,
                        },
                        point: {
                          radius: 4,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            );
          }
        })()}
      </CCol>

      <CCol sm={6} lg={3}>
        {(() => {
          if (isLoading) {
            return <Skeleton className="h-162 mb-4" />;
          } else if (!isLoading && stats.conferencesByYear) {
            const { total, progress, labels, data } = stats.conferencesByYear;

            return (
              <CWidgetStatsA
                className="mb-4"
                color="warning"
                value={
                  <>
                    {total + " "}
                    <span className="fs-6 fw-normal">
                      ({progress}% {generateArrow(progress)})
                    </span>
                  </>
                }
                title={t("Conferences")}
                chart={
                  <CChartLine
                    className="mt-3"
                    style={{ height: "70px" }}
                    data={{
                      labels: labels,
                      datasets: [
                        {
                          label: t("Conferences"),
                          backgroundColor: "rgba(255,255,255,.2)",
                          borderColor: "rgba(255,255,255,.55)",
                          data: data,
                          fill: true,
                        },
                      ],
                    }}
                    options={{
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          display: false,
                        },
                        y: {
                          display: false,
                        },
                      },
                      elements: {
                        line: {
                          borderWidth: 2,
                          tension: 0.4,
                        },
                        point: {
                          radius: 0,
                          hitRadius: 10,
                          hoverRadius: 4,
                        },
                      },
                    }}
                  />
                }
              />
            );
          }
        })()}
      </CCol>

      <CCol sm={6} lg={3}>
        {(() => {
          if (isLoading) {
            return <Skeleton className="h-162 mb-4" />;
          } else if (!isLoading && stats.communitiesByYear) {
            const { total, progress, labels, data } = stats.communitiesByYear;

            return (
              <CWidgetStatsA
                className="mb-4"
                color="danger"
                value={
                  <>
                    {total + " "}
                    <span className="fs-6 fw-normal">
                      ({progress}% {generateArrow(progress)})
                    </span>
                  </>
                }
                title={t("Communities")}
                chart={
                  <CChartBar
                    className="mt-3 mx-3"
                    style={{ height: "70px" }}
                    data={{
                      labels: labels,
                      datasets: [
                        {
                          label: t("Communities"),
                          backgroundColor: "rgba(255,255,255,.2)",
                          borderColor: "rgba(255,255,255,.55)",
                          data: data,
                          barPercentage: 0.6,
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        x: {
                          grid: {
                            display: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                        y: {
                          grid: {
                            display: false,
                            drawBorder: false,
                            drawTicks: false,
                          },
                          ticks: {
                            display: false,
                          },
                        },
                      },
                    }}
                  />
                }
              />
            );
          }
        })()}
      </CCol>
    </CRow>
  );
};

export default Graphs;
