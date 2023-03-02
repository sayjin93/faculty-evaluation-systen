import React from "react";
import { useTranslation } from "react-i18next";

import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from "@coreui/react";
import { cilLockLocked, cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";

const AppHeaderDropdown = () => {
  const { t } = useTranslation();

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar color="primary" textColor="white" status="success" size="md">
          JK
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          {t("Settings")}
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {t("Profile")}
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          {t("Settings")}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          {t("Logout")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
