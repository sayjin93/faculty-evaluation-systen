import React, { createContext, useContext, useReducer } from "react";

/**Store */
const initialState = { auth: false };

const AuthContext = createContext(initialState);

export function reducer(state, action) {
  switch (action.type) {
    case "login":
      return { auth: true };
    case "logout":
      return { auth: false };
      fefault: throw new Error();
  }
}

/**Auth Provider */
export function AuthProvider({ children }) {
  const [authed, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={[authed, dispatch]}>
      {children}
    </AuthContext.Provider>
  );
}

/**Own Auth Consumer Hook */
export default function AuthConsumer() {
  return useContext(AuthContext);
}
