import { createSelector } from "reselect";

const selectModal = (state) => state.modal;
const selectProfessors = (state) => state.professors;
const selectSettings = (state) => state.settings;
const selectUser = (state) => state.user;
const selectFaculties = (state) => state.faculties;
const selectDepartments = (state) => state.departments;

//modal
export const getModal = createSelector([selectModal], (modal) => modal);

//professors
export const getProfessors = createSelector(
  [selectProfessors],
  (professors) => professors.list
);
export const getSelectedProfessor = createSelector(
  [selectProfessors],
  (professors) => professors.selected
);

//setings
export const getAcademicYear = createSelector(
  [selectSettings],
  (settings) => settings.academicYear
);
export const getAcademicYearId = createSelector(
  [selectSettings],
  (settings) => settings.academicYear.id
);
export const isFirstLogin = createSelector(
  [selectSettings],
  (settings) => settings.firstLogin
);
export const getLanguages = createSelector(
  [selectSettings],
  (settings) => settings.languages
);
export const getDepartment = createSelector(
  [selectSettings],
  (settings) => settings.department
);

//user
export const getLoggedUser = createSelector(
  [selectUser],
  (user) => user.loggedUser
);

export const getIsAdmin = createSelector(
  [selectUser],
  (user) => user.loggedUser.is_admin
);

//faculties
export const getFaculties = createSelector(
  [selectFaculties],
  (faculties) => faculties.list
);
export const getSelectedFaculty = createSelector(
  [selectFaculties],
  (faculties) => faculties.selected
);

//faculties
export const getDepartments = createSelector(
  [selectDepartments],
  (departments) => departments.list
);
export const getSelectedDepartment = createSelector(
  [selectDepartments],
  (departments) => departments.selected
);