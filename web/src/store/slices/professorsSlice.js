import { createSlice } from "@reduxjs/toolkit";

const professorsSlice = createSlice({
  name: "professors",
  initialState: {
    list: [],
    selected: 0,
  },
  reducers: {
    setProfessors: (state, action) => {
      state.list = action.payload;
    },
    setSelectedProfessor: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setProfessors, setSelectedProfessor } = professorsSlice.actions;
export const professorsReducer = professorsSlice.reducer;
