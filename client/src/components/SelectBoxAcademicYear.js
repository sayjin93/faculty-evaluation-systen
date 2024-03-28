import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { showToast, changeAcademicYear } from "src/store";
import {
  getAcademicYearId
} from "src/store/selectors";

const SelectBoxAcademicYear = ({ className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const activeAcademicYear = useSelector(getAcademicYearId);
  //#endregion

  //#region states
  const [academicYears, setAcademicYears] = useState([]);
  //#endregion

  //#region functions
  const handleChange = async (e) => {
    const selectedAcademicYear = academicYears.filter(
      (x) => x.id === Number(e.target.value)
    );

    const { id, year } = selectedAcademicYear[0];

    try {
      await api.put("academic-year/active/" + id);

      dispatch(changeAcademicYear(selectedAcademicYear[0]));
      dispatch(
        showToast({
          type: "success",
          content: t("AcademicYear") + " " + year + " " + t("IsSetAsActive"),
        })
      );
    } catch (error) {
      dispatch(
        showToast({
          type: "danger",
          content: error,
        })
      );
    }
  };

  const fetchAcademicYears = async () => {
    await api
      .get("/academic-year")
      .then((response) => {
        const academicYears = response.data;

        // Sort the academic years by id in descending order
        const sortedAcademicYears = academicYears.sort((a, b) => b.id - a.id);

        setAcademicYears(sortedAcademicYears);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchAcademicYears();
  }, []);
  //#endregion

  return (
    <CInputGroup className={className}>
      <CInputGroupText component="label">{t("AcademicYear")}</CInputGroupText>
      <CFormSelect
        className="cursor"
        value={activeAcademicYear}
        onChange={handleChange}
      >
        {academicYears.map((item) => {
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
