import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import PageHeader from "src/components/PageHeader";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import PageTable from "src/components/PageTable";

const Courses = () => {
  //#region constants
  const title = "Courses";
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchCourses = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/courses")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchCourses();
  }, []);
  //#endregion

  return (
    <>
      <PageHeader title={t(title)} component={title} />
      <SelectBoxProfessors />
      <PageTable items={items} component={title} />
    </>
  );
};

export default Courses;
