import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
    firstLogin: true,
  },
  reducers: {
    changeAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
    setFirstLogin: (state, action) => {
      state.firstLogin = action.payload;
    },
  },
});

export const { changeAcademicYear, setFirstLogin } = settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
