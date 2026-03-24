import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../userContext";
import "../style/SignUp.css";

interface MyJwtPayload {
  firstName: string;
  lastName: string;
  _id: string;
  exp: number;
  roles?: string[];
  email?: string;
  drivewayIds?: string[];
}

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[password2,setPassword2] = useState("")
  const[message,setMessage] = useState("")
  const[errorMessage,setErrorMessage] = useState("")
  const [loading, setLoading] = useState(false);

  const userContext = useContext(UserContext);

  // const roles = ["renter"]
  const navigate = useNavigate();

  function sendHome() {
    navigate("/Home");
  }

  async function handleGoogleSignup() {
  const google = (window as any).google;
  setLoading(true)
  setErrorMessage("");
  setMessage("");

  const client = google.accounts.oauth2.initTokenClient({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    scope: "email profile",
    callback: async (response: any) => {
      try {
        const accessToken = response.access_token;
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`,
          { accessToken }
        );

        const token = res.data.token;
        localStorage.setItem("authToken", token);

        // Decode token
        const decoded = jwtDecode<MyJwtPayload>(token);
        const now = Date.now() / 1000;

        if (decoded.exp && decoded.exp > now) {
          // Update user context
          userContext?.setUser({
            _id: decoded._id,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            roles: decoded.roles,
            drivewayIds: decoded.drivewayIds
          });

          setMessage("Signup successful! Redirecting...");
          setTimeout(() => {
            sendHome();
          }, 2000);
        } else {
          localStorage.removeItem("authToken");
          userContext?.setUser(null);
          setErrorMessage("Login token expired. Please try again.");
        }
      } catch (err: any) {
        const data = err.response?.data;
        const errorMsg = 
          typeof data === "string"
            ? data
            : data?.message || data?.error || "Google signup failed. Please try again.";
        setErrorMessage(errorMsg);
        console.error("Google signup error:", err);
      } finally {
        setLoading(false);
      }
    }
  });

  client.requestAccessToken();
}


  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setErrorMessage("All fields are required.");
      setLoading(false);
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password !== password2) {
      setErrorMessage("Passwords don't match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/addUser`,
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      const apiResponse = response.data
      if(!apiResponse.success){
        setErrorMessage(apiResponse.error || "Signup failed.")
        return
      }
      setMessage("Account created successfully!");

      
      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPassword2("");
      
      setTimeout(() => {
        sendHome();
      }, 2000);
    } catch (error: any) {
      const data = error.response?.data; // the full error response object
      const errorMsg = 
        typeof data === "string"
          ? data
          : data?.error || 
            data?.message || 
            error.message || 
            "Signup failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-container">
   

      <form className="signup-card" onSubmit={handleSubmit}>
        <h2 className="signup-title">Create Account</h2>
   


        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </div>

        <div className="form-group">
          <label>Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
        </div>

           <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            />
        </div>


        

        <button className="signup-btn" type="submit" disabled={loading}>
  {loading ? (
    <div className="spinner-wrapper">
      <div className="spinner"></div>
      Signing up...
    </div>
  ) : (
    "Sign Up"
  )}
</button>


<div className="divider">
  <span>or</span>
</div>
 <button 
        className="gsi-material-button" 
        type="button" 
        onClick={handleGoogleSignup}
        disabled={loading}
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
          <span className="gsi-material-button-contents">Sign Up with Google</span>
        </div>
      </button>
<p className="agreeing">
  By signing up, you agree to our{" "}
  <Link to="/TermsOfUse" className="termsLink">
    Terms of Use
  </Link>{" "}
  and{" "}
  <Link to="/PrivacyPolicy" className="termsLink">
    Privacy Policy
  </Link>.
</p>

        {/* <div className="back-home">
          <button onClick={sendHome}>Back to Home</button>
        </div> */}
      </form>
     
      {errorMessage && (
        <>
          <div className="overlay"></div>
          <div className="errorMessageBox">
            <div className="errorIcon">✕</div>
            <p>{errorMessage}</p>
          </div>
        </>
      )}

      {message && (
        <>
          <div className="overlay"></div>
          <div className="createdMessage">
            <div className="successIcon">✓</div>
            <p>{message}</p>
          </div>
        </>
      )}
    </div>
  );
}
