import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setDepartment } from "src/store";
import { getFaculty } from "src/store/selectors";

const SelectBoxDepartment = ({ className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const faculty = useSelector(getFaculty);
  //#endregion

  //#region states
  const [departments, setDepartments] = useState([]);
  //#endregion

  //#region functions
  const handleChange = (e) => {
    const selectedDepartmentId = Number(e.target.value);

    if (selectedDepartmentId === 0) {
      dispatch(setDepartment(null));
    } else {
      const selectedDepartment = departments.find(
        (department) => department.id === selectedDepartmentId
      );

      if (selectedDepartment) {
        dispatch(
          setDepartment({
            id: selectedDepartment.id,
            key: selectedDepartment.key,
          })
        );
      }
    }
  };

  const fetchFaculties = async () => {
    await api
      .get(`/department/faculty/${faculty.id}`)
      .then((response) => {
        setDepartments(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchFaculties();

    return () => {
      dispatch(setDepartment(null));
    };
  }, [faculty]);
  //#endregion

  return (
    <CInputGroup className={className}>
      <CInputGroupText component="label">{t("Department")}</CInputGroupText>
      <CFormSelect className="cursor" defaultValue={0} onChange={handleChange}>
        <option key={0} value={0}>
          {t("All")}
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
