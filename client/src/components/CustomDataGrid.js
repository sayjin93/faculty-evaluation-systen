import React from "react";
import { useTranslation } from "react-i18next";

//devextreme
import DataGrid, {
  Selection,
  Pager,
  Paging,
  Scrolling,
  SearchPanel,
  ColumnChooser,
  Sorting,
  HeaderFilter,
  Search,
  Column,
  Position,
} from "devextreme-react/data-grid";

const CustomDataGrid = ({ dataSource, children, keyExpr = "id" }) => {
  //#region constants
  const { t } = useTranslation();
  //#endregion

  //#region functions
  const cellRenderIndex = ({ rowIndex, component }) => {
    // Get the current page index and page size
    const pageIndex = component.pageIndex();
    const pageSize = component.pageSize();

    // Calculate the correct row number
    return rowIndex + 1 + pageIndex * pageSize;
  };
  //#endregion

  return (
    <div className="dx-viewport">
      <DataGrid
        dataSource={dataSource}
        keyExpr={keyExpr}
        hoverStateEnabled={true}
        columnAutoWidth={true}
        showColumnLines={true}
        showBorders={true}
        // columnHidingEnabled={true}
        noDataText={t("NoDataToDisplay")}
        repaintChangesOnly={true}
      >
        <SearchPanel
          visible={true}
          width={240}
          placeholder={t("Search") + "..."}
        />

        <ColumnChooser enabled={true} mode="select" title={t("ColumnChooser")}>
          <Position
            my="right top"
            at="right bottom"
            of=".dx-datagrid-column-chooser-button"
          />
        </ColumnChooser>

        <HeaderFilter
          visible={true}
          texts={{
            cancel: t("Cancel"),
            emptyValue: t("Blanks"),
            ok: t("Ok"),
          }}
        >
          <Search
            editorOptions={{
              placeholder: t("Search") + "...",
              mode: "text",
            }}
            enabled={true}
            timeout={500}
            mode="contains"
          />
        </HeaderFilter>
        <Sorting
          mode="multiple"
          ascendingText={t("SortAscending")}
          descendingText={t("SortDescending")}
          clearText={t("ClearSorting")}
        />

        <Scrolling rowRenderingMode="virtual"></Scrolling>

        <Selection mode="single" />

        <Paging defaultPageSize={10} />
        <Pager
          visible={true}
          // allowedPageSizes={[5, 10, 'all']}
          infoText={`${t("Page")} {0} of {1} ({2} ${t("Items").toLowerCase()})`}
          showPageSizeSelector={true}
          showInfo={true}
          showNavigationButtons={true}
        />
        {keyExpr === "id" && <Column
          alignment="right"
          cssClass="bold"
          caption="#"
          width={57}
          cellRender={cellRenderIndex}
        />}
        {children}
      </DataGrid>
    </div>
  );
};

export default CustomDataGrid;
