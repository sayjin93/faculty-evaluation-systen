import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import PageHeader from "src/components/PageHeader";
import PageTable from "src/components/PageTable";
import SelectBoxProfessors from "src/components/SelectBoxProfessors";

const Pappers = () => {
  //#region constants
  const { t } = useTranslation();

  const columns = ["id", "name", "number", "semester", "week_hours", "program"];
  const papers = [
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

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      await axios
        .get("http://localhost:5000/users")
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchUsers();
  }, []);

  return (
    <>
      <PageHeader title={t("Papers")} component="papers" />
      <SelectBoxProfessors />
      <PageTable columns={columns} items={papers} component="papers" />

      <h1>Users:</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </>
  );
};

export default Pappers;
