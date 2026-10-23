import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      console.log("Login Response:", response.data);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        alert("Login successful 🎉");

        // Login page ko history se replace karke Dashboard open karo
        navigate("/dashboard", { replace: true });
      } else {
        setError(
          response.data.message || "Login failed."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email.trim()) {
      setError("Please enter your email first.");
      return;
    }

    navigate("/forgot-password", {
      state: {
        email: formData.email.trim().toLowerCase(),
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href =
      "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="auth-page">

      {/* Left Section */}
      <div className="auth-left">
        <div className="auth-hero">

          <div className="auth-badge">
            ✨ AI-Powered Assessment
          </div>

          <h1>
            Evaluate smarter.
            <br />
            <span>Achieve better.</span>
          </h1>

          <p>
            AssessAI helps students evaluate their projects using
            intelligent AI-powered assessment and detailed feedback.
          </p>

          <div className="auth-points">
            <div>✓ AI Project Evaluation</div>
            <div>✓ Smart Project Scoring</div>
            <div>✓ Detailed Feedback & Reports</div>
          </div>

        </div>

        <div className="auth-footer">
          © 2026 AssessAI. Smart Assessment Platform.
        </div>
      </div>

      {/* Right Section */}
      <div className="auth-right">
        <div className="auth-card">

          <div className="mobile-logo">
            <img
              src="/assessai-favicon.png"
              alt="AssessAI"
            />
          </div>

          <div className="auth-heading">
            <h2>Welcome Back 👋</h2>
            <p>Sign in to your AssessAI account</p>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="auth-form-group">
              <label>Email Address</label>

              <div className="auth-input">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="auth-form-group">

              <div className="auth-label-row">
                <label>Password</label>

                <button
                  type="button"
                  className="forgot-password-btn"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <div className="auth-input">
                <span>🔒</span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            {/* Remember Me */}
            <div className="remember-row">
              <label>
                <input type="checkbox" />
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
              <span>→</span>
            </button>

          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* Google Login */}
          <div className="social-login">
            <button
              type="button"
              className="social-btn"
              onClick={handleGoogleLogin}
            >
              <span className="social-icon">G</span>
              Continue with Google
            </button>
          </div>

          {/* Register */}
          <div className="auth-switch">
            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>

            <br />

            <Link
              to="/"
              className="home-btn"
            >
              🏠 Go to Home
            </Link>
          </div>

          {/* Security */}
          <div className="auth-security">
            🔐 Your information is securely protected
          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;