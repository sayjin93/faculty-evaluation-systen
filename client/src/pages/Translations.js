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
import DataGrid, { Column, SearchPanel } from "devextreme-react/data-grid";

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
  const fetchKeys = async () => {
    await api
      .get("/locales/keys")
      .then((response) => {

      })
      .catch((error) => {
        handleError(error);
      });
  };

  const handleStateChange = (value, fieldName) => {
    setDataSource(prevConfig => ({
      ...prevConfig,
      [fieldName]: value
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();



    await api
      .put("/keys", dataSource)
      .then((response) => {

        dispatch(
          showToast({
            type: "success",
            content: t(convertToKey(response.data.message)),
          })
        );
      })
      .catch((error) => {
        dispatch(
          showToast({
            type: "danger",
            content: error,
          })
        );
      });
  }
  //#endregion

  //#region useEffect
  useEffect(() => {
    // fetchKeys();
  }, []);
  //#endregion

  return (
    <>
      <CCard>
        <CCardHeader>
          <h6 className="card-title" style={{ minHeight: "38px" }}>
            <HiLanguage />
            <span className="title">{t("Translations")}</span>
          </h6>
          {/* <CButton
            color="primary"
            className="float-right"
            onClick={() => dispatch(setModal("editConference"))}
          >
            {t("Add")}
          </CButton> */}
        </CCardHeader>

        <CCardBody>

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
              repaintChangesOnly={true}
            >
              <SearchPanel visible={true}
                width={240}
                placeholder={t("Search") + "..."} />

              <SearchPanel visible={true}
                width={240}
                placeholder={t("Search") + "..."} />



              <p>volumns here</p>
            </DataGrid>
          </div>

        </CCardBody>
      </CCard >
    </>
  );
};

export default Translations;
