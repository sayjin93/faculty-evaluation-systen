// @ts-ignore
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { setProfessors, setSelectedProfessor } from "../store";
import useErrorHandler from "../hooks/useErrorHandler";

import axios from "axios";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

const SelectBoxProfessors = ({ hasAll = true }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  //#endregion

  //#region selectors
  const { professors, selectedProfesor } = useSelector((state) => ({
    // @ts-ignore
    professors: state.professors.list,
    // @ts-ignore
    selectedProfesor: state.professors.selected,
  }));
  //#endregion

  //#region functions
  const handleChange = (event) => {
    dispatch(setSelectedProfessor(event.target.value));
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/professors")
        .then((response) => {
          //set list of professors on redux state
          dispatch(setProfessors(response.data));

          //Nese nuk ka opsion per te selektuar te gjith profesoret, zgjidh automatikisht profesorin e pare
          if (!hasAll) {
            dispatch(setSelectedProfessor(1));
          }
        })
        .catch((error) => {
          handleError(error);
        });
    };

    fetchProfessors();
  }, []);
  //#endregion

  return (
    <CInputGroup className="mb-3">
      <CInputGroupText component="label">
        {t("ChooseProfessor")}
      </CInputGroupText>
      <CFormSelect
        className="cursor"
        value={selectedProfesor}
        onChange={handleChange}
      >
        {hasAll && <option value={0}>{t("All")}</option>}

        {professors.map((professor) => {
          const fullName = professor.first_name + " " + professor.last_name;
          return (
            <option key={professor.id} value={professor.id}>
              {fullName}
            </option>
          );
        })}
      </CFormSelect>
    </CInputGroup>
  );
};

export default SelectBoxProfessors;
