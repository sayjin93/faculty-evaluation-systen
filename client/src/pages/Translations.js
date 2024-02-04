import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//coreUI
import { CCard, CCardBody, CCardHeader } from "@coreui/react";

//devextreme
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnFixing,
  Editing,
  Pager,
  Paging,
  Position,
  SearchPanel,
} from "devextreme-react/data-grid";

//icons
import { HiLanguage } from "react-icons/hi2";

//hooks
import { convertToKey } from "src/hooks";
import api from "src/hooks/api";
import useErrorHandler from "src/hooks/useErrorHandler";

//store
import { showToast } from "src/store";
import { getLanguages } from "src/store/selectors";

//components
import LanguageAdd from "src/components/LanguageAdd";

const Translations = () => {
  //#region constants
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleError = useErrorHandler();

  const languages = useSelector(getLanguages);
  //#endregion

  //#region states
  const [dataSource, setDataSource] = useState([]);
  //#endregion

  //#region functions
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
    const languageKeys = Object.keys(dataSource[0]).filter(
      (key) => key !== "key"
    );

    // Generate a column for each language
    return languageKeys.map((langKey) => (
      <Column
        key={langKey}
        dataField={langKey}
        caption={langKey.toUpperCase()}
      />
    ));
  };

  const onSaved = async ({ changes }) => {
    await api
      .post("/locales/update", changes)
      .then((response) => {
        if (process.env.REACT_APP_ENV === "development") {
          localStorage.setItem("shouldShowToast", "true");
          localStorage.setItem(
            "toastMessage",
            JSON.stringify(response.data.message)
          );
        } else {
          dispatch(
            showToast({
              type: "success",
              content: t(convertToKey(response.data.message)),
            })
          );
        }
      })
      .catch((error) => {
        handleError(error);
      });
  };
  //#endregion

  //#region useEffect
  useEffect(() => {
    // Fetch translations keys
    fetchKeys();

    if (process.env.REACT_APP_ENV === "development") {
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
    }
  }, [languages]);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader className="flex justify-content-between align-items-center">
          <h6 className="card-title">
            <HiLanguage />
            <span className="title">{t("Translations")}</span>
          </h6>
          <LanguageAdd btnColor="primary" btnClass="text-end" />
        </CCardHeader>

        <CCardBody>
          <div className="dx-viewport">
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

              <SearchPanel
                visible={true}
                width={240}
                placeholder={t("Search") + "..."}
              />

              <ColumnChooser
                enabled={true}
                mode="select"
                title={t("ColumnChooser")}
              >
                <Position
                  my="right top"
                  at="right bottom"
                  of=".dx-datagrid-column-chooser-button"
                />
              </ColumnChooser>

              <Paging defaultPageSize={20} />
              <Pager
                visible={true}
                infoText={`${t("Page")} {0} of {1} ({2} ${t(
                  "Items"
                ).toLowerCase()})`}
                showPageSizeSelector={true}
                showInfo={true}
                showNavigationButtons={true}
              />

              <ColumnFixing enabled={false} />

              <Column
                // fixed={true}
                allowEditing={false}
                dataField="key"
                caption="KEY"
              />

              {renderLanguageColumns()}
            </DataGrid>
          </div>
        </CCardBody>
      </CCard>
    </>
  );
};

export default React.memo(Translations);
