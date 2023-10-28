import { createSelector } from 'reselect';

const selectSettings = (state) => state.settings;
const selectUser = (state) => state.user;
const selectModal = (state) => state.modal;
const selectProfessors = (state) => state.professors;

export const getAcademicYear = createSelector(
  [selectSettings],
  (settings) => settings.academicYear
);

export const getActiveAcademicYear = createSelector(
  [selectSettings],
  (settings) => settings.academicYear.year
);

export const getAcademicYearId = createSelector(
  [selectSettings],
  (settings) => settings.academicYear.id
);

export const getLoggedUser = createSelector(
  [selectUser],
  (user) => user.loggedUser
);

export const isFirstLogin = createSelector(
  [selectSettings],
  (settings) => settings.firstLogin
);

export const getModal = createSelector(
  [selectModal],
  (modal) => modal.modal
);

export const getProfessors = createSelector(
  [selectProfessors],
  (professors) => professors.list
);

export const getSelectedProfessor = createSelector(
  [selectProfessors],
  (professors) => professors.selected
);
