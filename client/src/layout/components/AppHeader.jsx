import React from "react";
import { useSelector, useDispatch } from "react-redux";

//coreUI
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderNav,
  CHeaderToggler,
  CImage,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilMenu } from "@coreui/icons";

//store
import { changeSidebarState } from "src/store";

//components
import AppHeaderDropdown from "./AppHeaderDropdown";

//image
import logo from "src/assets/images/logo.svg";

const AppHeader = () => {
  //#region constants
  const dispatch = useDispatch();
  //#endregion

  //#region selectors
  // @ts-ignore
  const show = useSelector((state) => state.sidebar.show);
  //#endregion

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {/* Sidebar Toggle button */}
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(changeSidebarState(!show))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* Brand logo in center for mobile */}
        <CHeaderBrand className="mx-auto d-md-none" href="/">
          <CImage src={logo} height={36} className="filter-uet" />
        </CHeaderBrand>
        {/* User menu */}
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;
