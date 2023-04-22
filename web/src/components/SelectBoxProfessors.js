import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CButton,
  CCol,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import axios from "axios";

const SelectBoxProfessors = () => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  const [selectId, setSelectId] = useState();
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
  const findOneProfessors = async (id) => {
    const token = localStorage.getItem("jwt_token");
    const headers = {
      "auth-token": token,
      "Content-Type": "application/json",
    };

    await axios
      .get(process.env.REACT_APP_API_URL + "/professors" + "/" + id, {
        headers: headers,
      })
      .then((response) => {
        // setItems(response.data);
        alert(response.data.first_name);
        // reload()
      })
      .catch((error) => {
        // navigate("/login");
        alert("No result");
        console.log(error);
      });
  };
  const handleIdChanged = (event) => {
    setSelectId(event.target.value);
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      const token = localStorage.getItem("jwt_token");
      const headers = {
        "auth-token": token,
        "Content-Type": "application/json",
      };

      await axios
        .get(process.env.REACT_APP_API_URL + "/professors", {
          headers: headers,
        })
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
    <>
      <CRow>
        <CCol>
          <CButton color="dark" onClick={() => findOneProfessors(selectId)}>
            Find
          </CButton>
        </CCol>
        <CCol>
          <CFormInput
            type="text"
            floatingClassName="mb-3"
            floatingLabel="id"
            placeholder="id"
            value={selectId}
            onChange={handleIdChanged}
          />
        </CCol>
      </CRow>

      <CInputGroup className="mb-3">
        <CInputGroupText component="label" htmlFor="inputGroupSelect01">
          {t("ChooseProfessor")}
        </CInputGroupText>
        <CFormSelect id="inputGroupSelect01" onChange={handleChange}>
          <option>{t("All")}</option>
          <RenderOptions />
        </CFormSelect>
      </CInputGroup>
    </>
  );
};

export default SelectBoxProfessors;
