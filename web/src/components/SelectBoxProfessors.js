import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";
import axios from "axios";

const SelectBoxProfessors = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region functions
  const RenderOptions = () => {
    return (
      <>
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
  const handleChange = (e) => {
    alert("Profesori u ndryshua");
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      await axios
        .get("http://localhost:5000/professors")
        .then((response) => {
          setItems(response.data);
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
      <CInputGroupText component="label" htmlFor="inputGroupSelect01">
        {t("ChooseProfessor")}
      </CInputGroupText>
      <CFormSelect id="inputGroupSelect01" onChange={handleChange}>
        <option>{t("All")}</option>
        <RenderOptions />
      </CFormSelect>
    </CInputGroup>
  );
};

export default SelectBoxProfessors;
