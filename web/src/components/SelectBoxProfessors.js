// @ts-ignore
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setProfessors, setSelectedProfessor, showToast } from "../store";
import axios from "axios";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

const SelectBoxProfessors = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
        <option value={0}>{t("All")}</option>

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
