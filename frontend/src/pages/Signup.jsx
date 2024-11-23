import { Input, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Alert } from "../components/ui/alert";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function Signup() {
  async function handleSignup(e) {
    e.preventDefault();
    try {
      if (!firstName || !lastName || !userName || !email || !password) {
        <Alert
          status="error"
          title="All fields are required"
        />;
        return;
      }

      let resResult = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signup`, {
        method: "post",
        body: JSON.stringify({ firstName, lastName, userName, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (resResult.status === 201) {
        let resJson = await resResult.json();
        localStorage.setItem("user", JSON.stringify(resJson.token));
        // store token in some context
        dispatch({ type: "LOGIN", payload: resJson.token });
        // redirect user to dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  }

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  return (
    <Box>
      <Text>Sign Up</Text>
      <Text>Enter your information to create an account</Text>
      <form onSubmit={handleSignup}>
        <Box>
          <div>
            <label>First Name</label>
            <Input placeholder="John" value={firstName} onChange={(e) => {setFirstName(e.target.value);}} />
          </div>
          <div>
            <label>Last Name</label>
            <Input placeholder="Doe" value={lastName} onChange={(e) => {setLastName(e.target.value);}} />
          </div>
          <div>
            <label>User Name</label>
            <Input placeholder="johndoe" value={userName} onChange={(e) => {setUserName(e.target.value);}} />
          </div>
          <div>
            <label>Email</label>
            <Input placeholder="johndoe@example.com" value={email} onChange={(e) => {setEmail(e.target.value);}} />
          </div>
          <div>
            <label>Password</label>
            <Input value={password} onChange={(e) => {setPassword(e.target.value);}} />
          </div>
        </Box>
        <Button type="submit">Sign Up</Button>
        <Text>Already have an account? <Link>Sign In</Link></Text>
      </form>
    </Box>
  );
}