import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setFaculty } from "src/store";
import { getFaculty } from "src/store/selectors";

const SelectBoxFaculty = ({ className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const selectedFaculty = useSelector(getFaculty);
  //#endregion

  //#region states
  const [faculties, setFaculties] = useState([]);
  //#endregion

  //#region functions
  const handleChange = async (e) => {
    dispatch(setFaculty(e.target.value));

  };

  const fetchFaculties = async () => {
    await api
      .get("/faculty")
      .then((response) => {
        setFaculties(response.data);
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchFaculties();
  }, []);
  //#endregion

  return (
    <CInputGroup className={className}>
      <CInputGroupText component="label">{t("Faculties")}</CInputGroupText>
      <CFormSelect
        className="cursor"
        value={selectedFaculty}
        onChange={handleChange}
      >
        {faculties
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

export default SelectBoxFaculty;
