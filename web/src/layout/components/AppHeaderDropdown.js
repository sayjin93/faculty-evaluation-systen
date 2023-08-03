import React from "react";
import { batch, useDispatch, useSelector } from "react-redux";
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
import { cilAccountLogout, cilSettings, cilUser } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { setFirstLogin, showToast } from "src/store";

const AppHeaderDropdown = () => {
  //#region constants
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //#endregion

  //#region selectors
  const loggedUser = useSelector((state) => state.user.loggedUser);

  const firstName = loggedUser?.first_name;
  const lastName = loggedUser?.last_name;
  const fNameInit = firstName?.charAt(0);
  const lNameInit = lastName?.charAt(0);
  const initials = fNameInit + lNameInit;
  //#endregion

  //#region functions
  const logout = () => {
    // Remove the JWT token from the Local Storage
    localStorage.removeItem("jwt_token");

    // Redirect the user to the login page
    navigate("/login", { replace: true });

    batch(() => {
      //Show toast with notification
      dispatch(
        showToast({
          type: "success",
          content: "You have been logout successfully!",
        })
      );
      dispatch(setFirstLogin(true));
    });
  };
  //#endregion

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle className="py-0" caret={false}>
        <CAvatar color="primary" textColor="white" status="success" size="md">
          {initials ? initials : <CIcon icon={cilUser} />}
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          {t("UserMenu")}
        </CDropdownHeader>
        <CDropdownItem
          className="cursor"
          onClick={() =>
            dispatch(
              showToast({ type: "warning", content: "Work in progress" })
            )
          }
        >
          <CIcon icon={cilUser} className="me-2" />
          {t("Profile")}
        </CDropdownItem>
        <CDropdownItem className="cursor" onClick={() => navigate("/settings")}>
          <CIcon icon={cilSettings} className="me-2" />
          {t("Settings")}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem className="cursor" onClick={logout}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {t("Logout")}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
