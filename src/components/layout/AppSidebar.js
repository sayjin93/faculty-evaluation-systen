import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logoNegative } from "../../assets/images/logo-negative";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

// sidebar nav config
import navigation from "./_nav";

import { changeState } from "../../store/slices/Sidebar";

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
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar style={{ height: "100%" }}>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
