import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
    professorId: 0,
    firstLogin: true,
  },
  reducers: {
    changeAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
    changeProfessorSelected: (state, action) => {
      state.professorId = action.payload;
    },
    setFirstLogin: (state, action) => {
      state.firstLogin = action.payload;
    },
  },
});

export const { changeAcademicYear, changeProfessorSelected, setFirstLogin } =
  settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
