import React from "react";
import { useTranslation } from "react-i18next";
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

const SelectBoxProfessors = () => {
  //#region constants
  const { t } = useTranslation();
  const professors = [
    {
      id: 1,
      first_name: "Petraq",
      last_name: "Papajorgji",
      gender: "m",
    },
    {
      id: 2,
      first_name: "Liseta",
      last_name: "Sholla",
      gender: "f",
    },
  ];
  //#endregion

  //#region functions
  const RenderOptions = () => {
    return (
      <>
        {professors.map((professor) => {
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
