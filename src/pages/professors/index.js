import React from "react";
import { useTranslation } from "react-i18next";
import PageHeader from "src/components/PageHeader";
import PageTable from "src/components/PageTable";

const Professors = () => {
  //#region constants
  const { t } = useTranslation();

  const columns = ["id", "first_name", "last_name", "gender"];
  const items = [
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

  return (
    <>
      <PageHeader title={t("Professors")} component="professor" />
      <PageTable columns={columns} items={items} component="professor" />
    </>
  );
};

export default Professors;
