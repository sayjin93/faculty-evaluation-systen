import React from 'react'
import { useTranslation } from 'react-i18next';

//coreUI
import { CAlert, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import { CSpinner } from "@coreui/react";

//hooks
import { languageMap, setCookie } from 'src/hooks';
import useLanguages from 'src/hooks/useLanguages';
import { useDispatch, useSelector } from 'react-redux';
import useErrorHandler from 'src/hooks/useErrorHandler';

//store
import { setModal, } from "src/store";
import { getModal } from "src/store/selectors";
import { SelectBox } from 'devextreme-react';
import { renderLngSwitcher } from 'src/hooks/languageSwitcher';

const temp = [
    {
        "id": 0,
        "name": "English",
        "value": "en",
        "icon": null,
        "isDisable": false,
        "isSelected": false,
        "disabled": false
    },
    {
        "id": 0,
        "name": "Deutsch",
        "value": "de",
        "icon": null,
        "isDisable": false,
        "isSelected": false,
        "disabled": false
    },
    {
        "id": 0,
        "name": "Française",
        "value": "fr",
        "icon": null,
        "isDisable": false,
        "isSelected": false,
        "disabled": false
    },
    {
        "id": 0,
        "name": "Italiano",
        "value": "it",
        "icon": null,
        "isDisable": false,
        "isSelected": false,
        "disabled": false
    }
]

const LanguageAdd = ({ btnColor = "light", btnClass = "" }) => {
    //#region constants
    const { i18n, t } = useTranslation();
    const dispatch = useDispatch();
    const handleError = useErrorHandler();

    const modal = useSelector(getModal);

    //#endregion

    //#region states
    const { languages, isLoading, error } = useLanguages();
    //#endregion

    // Utility function to find language details from the map
    const findLanguageDetails = (code) => languageMap.find(lang => lang.code === code);

    //#region functions
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
        <>
            <CButton
                color={btnColor}
                className={btnClass}
                onClick={() => dispatch(setModal("addLanguage"))}
            >
                {t("Add")}
            </CButton>

            <CModal
                id="addLanguage"
                backdrop="static"
                visible={modal.isOpen && modal.id === "addLanguage"}
                onClose={() => {
                    dispatch(setModal());
                }}
            >
                <CModalHeader>
                    <CModalTitle>{t("AddNewLanguage")}</CModalTitle>
                </CModalHeader>

                <CModalBody>
                    <SelectBox
                        className="lngSelector"
                        dataSource={temp}
                        valueExpr="value"
                        displayExpr="name"
                        // value={lang}
                        // width="130px"
                        deferRendering={false}
                        fieldRender={(e) => renderLngSwitcher(e, "field")}
                        itemRender={(e) => renderLngSwitcher(e, "item")}
                    // onValueChanged={(e) => handleLngChange(e)}
                    />
                </CModalBody>

                <CModalFooter>
                    <CButton
                        color="secondary"
                        onClick={() => {
                            dispatch(setModal());
                        }}
                    >
                        {t("Close")}
                    </CButton>
                    <CButton
                    // disabled={newAcademicYear.length === 0}
                    // onClick={() => {
                    //     addAcademicYear();
                    //     dispatch(setModal());
                    // }}
                    >
                        {t("Add")}
                    </CButton>
                </CModalFooter>
            </CModal>

        </>
    );
}

export default LanguageAdd;