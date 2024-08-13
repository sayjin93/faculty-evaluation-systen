import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CFormSelect, CInputGroup, CInputGroupText } from "@coreui/react";

//hooks
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setFaculties, setSelectedFaculty } from "src/store";
import { getFaculties, getSelectedFaculty } from "src/store/selectors";

const SelectBoxFaculty = ({ className = "" }) => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();
  //#endregion

  //#region selectors
  const faculties = useSelector(getFaculties);
  const selectedFaculty = useSelector(getSelectedFaculty);
  //#endregion

  //#region functions
  const handleChange = (e) => {
    const selectedFacultyId = Number(e.target.value);

    const selectedFaculty = faculties.find(
      (faculty) => faculty.id === selectedFacultyId
    );

    if (selectedFaculty) {
      dispatch(
        setSelectedFaculty({
          id: selectedFaculty.id,
          key: selectedFaculty.key,
        })
      );
    }
  };

  const fetchFaculties = async () => {
    await api
      .get("/faculty")
      .then((response) => {
        const filteredFaculties = response.data.map(
          ({ id, key, deletedAt }) => ({
            id,
            key,
            deletedAt,
          })
        ); // Extracting only id and key
        dispatch(setFaculties(filteredFaculties));

        const { id, key } = response.data[0];
        dispatch(setSelectedFaculty({ id, key }));
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
      <CInputGroupText component="label">{t("Faculty")}</CInputGroupText>
      <CFormSelect
        className="cursor"
        value={selectedFaculty?.id}
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
