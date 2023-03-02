import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CButton, CContainer, CHeader, CHeaderBrand } from "@coreui/react";

import FormModal from "./FormModal";

const PageHeader = (props) => {
  //#region constants
  const { title, component, buttons } = props;
  const { t } = useTranslation();
  //#endregion

  //#region states
  const [visible, setVisible] = useState(false);
  //#endregion

  return (
    <CHeader>
      <CContainer fluid>
        <CHeaderBrand>{title}</CHeaderBrand>

        {buttons ?? (
          <CButton color="dark" onClick={() => setVisible(!visible)}>
            {t("Add")}
          </CButton>
        )}
      </CContainer>

      <FormModal
        component={component}
        visible={visible}
        setVisible={setVisible}
      />
    </CHeader>
  );
};

export default PageHeader;
