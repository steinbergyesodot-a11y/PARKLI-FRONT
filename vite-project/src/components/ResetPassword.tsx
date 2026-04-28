import React, { useState } from "react";
import { useParams } from "react-router-dom";
import '../style/ResetPassword.css'
import { authService } from "../services/authService";

export function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authService.resetPassword(
        { password },
        token
      );

      if (!data.success) {
        setError(data.message || "Something went wrong");
      } else {
        setMessage("Password updated successfully. You can now log in.");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Reset Password</h2>
        <p className="reset-subtitle">Enter your new password below</p>

        {loading && (
          <div className="reset-spinner-overlay">
            <div className="reset-spinner"></div>
            <p className="reset-spinner-text">Resetting password...</p>
          </div>
        )}

        {!loading && (
          <>
            <form onSubmit={handleSubmit} className="reset-form">
              <div className="reset-input-group">
                <input
                  type="password"
                  placeholder="New password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className={`reset-input ${password && password.length < 8 ? 'reset-input-invalid' : ''}`}
                  disabled={loading}
                />
                {password && password.length < 8 && (
                  <p className="reset-input-warning">Password must be at least 8 characters</p>
                )}
              </div>

              <input
                type="password"
                placeholder="Confirm password"
                value={confirm}
                required
                onChange={(e) => setConfirm(e.target.value)}
                className="reset-input"
                disabled={loading}
              />

              <button type="submit" className="reset-button" disabled={loading}>
                Reset Password
              </button>
            </form>

            {message && <p className="reset-success">{message}</p>}
            {error && <p className="reset-error">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
