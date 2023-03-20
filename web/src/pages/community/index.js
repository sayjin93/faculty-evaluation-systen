import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

import PageHeader from "src/components/PageHeader";
import PageTable from "src/components/PageTable";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

const Community = () => {
  //#region constants
  const title = "CommunityService";
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [items, setItems] = useState([]);
  //#endregion

  //#region useEffect
  useEffect(() => {
    const fetchCommunity = async () => {
      await axios
        .get(process.env.REACT_APP_API_URL + "/community-service")
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchCommunity();
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

export default Community;
