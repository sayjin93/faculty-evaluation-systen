import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setDepartments, setSelectedDepartment } from "src/store";
import {
  getSelectedFaculty,
  getDepartments,
  getSelectedDepartment,
} from "src/store/selectors";

const SelectBoxDepartment = ({ className = "", showAll = true }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const selectedFaculty = useSelector(getSelectedFaculty);
  const departments = useSelector(getDepartments);
  const selectedDepartment = useSelector(getSelectedDepartment);
  //#endregion

  //#region functions
  const handleChange = (e) => {
    const selectedDepartmentId = Number(e.target.value);

    if (selectedDepartmentId === 0) {
      dispatch(setSelectedDepartment({ id: 0, key: "All", faculty_id: 0 }));
    } else {
      const selectedDepartment = departments.find(
        (department) => department.id === selectedDepartmentId
      );

      if (selectedDepartment) {
        dispatch(
          setSelectedDepartment({
            id: selectedDepartment.id,
            key: selectedDepartment.key,
            faculty_id: selectedDepartment.faculty_id,
          })
        );
      }
    }
  };

  const fetchDepartments = async () => {
    await api
      .get(`/department/faculty/${selectedFaculty.id}`)
      .then((response) => {
        const filteredDepartments = response.data.map(
          ({ id, key, faculty_id, deletedAt }) => ({
            id,
            key,
            faculty_id,
            deletedAt,
          })
        ); // Extracting only id, key, faculty_id and deletedAt
        dispatch(setDepartments(filteredDepartments));

        if (showAll) {
          dispatch(setSelectedDepartment({ id: 0, key: "All", faculty_id: 0 })); // Dispatching selectedDepartment
        } else {
          const { id, key, faculty_id } = filteredDepartments[0]; // Destructuring id, key and faculty_id from first item
          dispatch(setSelectedDepartment({ id, key, faculty_id })); // Dispatching selectedDepartment
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (selectedFaculty?.id > 0) fetchDepartments();

    return () => {
      dispatch(setSelectedDepartment({ id: 0, key: "All", faculty_id: 0 }));
    };
  }, [selectedFaculty]);
  //#endregion

  return (
    <CInputGroup className={className}>
      <CInputGroupText component="label">{t("Department")}</CInputGroupText>
      <CFormSelect
        className="cursor"
        value={selectedDepartment.id}
        onChange={handleChange}
      >
        <option value={0} disabled={!showAll}>
          {showAll ? t("All") : t("PleaseSelect")}
        </option>

        {departments
          .filter(({ deletedAt }) => deletedAt === null)
          .map(({ id, key }) => (
            <option key={id} value={id}>
              {t(key)}
            </option>
          ))}
      </CFormSelect>
    </CInputGroup>
  );
};

export default SelectBoxDepartment;
