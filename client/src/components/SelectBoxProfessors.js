import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setProfessors, setSelectedProfessor } from "../store";

//selectors
import {
  getProfessors,
  getSelectedProfessor,
} from "../store/selectors/selectors";

const SelectBoxProfessors = ({ hasAll = true, className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const professors = useSelector(getProfessors);
  const selectedProfessor = useSelector(getSelectedProfessor);
  //#endregion

  //#region functions
  const handleChange = (event) => {
    dispatch(setSelectedProfessor(event.target.value));
  };
  const fetchProfessors = async () => {
    await api
      .get("/professor")
      .then((response) => {
        const { data } = response.data;

        //Set list of professors on redux state
        dispatch(setProfessors(data));

        //If there is no option to select all professors, automatically select the first professor    
        if (!hasAll) {
          const firstId = data[0].id;
          dispatch(setSelectedProfessor(firstId));
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
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
