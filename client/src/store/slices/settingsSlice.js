import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
    firstLogin: true,
    languages: ["en"],
    faculty: null,
    department: null,
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
    setFaculty: (state, action) => {
      state.faculty = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
  },
});

export const { changeAcademicYear, setFirstLogin, setLanguages, setFaculty, setDepartment } =
  settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
