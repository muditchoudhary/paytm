import { createContext, useReducer, useEffect, useContext } from "react";

export const AuthContext = createContext();

export function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    case "NOT_FOUND": {
      return { user: action.payload };
    }
    default:
      return state;
  }
}

export function AuthContextProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user === null) {
      dispatch({ type: "NOT_FOUND", payload: false });
    }
    if (user) {
      dispatch({ type: "LOGIN", payload: user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
} 

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }

  return context;
}