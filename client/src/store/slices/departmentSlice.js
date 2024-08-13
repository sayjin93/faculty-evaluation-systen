import { createSlice } from "@reduxjs/toolkit";

const departmentsSlice = createSlice({
  name: "departments",
  initialState: {
    list: [],
    selected: { id: 0, key: "All", faculty_id: 0 },
  },
  reducers: {
    setDepartments: (state, action) => {
      state.list = action.payload;
    },
    setSelectedDepartment: (state, action) => {
      state.selected = action.payload;
    },
  },
});

export const { setDepartments, setSelectedDepartment } = departmentsSlice.actions;
export const departmentsReducer = departmentsSlice.reducer;
