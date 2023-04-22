import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: null,
  content: null,
  visible: false,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast(state, action) {
      const { type, content } = action.payload;
      state.type = type;
      state.content = content;
      state.visible = true;
    },
    hideToast(state) {
      state.type = null;
      state.content = null;
      state.visible = false;
    },
  },
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;
