import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
  },
  reducers: {
    changeAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
  },
});

export const { changeAcademicYear } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
