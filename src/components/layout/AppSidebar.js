import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarToggler,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";

import { AppSidebarNav } from "./AppSidebarNav";

import { logoNegative } from "../../assets/images/logo-negative";
import { sygnet } from "../../assets/images/sygnet";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

// sidebar nav config
import navigation from "./_nav";

import { changeState, changeUnfoldable } from "../../store/slices/Sidebar";

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebar.unfoldable);
  const show = useSelector((state) => state.sidebar.show);

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={show}
      onVisibleChange={(visible) => {
        dispatch(changeState(visible));
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(changeUnfoldable())}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
