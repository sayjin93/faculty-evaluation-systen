import React from "react";
import { Link } from "react-router-dom";

//redux
import { useSelector, useDispatch } from "react-redux";
import { changeState } from "../../store/reducers/sidebarSlice";

import { CImage, CSidebar, CSidebarBrand, CSidebarNav } from "@coreui/react";

import { AppSidebarNav } from "./AppSidebarNav";

import logo from "../../assets/images/logo.svg";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.sidebar.show);

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
          <CImage src={logo} height={36} />
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
