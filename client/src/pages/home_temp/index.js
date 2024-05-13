import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//store
import { showToast, setFirstLogin } from "src/store";
import {
  getLoggedUser,
  isFirstLogin,
} from "src/store/selectors";

//components
import Stats from "./components/Stats";
import Graphs from "./components/Graphs";
import ProfessorsStats from "./components/ProfessorsStats";

const Home = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  //#endregion

  //#region selectors
  const loggedUser = useSelector(getLoggedUser);
  const firstLogin = useSelector(isFirstLogin);
  //#endregion

  //#region useEffect
  useEffect(() => {
    if (firstLogin) {
      dispatch(
        showToast({
          type: "success",
          content:
            t("Welcome") +
            " " +
            loggedUser.first_name +
            " " +
            loggedUser.last_name,
        })
      );
      dispatch(setFirstLogin(false));
    }
  }, []);
  //#endregion

  return (
    <>
      <Stats />

      <Graphs />

      <ProfessorsStats />
    </>
  );
};

export default Home;
