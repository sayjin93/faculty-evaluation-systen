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
  },
});

export const { changeState } = sidebarSlice.actions;

export default sidebarSlice.reducer;
