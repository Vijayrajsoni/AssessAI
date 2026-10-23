import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import "./Auth.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await API.post(`/auth/reset-password/${token}`, {
        password,
      });

      setMessage(
        response.data.message || "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset Password Error:", error);

      setError(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-hero">
          <div className="auth-badge">
            ✨ AI-Powered Assessment
          </div>

          <h1>
            Secure your
            <br />
            <span>AssessAI account.</span>
          </h1>

          <p>
            Create a new secure password and continue using
            AssessAI.
          </p>

          <div className="auth-points">
            <div>✓ Secure Password Reset</div>
            <div>✓ Protected Account</div>
            <div>✓ AI Project Assessment</div>
          </div>
        </div>

        <div className="auth-footer">
          © 2026 AssessAI. Smart Assessment Platform.
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">

          <div className="mobile-logo">
            <img
              src="/assessai-favicon.png"
              alt="AssessAI"
            />
          </div>

          <div className="auth-heading">
            <h2>Reset Password 🔐</h2>
            <p>Create your new password</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {message && (
            <div className="success-message">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="auth-form-group">
              <label>New Password</label>

              <div className="auth-input">
                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter new password"
                  required
                />

                <button
                  type="button"
                  className="password-btn"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label>Confirm Password</label>

              <div className="auth-input">
                <span>🔒</span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  required
                />

                <button
                  type="button"
                  className="password-btn"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}

              <span>→</span>
            </button>
          </form>

          <div className="auth-switch">
            Remember your password?

            <Link to="/login">
              Sign In
            </Link>
          </div>

          <div className="auth-security">
            🔐 Your information is securely protected
          </div>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;