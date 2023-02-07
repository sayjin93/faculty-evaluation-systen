import authentication from "./reducers/authenticationSlice";
import sidebar from "./reducers/sidebarSlice";

//Include all the reducer to combine and provide to configure store.
const rootReducer = {
  authentication,
  sidebar,
};

export default rootReducer;
