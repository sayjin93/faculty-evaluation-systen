import React from 'react'
import { useTranslation } from 'react-i18next';
import DataGrid, { Selection, Pager, Paging, Scrolling, SearchPanel, ColumnChooser, ColumnChooserSelection, Sorting } from "devextreme-react/data-grid";


const CustomDataGrid = ({ dataSource, children }) => {
    const { t } = useTranslation();

    return (
        <div className='dx-viewport'>
            <DataGrid
                dataSource={dataSource}
                keyExpr="id"
                hoverStateEnabled={true}
                columnAutoWidth={true}
                showColumnLines={true}
                showBorders={true}
                columnHidingEnabled={true}
                noDataText={t("NoDataToDisplay")}
            >
                <SearchPanel visible={true}
                    width={240}
                    placeholder={t("Search") + "..."} />

                <ColumnChooser enabled={true} mode="select" title={t("ColumnChooser")}>
                    <ColumnChooserSelection
                        allowSelectAll={false}
                        selectByClick={true}
                    />
                </ColumnChooser>

                <Sorting mode="multiple" ascendingText={t("SortAscending")} descendingText={t("SortDescending")} clearText={t("ClearSorting")} />


                <Scrolling rowRenderingMode='virtual'></Scrolling>

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
                {children}
            </DataGrid>
        </div>
    )
}

export default CustomDataGrid