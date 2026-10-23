import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../../services/api";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const location = useLocation();

  const [email, setEmail] = useState(
    location.state?.email || ""
  );

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await API.post(
        "/auth/forgot-password",
        {
          email: normalizedEmail,
        }
      );

      setMessage(
        response.data.message ||
          "Password reset link has been sent to your email."
      );
    } catch (err) {
      console.error("Forgot Password Error:", err);

      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">

      <div className="forgot-card">

        {/* Logo */}
        <div className="forgot-logo">
          <img
            src="/favicon1.png"
            alt="AssessAI"
          />
        </div>

        {/* Heading */}
        <div className="forgot-heading">
          <h1>Forgot Password? 🔐</h1>

          <p>
            Enter your registered email and we'll send
            you a password reset link.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="forgot-error">
            ⚠️ {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="forgot-success">
            ✅ {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="forgot-form-group">

            <label>Email Address</label>

            <div className="forgot-input-wrapper">

              <span className="forgot-input-icon">
                ✉️
              </span>

              <input
                type="email"
                className="forgot-input"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                required
              />

            </div>

          </div>

          <button
            type="submit"
            className="forgot-submit"
            disabled={loading}
          >
            {loading
              ? "Sending Reset Link..."
              : "Send Reset Link"}

            {!loading && <span> →</span>}
          </button>

        </form>

        {/* Back to Login */}
        <div className="forgot-back">
          <Link to="/login">
            ← Back to Login
          </Link>
        </div>

        {/* Security */}
        <div className="forgot-security">
          🔐 Your information is securely protected
        </div>

      </div>

    </div>
  );
};

export default ForgotPassword;