import React from "react";
import { Link } from "react-router-dom";
import { CImage, CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

//redux
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../store";

//components
import { AppSidebarNav } from "./AppSidebarNav";

//images
import logo from "../../assets/images/logo.svg";

const AppSidebar = () => {
  //#region constants
  const dispatch = useDispatch();
  //#endregion

  //#region selectors
  const show = useSelector((state) => state.sidebar.show);
  //#endregion

  return (
    <CSidebar
      position="fixed"
      unfoldable={false}
      visible={show}
      onVisibleChange={(visible) => {
        dispatch(changeState(visible));
      }}
    >
      <CSidebarBrand className="d-none d-md-flex text-center">
        <Link to="/">
          <CImage src={logo} height={54} style={{ filter: "invert(0.9)" }} />
        </Link>
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar style={{ height: "100%" }}>
          <AppSidebarNav />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
