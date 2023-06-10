import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import { showToast } from "src/store/slices/toastSlice";

const AppHeaderDropdown = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region functions
  const logout = () => {
    // Remove the JWT token from the Local Storage
    localStorage.removeItem("jwt_token");

    // Redirect the user to the login page
    navigate("/login", { replace: true });

    //Show toast with notification
    dispatch(
      showToast({
        type: "success",
        content: "You have been logout successfully!",
      })
    );
  };
  //#endregion

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
        <CDropdownItem href="#" onClick={logout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          {t("Logout")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
