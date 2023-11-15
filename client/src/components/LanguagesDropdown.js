import React from 'react'
import { useTranslation } from 'react-i18next';

//coreUI
import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cifAl, cifGb } from "@coreui/icons";

//hooks
import { setCookie } from 'src/hooks';

const LanguagesDropdown = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (language) => {
        i18n.changeLanguage(language);
        setCookie({
            name: "language",
            value: language,
            options: { path: "/", sameSite: "strict" },
        });
    };


    return (
        <CDropdown>
            <CDropdownToggle color="light">
                {i18n.language === "sq" ? (
                    <>
                        <CIcon icon={cifAl} />
                        <span className="ms-2">Shqip</span>
                    </>
                ) : (
                    <>
                        <CIcon icon={cifGb} />
                        <span className="ms-2">English</span>
                    </>
                )}
            </CDropdownToggle>
            <CDropdownMenu>
                <CDropdownItem
                    className="cursor"
                    onClick={() => handleLanguageChange("sq")}
                >
                    <CIcon icon={cifAl} />
                    <span className="ms-2">Shqip</span>
                </CDropdownItem>
                <CDropdownItem
                    className="cursor"
                    onClick={() => handleLanguageChange("en")}
                >
                    <CIcon icon={cifGb} />
                    <span className="ms-2">English</span>
                </CDropdownItem>
            </CDropdownMenu>
        </CDropdown>
    )
}

export default LanguagesDropdown;