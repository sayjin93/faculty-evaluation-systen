import React from "react";
import { useTranslation } from "react-i18next";

import { CListGroup, CListGroupItem } from "@coreui/react";
import { RxCheck, RxCross2 } from "react-icons/rx";

// CheckCriteria Component
const CheckCriteria = ({ valid, children }) => {
    const iconProps = {
        className: `text-${valid ? "success" : "danger"}`,
        style: { fontSize: "18px" },
    };

    const fillLineProps = {
        style: {
            flexGrow: 1,
            height: 1,
            borderBottom: "1px dashed #d8dbe0",
        },
    };

    return (
        <div className="flex flex-center flex-gap-10">
            {valid ? <RxCheck {...iconProps} /> : <RxCross2 {...iconProps} />}
            {children}
            <span {...fillLineProps} />
        </div>
    );
};

// Password validation function
export const checkPasswordCriteria = (password) => {
    return {
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChar: /[^A-Za-z0-9]/.test(password),
        minLength: password.length >= 8,
    };
};


// PasswordCriteria Component
const PasswordCriteria = ({ password }) => {
    const { t } = useTranslation();

    const passwordCriteria = checkPasswordCriteria(password);

    return (
        <div id="passwordCriteria">
            <CListGroup className="list-group-noBorder">
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.lowercase}>
                        {t("OneLowercaseCharacter")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.uppercase}>
                        {t("OneUppercaseCharacter")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.number}>
                        {t("OneNumber")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.specialChar}>
                        {t("OneSpecialCharacter")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.minLength}>
                        {t("EightCharactersMinimum")}
                    </CheckCriteria>
                </CListGroupItem>
            </CListGroup>
        </div>
    );
};

export default PasswordCriteria;
