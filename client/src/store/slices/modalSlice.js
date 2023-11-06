import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    isOpen: false,
    id: null,
  },
  reducers: {
    setModal: (state, action) => {
      if (action.payload) {
        state.isOpen = true;
        state.id = action.payload;
      } else {
        state.isOpen = false;
        state.id = null;
      }
    },
  },
});

export const { setModal } = modalSlice.actions;
export const modalReducer = modalSlice.reducer;
