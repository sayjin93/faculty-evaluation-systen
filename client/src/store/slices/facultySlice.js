import { createSlice } from "@reduxjs/toolkit";

const facultiesSlice = createSlice({
  name: "faculties",
  initialState: {
    list: [],
    selected: { id: 0, key: "None" },
  },
  reducers: {
    setFaculties: (state, action) => {
      state.list = action.payload;
    },
    setSelectedFaculty: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setFaculties, setSelectedFaculty } = facultiesSlice.actions;
export const facultiesReducer = facultiesSlice.reducer;
