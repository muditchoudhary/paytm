import { Navigate } from "react-router";

import { useAuthContext } from "../../context/AuthContext";

export function AuthGuard({ children }) {
  const { user } = useAuthContext();

  if (user === null)
    return (
      <div className="">
       Loading...
      </div>
    );

  if (user) {
    return <Navigate to="/" replace />;
  } else {
    return <>{children}</>;
  }
}
