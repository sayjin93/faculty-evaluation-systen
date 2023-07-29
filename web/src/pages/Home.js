import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { batch, useDispatch, useSelector } from "react-redux";
import { showToast, changeAcademicYear, setFirstLogin } from "../store";

import axios from "axios";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import useErrorHandler from "../hooks/useErrorHandler";

import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cilPen,
  cilPeople,
} from "@coreui/icons";

import avatar1 from "../assets/images/avatars/1.jpg";
import avatar2 from "../assets/images/avatars/2.jpg";
import avatar3 from "../assets/images/avatars/3.jpg";
import avatar4 from "../assets/images/avatars/4.jpg";
import avatar5 from "../assets/images/avatars/5.jpg";
import avatar6 from "../assets/images/avatars/6.jpg";

const Home = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const { academicYear, loggedUser, firstLogin } = useSelector((state) => ({
    // @ts-ignore
    academicYear: state.settings.academicYear,
    // @ts-ignore
    loggedUser: state.user.loggedUser,
    // @ts-ignore
    firstLogin: state.settings.firstLogin,
  }));
  //#endregion

  //#region states
  const [items, setItems] = useState({
    professors: [],
    books: [],
    communityServices: [],
    conferences: [],
    courses: [],
    papers: [],
  });
  //#endregion

  //#region data
  const uniData = [
    { title: t("Professors"), value: "12", percent: 80, color: "success" },
    { title: t("Courses"), value: "58", percent: 72, color: "info" },
    { title: t("Papers"), value: "34", percent: 60, color: "warning" },
    { title: t("Books"), value: "18", percent: 25, color: "danger" },
    { title: t("Conferences"), value: "7", percent: 40, color: "primary" },
    {
      title: t("CommunityServices"),
      value: "3",
      percent: 12.78,
      color: "secondary",
    },
  ];

  const tableExample = [
    {
      avatar: { src: avatar1, status: "success" },
      user: {
        name: "Yiorgos Avraamu",
        new: true,
        registered: "Jan 1, 2021",
      },
      country: { name: "USA", flag: cifUs },
      usage: {
        value: 50,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "success",
      },
      payment: { name: "Mastercard", icon: cibCcMastercard },
      activity: "10 sec ago",
    },
    {
      avatar: { src: avatar2, status: "danger" },
      user: {
        name: "Avram Tarasios",
        new: false,
        registered: "Jan 1, 2021",
      },
      country: { name: "Brazil", flag: cifBr },
      usage: {
        value: 22,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "info",
      },
      payment: { name: "Visa", icon: cibCcVisa },
      activity: "5 minutes ago",
    },
    {
      avatar: { src: avatar3, status: "warning" },
      user: { name: "Quintin Ed", new: true, registered: "Jan 1, 2021" },
      country: { name: "India", flag: cifIn },
      usage: {
        value: 74,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "warning",
      },
      payment: { name: "Stripe", icon: cibCcStripe },
      activity: "1 hour ago",
    },
    {
      avatar: { src: avatar4, status: "secondary" },
      user: { name: "Enéas Kwadwo", new: true, registered: "Jan 1, 2021" },
      country: { name: "France", flag: cifFr },
      usage: {
        value: 98,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "danger",
      },
      payment: { name: "PayPal", icon: cibCcPaypal },
      activity: "Last month",
    },
    {
      avatar: { src: avatar5, status: "success" },
      user: {
        name: "Agapetus Tadeáš",
        new: true,
        registered: "Jan 1, 2021",
      },
      country: { name: "Spain", flag: cifEs },
      usage: {
        value: 22,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "primary",
      },
      payment: { name: "Google Wallet", icon: cibCcApplePay },
      activity: "Last week",
    },
    {
      avatar: { src: avatar6, status: "danger" },
      user: {
        name: "Friderik Dávid",
        new: true,
        registered: "Jan 1, 2021",
      },
      country: { name: "Poland", flag: cifPl },
      usage: {
        value: 43,
        period: "Jun 11, 2021 - Jul 10, 2021",
        color: "success",
      },
      payment: { name: "Amex", icon: cibCcAmex },
      activity: "Last week",
    },
  ];
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL + "/academic-year/active",
          {
            headers: {
              "auth-token": localStorage.getItem("jwt_token"),
              "Content-Type": "application/json",
            },
          }
        );
        const activeObject = response.data[0];
        dispatch(changeAcademicYear(activeObject));
      } catch (error) {
        handleError(error);
      }
    };

    const fetchDashboard = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_API_URL +
            `/dashboard/academic_year/${academicYear.id}`,
          {
            headers: {
              "auth-token": localStorage.getItem("jwt_token"),
              "Content-Type": "application/json",
            },
          }
        );
        setItems(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    Promise.all([fetchAcademicYears(), fetchDashboard()]).then(() => {
      if (firstLogin) {
        batch(() => {
          dispatch(
            showToast({
              type: "success",
              content:
                t("Welcome") +
                " " +
                loggedUser.first_name +
                " " +
                loggedUser.last_name,
            })
          );
          dispatch(setFirstLogin(false));
        });
      }
    });
  }, []);

  //#endregion

  return (
    <>
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 className="card-title mb-0">{t("AcademicYear")}</h4>
              <div className="small text-medium-emphasis">
                {academicYear.year}
              </div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton
                color="light"
                className="float-end"
                onClick={() => navigate("/settings")}
              >
                <CIcon icon={cilPen} />
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <CRow>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-info py-1 px-3">
                <div className="text-medium-emphasis small">
                  {t("Professors")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.professors.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Courses")}</div>
                <div className="fs-5 fw-semibold">{items.courses.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Papers")}</div>
                <div className="fs-5 fw-semibold">{items.papers.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">{t("Books")}</div>
                <div className="fs-5 fw-semibold">{items.books.length}</div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("Conferences")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.conferences.length}
                </div>
              </div>
            </CCol>
            <CCol xs={6} md={4} lg={2}>
              <div className="border-start border-start-4 border-start-secondary py-1 px-3 mb-3">
                <div className="text-medium-emphasis small">
                  {t("CommunityServices")}
                </div>
                <div className="fs-5 fw-semibold">
                  {items.communityServices.length}
                </div>
              </div>
            </CCol>
          </CRow>
        </CCardFooter>
      </CCard>

      <WidgetsDropdown />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>Title {" & "} Progress</CCardHeader>
            <CCardBody>
              <CRow
                xs={{ cols: 1 }}
                sm={{ cols: 2 }}
                md={{ cols: 3 }}
                lg={{ cols: 6 }}
                className="text-center"
              >
                {uniData.map((item, index) => (
                  <CCol className="mb-sm-2 mb-0" key={index}>
                    <div className="text-medium-emphasis">{item.title}</div>
                    <strong>
                      {item.value} ({item.percent}%)
                    </strong>
                    <CProgress
                      thin
                      className="mt-2"
                      color={item.color}
                      value={item.percent}
                    />
                  </CCol>
                ))}
              </CRow>

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Country
                    </CTableHeaderCell>
                    <CTableHeaderCell>Usage</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">
                      Payment Method
                    </CTableHeaderCell>
                    <CTableHeaderCell>Activity</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {tableExample.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar
                          size="md"
                          src={item.avatar.src}
                          status={item.avatar.status}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.user.name}</div>
                        <div className="small text-medium-emphasis">
                          <span>{item.user.new ? "New" : "Recurring"}</span> |
                          Registered: {item.user.registered}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon
                          size="xl"
                          icon={item.country.flag}
                          title={item.country.name}
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.usage.value}%</strong>
                          </div>
                          <div className="float-end">
                            <small className="text-medium-emphasis">
                              {item.usage.period}
                            </small>
                          </div>
                        </div>
                        <CProgress
                          thin
                          color={item.usage.color}
                          value={item.usage.value}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon size="xl" icon={item.payment.icon} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">
                          Last login
                        </div>
                        <strong>{item.activity}</strong>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Home;
