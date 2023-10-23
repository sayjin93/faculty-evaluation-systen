// @ts-ignore
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import {
  getProfessors,
  getSelectedProfessor,
} from "../store/selectors/selectors";
import { setProfessors, setSelectedProfessor } from "../store";
import useErrorHandler from "src/hooks/useErrorHandler";

import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";
import api from "src/hooks/api";

const SelectBoxProfessors = ({ hasAll = true, className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  //#endregion

  //#region functions
  const handleChange = (event) => {
    dispatch(setSelectedProfessor(event.target.value));
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      await api
        .get("professors")
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
    <CInputGroup className={className}>
      <CInputGroupText component="label">
        {t("ChooseProfessor")}
      </CInputGroupText>
      <CFormSelect
        className="cursor"
        value={selectedProfessor}
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
