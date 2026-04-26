import React, { useEffect, useState } from "react";
import '../style/ForgotPassword.css'
import { tr } from "framer-motion/client";
import { authService } from "../services/authService";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(){
        setLoading(true)
        try{
          const result = await authService.fotgotPassword(email);
          console.log(result)
        }catch(error){

        }finally{
          setLoading(false)
        }
  }



  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password?</h2>
        <p className="forgot-subtitle">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="forgot-input"
          />

          <button type="submit" disabled={loading} className="forgot-button">
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {message && <p className="forgot-success">{message}</p>}
        {error && <p className="forgot-error">{error}</p>}
      </div>
    </div>
  );
}
