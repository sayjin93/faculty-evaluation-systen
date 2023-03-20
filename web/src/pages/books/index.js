import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PageHeader from "src/components/PageHeader";
import PageTable from "src/components/PageTable";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

const Books = () => {
  //#region constants
  const title = "Book";
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchBooks = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/books")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchBooks();
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

export default Books;
