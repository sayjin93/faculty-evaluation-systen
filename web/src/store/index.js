import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

//slices
import { modalReducer, setModal } from "./slices/modalSlice";
import {
  professorsReducer,
  setProfessors,
  setSelectedProfessor,
} from "./slices/professorsSlice";
import { settingsReducer, changeAcademicYear } from "./slices/settingsSlice";
import { sidebarReducer, changeState } from "./slices/sidebarSlice";
import { toastReducer, showToast, hideToast } from "./slices/toastSlice";

// Combine all your reducers using combineReducers
const rootReducer = combineReducers({
  modal: modalReducer,
  professors: professorsReducer,
  settings: settingsReducer,
  sidebar: sidebarReducer,
  toast: toastReducer,
});

// Configure redux-persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"], // only setings will be persisted
};

// Create the persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
});

// Create the persistor
export const persistor = persistStore(store);

// Export your actions
export {
  store,
  setModal,
  setProfessors,
  setSelectedProfessor,
  changeAcademicYear,
  changeState,
  showToast,
  hideToast,
};
