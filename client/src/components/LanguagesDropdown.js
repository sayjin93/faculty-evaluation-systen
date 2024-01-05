import React from 'react'
import { useTranslation } from 'react-i18next';

//coreUI
import { CAlert, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import { CSpinner } from "@coreui/react";
import CIcon from '@coreui/icons-react'

//hooks
import { languageMap, setCookie } from 'src/hooks';
import useLanguages from 'src/hooks/useLanguages';

const LanguagesDropdown = () => {
    //#region constants
    const { i18n } = useTranslation();
    const { languages, isLoading, error } = useLanguages();
    //#endregion

    //#region functions
    const findLanguageDetails = (code) => languageMap.find(lang => lang.code === code);

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

    if (error) return <CAlert color="danger">{error.message}</CAlert>
    else if (isLoading) return <CSpinner color="pt-1 primary" />

    return (
        <CDropdown>
            <CDropdownToggle color="light">
                <CIcon icon={findLanguageDetails(i18n.language)?.icon} />
                <span className="ms-2">{findLanguageDetails(i18n.language)?.name}</span>
            </CDropdownToggle>

            <CDropdownMenu>
                {languages && languages.map((language) => {
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
}

export default LanguagesDropdown;