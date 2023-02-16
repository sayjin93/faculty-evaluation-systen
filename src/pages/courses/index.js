import React from "react";
import { useTranslation } from "react-i18next";

import PageHeader from "src/components/PageHeader";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";
import PageTable from "src/components/PageTable";

const Courses = () => {
  //#region constants
  const { t } = useTranslation();

  const columns = ["id", "name", "number", "semester", "week_hours", "program"];
  const courses = [
    {
      id: 1,
      name: "Java Advanced Programming",
      number: "c1",
      semeser: 1,
      week_hours: 4,
      program: 1,
    },
    {
      id: 2,
      name: "Java Programming",
      number: "c2",
      semeser: 2,
      week_hours: 4,
      program: 2,
    },
    {
      id: 3,
      name: "Java",
      number: "c3",
      semeser: 1,
      week_hours: 4,
      program: 1,
    },
    {
      id: 4,
      name: "Data Structures",
      number: "c4",
      semeser: 1,
      week_hours: 4,
      program: 1,
    },
    {
      id: 5,
      name: "Java Advanced",
      number: "c5",
      semeser: 2,
      week_hours: 4,
      program: 2,
    },
  ];
  //#endregion

  return (
    <>
      <PageHeader title={t("Courses")} component="courses" />
      <SelectBoxProfessors />
      <PageTable columns={columns} items={courses} component="courses" />
    </>
  );
};

export default Courses;
