import React, { useEffect, useState } from "react";
import '../style/ForgotPassword.css'
import { tr } from "framer-motion/client";
import { authService } from "../services/authService";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault();
    setLoading(true)
    setMessage(null);
    setError(null);
    
    try{
      const result = await authService.forgotPassword(email);
      if(result.success || result.data) {
        setMessage("Check your email for the password reset link");
        setEmail("");
      } else {
        setError(result.message || "Failed to send reset link. Please try again.");
      }
    }catch(error: any){
      setError("An error occurred. Please try again.");
    }finally{
      setLoading(false)
    }
  }


  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Forgot Password?</h2>
        <p className="forgot-subtitle">Enter your email to receive a password reset link</p>

        {loading && (
          <div className="forgot-spinner-overlay">
            <div className="forgot-spinner"></div>
            <p className="forgot-spinner-text">Sending reset link...</p>
          </div>
        )}

        {!loading && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
