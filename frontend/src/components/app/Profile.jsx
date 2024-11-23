import { useAuthContext } from "../../context/AuthContext";
export function Profile() {
  const { user } = useAuthContext();
  if (!user) 
    return (
      <div>Login</div>
    );
  if (user) {
    return (
      <div>Profile</div>
    );
  }
}