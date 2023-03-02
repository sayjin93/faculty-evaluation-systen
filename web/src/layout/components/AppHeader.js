import React from "react";

//redux
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../store/reducers/sidebarSlice";

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

import AppHeaderDropdown from "./AppHeaderDropdown";
import logoBlue from "../../assets/images/logo_blue.svg";

const AppHeader = () => {
  //#region redux
  const dispatch = useDispatch();
  // @ts-ignore
  const show = useSelector((state) => state.sidebar.show);
  //#endregion

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        {/* Sidebar Toggle button */}
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch(changeState(!show))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        {/* Brand logo in center for mobile */}
        <CHeaderBrand className="mx-auto d-md-none" href="/">
          <CImage src={logoBlue} height={36} />
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
