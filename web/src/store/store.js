import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducers";

export default function configureAppStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  return store;
}
