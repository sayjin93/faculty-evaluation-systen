import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CFormInput,
  CModalFooter,
  CForm,
  CFormSelect,
} from "@coreui/react";

//icons
import { HiLanguage } from "react-icons/hi2";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { setModal, showToast } from "src/store";
import { getModal } from "src/store/selectors";

//components
import LanguagesDropdown from "src/components/LanguagesDropdown";
import DataGrid, { Column, ColumnFixing, Editing, Pager, Paging, SearchPanel } from "devextreme-react/data-grid";

const Translations = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const modal = useSelector(getModal);
  //#endregion

  //#region states
  const [dataSource, setDataSource] = useState([]);
  //#endregion

  //#region functions
  const addNewLanguage = async () => {
    dispatch(
      showToast({
        type: "warning",
        content: "Work in progress",
      })
    );
  }
  const fetchKeys = async () => {
    await api
      .get("/locales")
      .then((response) => {
        setDataSource(response.data);

      })
      .catch((error) => {
        handleError(error);
      });
  };

  // A function to generate column components for each language dynamically
  const renderLanguageColumns = () => {
    if (dataSource.length === 0) return null;

    // Get the keys of the first item in the array as a representation of all
    // Assuming all items have the same structure
    const languageKeys = Object.keys(dataSource[0]).filter(key => key !== 'key');

    // Generate a column for each language
    return languageKeys.map(langKey => (
      <Column key={langKey} dataField={langKey} caption={langKey.toUpperCase()} />
    ));
  };

  const onSaved = async ({ changes }) => {
    await api
      .post("/locales/update", changes)
      .then((response) => {

        localStorage.setItem("shouldShowToast", "true");
        localStorage.setItem("toastMessage", JSON.stringify(response.data.message));
      })
      .catch((error) => {
        handleError(error);
      });
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    // Fetch translations keys
    fetchKeys();

    // Check if the toast should be shown
    const shouldShowToast = localStorage.getItem("shouldShowToast");
    const message = localStorage.getItem("toastMessage");

    if (shouldShowToast === "true") {
      dispatch(
        showToast({
          type: "success",
          content: t(convertToKey(JSON.parse(message))),
        })
      );

      // Clear the flag after showing toast
      localStorage.removeItem("shouldShowToast");
      localStorage.removeItem("toastMessage");
    }
  }, []);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <HiLanguage />
            <span className="title">{t("Translations")}</span>
          </h6>
          <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("addLanguage"))}
          >
            {t("Add")}
          </CButton>
        </CCardHeader>

        <CCardBody>
          <div className='dx-viewport'>
            <DataGrid
              dataSource={dataSource}
              keyExpr="key"
              hoverStateEnabled={true}
              columnAutoWidth={true}
              showColumnLines={true}
              showBorders={true}
              noDataText={t("NoDataToDisplay")}
              repaintChangesOnly={true}
              onSaved={onSaved}

            >
              <Editing
                mode="batch"
                allowUpdating={true}
                selectTextOnEditStart={true}
                startEditAction="click"
              />

              <SearchPanel visible={true}
                width={240}
                placeholder={t("Search") + "..."} />

              <Paging defaultPageSize={20} />
              <Pager
                visible={true}
                infoText={`${t("Page")} {0} of {1} ({2} ${t("Items").toLowerCase()})`}
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
              />

              <ColumnFixing enabled={true} />

              <Column fixed={true}
                allowEditing={false} dataField="key" caption="KEY" />

              {renderLanguageColumns()}
            </DataGrid>
          </div>

        </CCardBody>
      </CCard >

      <CModal
        id="addLanguage"
        backdrop="static"
        visible={modal.isOpen && modal.id === "addLanguage"}
        onClose={() => {
          dispatch(setModal());
        }}
      >
        <CModalHeader>
          <CModalTitle>{t("Add")}</CModalTitle>
        </CModalHeader>

        <CModalBody>
          <p>Selectbox here with filter (select2)</p>
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
            onClick={() => {
              addNewLanguage();
              dispatch(setModal());
            }}
          >
            {t("Add")}
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default React.memo(Translations);
