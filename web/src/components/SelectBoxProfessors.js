import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { changeProfessorSelected } from "../store";

const SelectBoxProfessors = ({ modal = false }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region functions
  const RenderOptions = () => {
    return (
      <>
        {!modal && <option>{t("All")}</option>}

        {items.map((professor) => {
          const fullName = professor.first_name + " " + professor.last_name;
          return (
            <option key={professor.id} value={professor.id}>
              {fullName}
            </option>
          );
        })}
      </>
    );
  };
  const handleChange = (event) => {
    dispatch(changeProfessorSelected(event.target.value));
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/professors")
        .then((response) => {
          //set list of professors on state
          setItems(response.data);

          //set the first professor id as selected
          if (modal && response.data.length > 0) {
            dispatch(changeProfessorSelected(response.data[0].id));
          }
        })
        .catch((error) => {
          console.log(error);
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
      <CFormSelect onChange={handleChange}>
        <RenderOptions />
      </CFormSelect>
    </CInputGroup>
  );
};

export default SelectBoxProfessors;
