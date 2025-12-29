import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import "../style/SignUp.css";

export function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function sendHome() {
    navigate("/Home");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!firstName || !lastName || !email || !password) {
      window.alert("All fields are required.");
      return;
    }

    if (password.length < 8) {
      window.alert("Password must be at least 8 characters long.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/addUser",
        {
          firstName,
          lastName,
          email,
          password,
        }
      );

      window.alert(response.data.Message);
      sendHome();
    } catch (error: any) {
      console.error(error);
      window.alert("Something went wrong. Please try again.");
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

        <button className="signup-btn" type="submit">
          Sign Up
        </button>

        <div className="back-home">
          <button onClick={sendHome}>Back to Home</button>
        </div>
      </form>
    </div>
  );
}
