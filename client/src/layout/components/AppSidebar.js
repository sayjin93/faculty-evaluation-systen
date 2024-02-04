import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

//coreUI
import { CImage, CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";

//simpleBar
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

//store
import { changeSidebarState } from "src/store";

//components
import { AppSidebarNav } from "./AppSidebarNav";

//images
import logo from "src/assets/images/logo.svg";

const AppSidebar = () => {
  //#region constants
  const dispatch = useDispatch();
  //#endregion

  //#region selectors
  // @ts-ignore
  const show = useSelector((state) => state.sidebar.show);
  //#endregion

  return (
    <CSidebar
      position="fixed"
      unfoldable={false}
      visible={show}
      onVisibleChange={(visible) => {
        dispatch(changeSidebarState(visible));
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
