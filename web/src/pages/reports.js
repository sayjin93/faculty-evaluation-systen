import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
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
      <CHeader>
        <CContainer fluid>
          <CHeaderBrand>{t("Reports")}</CHeaderBrand>
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
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Courses")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items.courses} report />
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
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Papers")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items.papers} report />
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
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Books")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items.books} report />
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
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("CommunityServices")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items.communityServices} report />
                <CTableBody>
                  {items.communityServices.length > 0 ? (
                    items.communityServices.map((element) => {
                      const id = element.id;
                      const date = element.time
                        ? formatDate2(element.time)
                        : null;
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="align-items-start">
        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Conferences")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items.conferences} report />
                <CTableBody>
                  {items.conferences.length > 0 ? (
                    items.conferences.map((element) => {
                      const id = element.id;

                      return (
                        <CTableRow key={id}>
                          <CTableHeaderCell scope="row">{id}</CTableHeaderCell>
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
    </>
  );
};

export default Reports;
