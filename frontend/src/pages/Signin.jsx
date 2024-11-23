import { Input, Box, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Alert } from "../components/ui/alert";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
export function Signin() {
  async function handleSignin(e) {
    e.preventDefault();
    try {
      if (!email || !password) {
        <Alert
          status="error"
          title="All fields are required"
        />;
        return;
      } 

      let resResult = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/signin`, {
        method: "post",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(resResult);
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  return (
    <Box>
      <Text>Sign In</Text>
      <Text>Enter your credentials to access your account</Text>
      <form onSubmit={handleSignin}>
        <Box>
          <div>
            <label>Email</label>
            <Input placeholder="johndoe@example.com" value={email} onChange={(e) => {setEmail(e.target.value);}} />
          </div>
          <div>
            <label>Password</label>
            <Input value={password} onChange={(e) => {setPassword(e.target.value);} } />
          </div>
        </Box>
        <Button type="submit">Sign In </Button>
        <Text>Don&apos;t have an account? <Link>Sign up</Link></Text>
      </form>
    </Box>
  );
}