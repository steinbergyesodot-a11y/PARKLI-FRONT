import { use, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../userContext';
import { jwtDecode } from "jwt-decode";
import axios from 'axios'
import '../style/Login.css';

interface MyJwtPayload {
  firstName: string;
  lastName:string
  _id: string;
  exp: number;
  roles?: string[];
  email?: string;
  drivewayIds?: string[];
}

type LoginProps = { from?: string; };


export function Login({ from }: LoginProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState("");


  const userContext = useContext(UserContext);

 


  function handleEmail(event: any) {
    setEmail(event.target.value);
  }

  function handlePassword(event: any) {
    setPassword(event.target.value);
  }

async function handleGoogleLogin() {
  console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const google = window.google;

  const client = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: "email profile",
    callback: async (response: any) => {
      const accessToken = response.access_token;

      // Send token to backend
      const res = await axios.post(
        "http://localhost:4000/api/users/google-login", // note the route name
        { accessToken }
      );

      const token = res.data.token;

      // 1. Save JWT
      localStorage.setItem("authToken", token);

      // 2. Decode JWT
      const decoded = jwtDecode<MyJwtPayload>(token);

      const now = Date.now() / 1000;
      if (!decoded.exp) {
        throw new Error("Invalid token: missing exp");
      }

      if (decoded.exp > now) {
        // 3. Update user context using firstName / lastName
        userContext?.setUser({
          _id: decoded._id,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          roles: decoded.roles,
          drivewayIds: decoded.drivewayIds
        });

        // 4. Redirect
        const redirectTo = from || "/Home";
        navigate(redirectTo, { replace: true });

      } else {
        localStorage.removeItem("authToken");
        userContext?.setUser(null);
      }
    }
  });

  client.requestAccessToken();
}


  function sendHome() {
    navigate('/Home');
  }
async function handleSubmit(event: any) {
  event.preventDefault();
  setErrorMsg("");

  try {
    const response = await axios.post(
      "http://localhost:4000/api/users/login",
      {
        email,
        password
      }
    );

    const token = response.data.token;
    localStorage.setItem("authToken", token);

    const decoded = jwtDecode<MyJwtPayload>(token);
    const now = Date.now() / 1000;

    if (!decoded.exp) {
      throw new Error("Invalid token: missing exp");
    }

    if (decoded.exp > now) {
      userContext?.setUser({
        _id: decoded._id,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        email: decoded.email,
        roles: decoded.roles,
        drivewayIds: decoded.drivewayIds
      });

      sendHome();

    } else {
      localStorage.removeItem("authToken");
      userContext?.setUser(null);
    }

  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Login failed";

    setErrorMsg(message);
  }
}


  return (
  <div className="login-container">
    <form className="login-card" onSubmit={handleSubmit}>
      <h2 className="login-title">Welcome Back</h2>

      <div className="input-group">
        <label>Email</label>
        <input 
          type="email" 
          value={email} 
          onChange={handleEmail} 
          placeholder="Enter your email"
        />
      </div>

      <div className="input-group">
        <label>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={handlePassword} 
          placeholder="Enter your password"
          className={errorMsg ? "shake" : ""}
        />
      </div>

      {errorMsg && <p className="error-msg">{errorMsg}</p>}

      <button className="login-btn" type="submit">Log In</button>

<div className="divider-line"></div>

      {/* Google button INSIDE the card */}
      <button 
        className="gsi-material-button" 
        type="button" 
        onClick={handleGoogleLogin}
      >
        <div className="gsi-material-button-state"></div>
        <div className="gsi-material-button-content-wrapper">
          <div className="gsi-material-button-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
          </div>
          <span className="gsi-material-button-contents">Login with Google</span>
        </div>
      </button>

    </form>
  </div>
);

}
