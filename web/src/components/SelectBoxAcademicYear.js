// @ts-ignore
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showToast, changeAcademicYear } from "src/store";

import axios from "axios";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

const SelectBoxAcademicYear = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //#endregion

  //#region selectors
  const activeAcademicYear = useSelector(
    // @ts-ignore
    (state) => state.settings.academicYear
  );
  //#endregion

  //#region states
  const [academicYear, setAcademicYear] = useState([]);
  const [status, setStatus] = useState(null);
  //#endregion

  //#region functions
  const handleChange = (e) => {
    debugger;
    const seletedAcademicYear = academicYear.filter(
      (x) => x.id === Number(e.target.value)
    );

    dispatch(changeAcademicYear(seletedAcademicYear[0]));
    updateActiveStatus(seletedAcademicYear[0]);
  };

  const updateActiveStatus = async (item) => {
    const { id, year } = item;

    await axios
      .put(process.env.REACT_APP_API_URL + "/academic-year/active/" + id)
      .then((response) => {
        setStatus(response);

        dispatch(
          showToast({
            type: "success",
            content: "Academic Year " + year + " is set as active!",
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: error,
          })
        );
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchAcademicYears = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/academic-year")
        .then((response) => {
          setAcademicYear(response.data);
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

    fetchAcademicYears();
  }, []);
  //#endregion

  return (
    <CInputGroup className="mb-3">
      <CInputGroupText component="label">{t("AcademicYear")}</CInputGroupText>
      <CFormSelect
        className="cursor"
        value={activeAcademicYear.id}
        onChange={handleChange}
      >
        {academicYear.map((item) => {
          const { id, year } = item;

          return (
            <option key={id} value={id}>
              {year}
            </option>
          );
        })}
      </CFormSelect>
    </CInputGroup>
  );
};

export default SelectBoxAcademicYear;
