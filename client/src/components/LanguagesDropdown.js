import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CAlert,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

//hooks
import { arraysAreEqual, languageMap, setCookie } from "src/hooks";
import api from "src/hooks/api";

//store
import { setLanguages } from "src/store";
import { getLanguages } from "src/store/selectors";

const LanguagesDropdown = () => {
  //#region constants
  const dispatch = useDispatch();
  const { i18n } = useTranslation();

  const languages = useSelector(getLanguages);
  //#endregion

  //#region states
  const [error, setError] = useState(null);
  //#endregion

  //#region functions
  const fetchLanguages = async () => {
    try {
      const response = await api.get("/locales/languages");
      if (!arraysAreEqual(languages, response.data)) {
        dispatch(setLanguages(response.data)); // Set the languages in state
      }
    } catch (err) {
      setError(err);
    }
  };

  const findLanguageDetails = (code) =>
    languageMap.find((lang) => lang.code === code);

  const handleLanguageChange = (language) => {
    if (language !== i18n.language) {
      i18n.changeLanguage(language);

      setCookie({
        name: "language",
        value: language,
        options: { path: "/", sameSite: "strict" },
      });
    }
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    fetchLanguages();
  }, []);
  //#endregion

  if (error) return <CAlert color="danger">{error.message}</CAlert>;

  return (
    <CDropdown>
      <CDropdownToggle color="light">
        <CIcon icon={findLanguageDetails(i18n.language)?.icon} />
        <span className="ms-2">{findLanguageDetails(i18n.language)?.name}</span>
      </CDropdownToggle>

      <CDropdownMenu>
        {languages &&
          languages.map((language) => {
            const details = findLanguageDetails(language);
            return (
              <CDropdownItem
                key={language}
                className="cursor"
                onClick={() => handleLanguageChange(language)}
              >
                <CIcon icon={details?.icon} />
                <span className="ms-2">{details?.name}</span>
              </CDropdownItem>
            );
          })}
      </CDropdownMenu>
    </CDropdown>
  );
};

export default React.memo(LanguagesDropdown);
