import { createSlice } from "@reduxjs/toolkit";

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    academicYear: "",
    professorId: 0,
  },
  reducers: {
    changeAcademicYear: (state, action) => {
      state.academicYear = action.payload;
    },
    changeProfessorSelected: (state, action) => {
      state.professorId = action.payload;
    },
  },
});

export const { changeAcademicYear, changeProfessorSelected } =
  settingsSlice.actions;
export const settingsReducer = settingsSlice.reducer;
