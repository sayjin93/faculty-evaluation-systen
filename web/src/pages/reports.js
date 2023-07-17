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
  CTableCaption,
  CTableDataCell,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import axios from "axios";

import TableHeader from "src/hooks/tableHeader";
import { convertDateFormat } from "src/hooks";

import { showToast } from "src/store";

import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import SelectBoxAcademicYear from "src/components/SelectBoxAcademicYear";

const Reports = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region selectors
  const { professors, selectedProfessor, academicYearId } = useSelector(
    (state) => ({
      // @ts-ignore
      professors: state.professors.list,
      // @ts-ignore
      selectedProfessor: state.professors.selected,
      // @ts-ignore
      academicYearId: state.settings.academicYear.id,
    })
  );
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  debugger;
  const filteredItems =
    Number(selectedProfessor) !== 0
      ? items.filter((item) => item.professor_id === Number(selectedProfessor))
      : items;

  //#endregion

  //#region functions
  const RenderPapersTable = () => {
    if (items.length > 0) {
      return (
        <CTableBody>
          {filteredItems.map((element) => {
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
          })}
        </CTableBody>
      );
    } else {
      return (
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell colSpan={4}>
              {t("NoDataToDisplay")}
            </CTableHeaderCell>
          </CTableRow>
        </CTableBody>
      );
    }
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchPapers = async () => {
      await axios
        .get(
          process.env.REACT_APP_API_URL +
            `/papers/academic_year/${academicYearId}`
        )
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
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

    fetchPapers();
  }, []);

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
          <SelectBoxProfessors />
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
                <TableHeader items={items} report />
                <RenderPapersTable />
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Papers")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items} report />
                <RenderPapersTable />
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("Books")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items} report />
                <RenderPapersTable />
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol>
          <CCard color="light" className="mb-3">
            <CCardHeader>{t("CommunityServices")}</CCardHeader>
            <CCardBody>
              <CTable small responsive striped hover align="middle">
                <TableHeader items={items} report />
                <RenderPapersTable />
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
                <TableHeader items={items} report />
                <RenderPapersTable />
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Reports;
