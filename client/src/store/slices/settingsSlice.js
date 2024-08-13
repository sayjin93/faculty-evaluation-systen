import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
    firstLogin: true,
    languages: ["en"],
  },
  reducers: {
    changeAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
    setFirstLogin: (state, action) => {
      state.firstLogin = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
  },
});

export const { changeAcademicYear, setFirstLogin, setLanguages } =
  settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
