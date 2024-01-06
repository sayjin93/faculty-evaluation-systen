import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next';

//devextreme
import { SelectBox, TextBox } from 'devextreme-react';

//coreUI
import { CAlert, CSpinner, CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import CIcon from '@coreui/icons-react';

//hooks
import { convertToKey, languageMap } from 'src/hooks';
import api from 'src/hooks/api';
import useLanguages from 'src/hooks/useLanguages';

//store
import { setModal, showToast, } from "src/store";
import { getModal } from "src/store/selectors";

const LanguageAdd = ({ btnColor = "light", btnClass = "" }) => {
    //#region constants
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const modal = useSelector(getModal);

    //Get existing languages list
    const { languages, isLoading, error } = useLanguages();

    //Remove existing list from new languages list
    const filteredLanguageMap = languageMap.filter(language => !languages.includes(language.code));
    //#endregion

    //#region states
    const [value, setValue] = useState(null);
    const [pending, setPending] = useState(false);
    //#endregion

    //#region functions
    const renderField = (data) => {
        return (
            <div className="flex flex-align-center">
                {value && <CIcon style={{ marginLeft: "16px" }} icon={data && data?.icon} />}

                <TextBox
                    placeholder={t("SelectALanguage") + "..."}
                    defaultValue={data && data.name}
                    readOnly={true}
                />
            </div>
        );
    };
    const renderItem = (data) => {
        return (
            <div className="flex flex-align-center flex-gap-10">
                <CIcon icon={data?.icon} />
                <div style={{ marginLeft: "7px" }}>{data?.name}</div>
            </div>
        );
    };
    const onValueChanged = useCallback((e) => {
        setValue(e.value);
    }, []);

    const handleAddLanguage = async () => {
        setPending(true);

        await api
            .post("/locales/add-language", { lang: value })
            .then(() => {
                dispatch(setModal());
                dispatch(
                    showToast({
                        type: "success",
                        content: t("NewLanguageAddedSuccessfully"),
                    })
                );
            })
            .catch((error) => {
                const { status, data } = error.response;

                if (status === 406) {
                    dispatch(
                        showToast({
                            type: "warning",
                            content: t(convertToKey(data.error)),
                        })
                    );
                }
                else {
                    dispatch(
                        showToast({
                            type: "danger",
                            content: t(convertToKey(data.error)),
                        })
                    );
                }
            });

        setPending(false);
    }
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
                    if (!pending) dispatch(setModal());
                }}
            >
                <CModalHeader closeButton={pending ? false : true}>
                    <CModalTitle>{t("AddNewLanguage")}</CModalTitle>
                </CModalHeader>

                <CModalBody>
                    {
                        error ? <CAlert color="danger">{error.message}</CAlert>
                            : isLoading ? <CSpinner color="pt-1 primary" /> : <SelectBox
                                dataSource={filteredLanguageMap}
                                valueExpr="code"
                                displayExpr="name"
                                onValueChanged={onValueChanged}
                                fieldRender={renderField}
                                itemRender={renderItem}
                            />
                    }
                </CModalBody>

                <CModalFooter>
                    <CButton
                        disabled={pending}
                        color="secondary"
                        onClick={() => { dispatch(setModal()) }}
                    >
                        {t("Close")}
                    </CButton>
                    <CButton disabled={!value} onClick={handleAddLanguage}>
                        {pending ? <CSpinner color="light" size="sm" /> : t("Add")}
                    </CButton>
                </CModalFooter>
            </CModal>

        </>
    );
}

export default LanguageAdd;