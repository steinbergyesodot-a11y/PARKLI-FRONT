import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import '../style/SignUp.css'
import { useSignup } from "../hooks/useSignup";

declare global {
  interface Window {
    turnstile: any;
  }
}

const turnstile = window.turnstile;

export function SignUp() {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    password2,
    setPassword2,
    loading,
    errorMessage,
    message,
    handleSubmit,
  } = useSignup();

  useEffect(() => {
    if (turnstileRef.current) {
      // Render Turnstile widget manually
      turnstile.render(turnstileRef.current, {
        sitekey: "0x4AAAAAADIhzA8BVcOnTq3K",
        callback: function (token: string) {
          console.log("Turnstile token:", token);
        }
      });
    }
  }, []);


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


        <div
  ref={turnstileRef}
  className="cf-turnstile"
  data-sitekey="0x4AAAAAADIhzA8BVcOnTq3K"
></div>


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
