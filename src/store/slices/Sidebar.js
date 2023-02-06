import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    show: true,
    unfoldable: false,
  },
  reducers: {
    changeState: (state, action) => {
      state.show = action.payload;
    },
    changeUnfoldable: (state) => {
      state.unfoldable = !state.unfoldable;
    },
  },
});

export const { changeState, changeUnfoldable } = sidebarSlice.actions;

export default sidebarSlice.reducer;
