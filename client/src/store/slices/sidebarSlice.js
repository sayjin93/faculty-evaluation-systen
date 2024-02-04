import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    show: true,
    unfoldable: false,
  },
  reducers: {
    changeSidebarState: (state, action) => {
      state.show = action.payload;
    },
  },
});

export const { changeSidebarState } = sidebarSlice.actions;
export const sidebarReducer = sidebarSlice.reducer;
