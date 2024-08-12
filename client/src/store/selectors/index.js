import { createSelector } from "reselect";

const selectModal = (state) => state.modal;
const selectProfessors = (state) => state.professors;
const selectSettings = (state) => state.settings;
const selectUser = (state) => state.user;

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
export const getFaculty = createSelector(
  [selectSettings],
  (settings) => settings.faculty
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
