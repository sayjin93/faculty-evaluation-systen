import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import PageHeader from "src/components/PageHeader";
import PageTable from "src/components/PageTable";

const Professors = () => {
  //#region constants
  const title = "Professor";
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchProfessors = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/professors")
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
      <PageHeader title={t(title)} component={title} />
      <PageTable items={items} component={title} />
    </>
  );
};

export default Professors;
