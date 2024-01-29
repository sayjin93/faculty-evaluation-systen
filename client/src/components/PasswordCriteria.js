import React from "react";
import { useTranslation } from "react-i18next";

import { CListGroup, CListGroupItem } from "@coreui/react";
import { RxCheck, RxCross2 } from "react-icons/rx";

// CheckCriteria Component
const CheckCriteria = ({ valid, smallTxt = "", children }) => {
    const iconProps = {
        className: `text-${valid ? "success" : "danger"}`,
        style: { fontSize: "22px" },
    };

    const fillLineProps = {
        style: {
            flexGrow: 1,
            height: 1,
            borderWidth: "0 0 1px 0",
            borderStyle: "dashed",
            borderColor: "rgba(255, 255, 255, 0.3)",
        },
    };

    return (
        <div className="flex flex-center flex-gap-10">
            {valid ? <RxCheck {...iconProps} /> : <RxCross2 {...iconProps} />}
            <span>{children}</span>
            <span className="small">{smallTxt}</span>
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
const PasswordCriteria = ({ password, className = "" }) => {
    const { t } = useTranslation();

    const passwordCriteria = checkPasswordCriteria(password);

    return (
        <div id="passwordCriteria" className={className}>
            <CListGroup className="list-group-noBorder">
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.minLength}>
                        {t("AtLeast8CharactersLength")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.number} smallTxt="(0...9)">
                        {t("AtLeast1Number")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.specialChar} smallTxt="(!...$)">
                        {t("AtLeast1SpecialSymbol")}
                    </CheckCriteria>
                </CListGroupItem>
                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.lowercase} smallTxt="(a...z)">
                        {t("AtLeast1LowercaseLetter")}
                    </CheckCriteria>
                </CListGroupItem>

                <CListGroupItem>
                    <CheckCriteria valid={passwordCriteria.uppercase} smallTxt="(A...Z)">
                        {t("AtLeast1UppercaseLetter")}
                    </CheckCriteria>
                </CListGroupItem>
            </CListGroup>
        </div>
    );
};

export default PasswordCriteria;
