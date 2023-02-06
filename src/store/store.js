import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/Sidebar.js";

const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
  },
});

export default store;
