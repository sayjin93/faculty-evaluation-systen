import { configureStore } from "@reduxjs/toolkit";
import { modalReducer, setModal } from "./slices/modalSlice";
import { settingsReducer, changeAcademicYear } from "./slices/settingsSlice";
import { sidebarReducer, changeState } from "./slices/sidebarSlice";
import { toastReducer, showToast, hideToast } from "./slices/toastSlice";

const store = configureStore({
  reducer: {
    modal: modalReducer,
    settings: settingsReducer,
    sidebar: sidebarReducer,
    toast: toastReducer,
  },
});

export {
  store,
  setModal,
  changeAcademicYear,
  changeState,
  showToast,
  hideToast,
};
