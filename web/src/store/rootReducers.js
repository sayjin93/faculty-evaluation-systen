import authentication from "./reducers/authenticationSlice";
import sidebar from "./reducers/sidebarSlice";
import modal from "./reducers/modalSlice";
import toast from "./reducers/toastSlice";

//Include all the reducer to combine and provide to configure store.
const rootReducer = {
  authentication,
  sidebar,
  modal,
  toast,
};

export default rootReducer;
