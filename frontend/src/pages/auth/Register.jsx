import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import API from "../../services/api";

function Register() {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  phone: "",
  course: "",
  semester: "",
  college: "",
  rollNo: "",
  department: "",
});
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value,
  });
};

{error && (
  <div className="auth-error">
    {error}
  </div>
)}

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await API.post("/auth/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      college: formData.college,
      department: formData.department,
      course: formData.course,
      semester: formData.semester,
      rollNo: formData.rollNo,
      phone: formData.phone,
    });

    console.log("Registration Response:", response.data);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      alert("Registration successful 🎉");

      navigate("/login");
    }
  } catch (error) {
    console.error("Registration Error:", error);

    alert(
      error.response?.data?.message ||
        "Registration failed"
    );
  }
  
};

  return (
    <div className="auth-page">

      {/* Left Section */}
      <div className="auth-left">

        
        <div className="auth-hero">

          <div className="auth-badge">
            🚀 Start Your Assessment Journey
          </div>

          <h1>
            Build.
            <br />
            <span>Assess. Improve.</span>
          </h1>

          <p>
            Create your AssessAI account and get intelligent
            feedback on your academic projects.
          </p>

          <div className="auth-points">
            <div>✓ Upload Project Reports</div>
            <div>✓ AI-Powered Evaluation</div>
            <div>✓ Detailed Assessment Reports</div>
          </div>

        </div>

        <div className="auth-footer">
          © 2026 AssessAI. Smart Assessment Platform.
        </div>

      </div>

      {/* Right Section */}
      <div className="auth-right">

        <div className="auth-card register-card">

          <div className="mobile-logo">
            <img src="/assessai-favicon.png" alt="AssessAI" />
          </div>

          <div className="auth-heading">
            <h2>Create Account 🚀</h2>
            <p>Join AssessAI and start evaluating your projects</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Name */}
            <div className="auth-form-group">

              <label>Full Name</label>

              <div className="auth-input">
                <span>👤</span>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Email */}
            <div className="auth-form-group">

              <label>Email Address</label>

              <div className="auth-input">
                <span>✉</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
            <div className="auth-form-group">

              <label>Phone number</label>

              <div className="auth-input">

                <span></span>

                <input
                  type="text"
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>

            {/* College */}
            <div className="auth-form-group">

              <label>College / University</label>

              <div className="auth-input">
                <span>🏫</span>

                <input
                  type="text"
                  name="college"
                  placeholder="Enter your college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>
<div className="auth-form-group">

              <label>Roll number</label>

              <div className="auth-input">

                <span>🔒</span>

                <input
                  type="text"
                  name="rollNo"
                  placeholder="Enter your roll number"
                  value={formData.rollNo}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
            {/* Department */}
            <div className="auth-form-group">

              <label>Department</label>

              <div className="auth-input">
                <span>🎓</span>

                <input
                  type="text"
                  name="department"
                  placeholder="e.g. CSE, IT"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

            </div>

            {/* Password */}
            <div className="auth-form-group">

              <label>Course</label>

              <div className="auth-input">

                <span>🎓</span>

                <input
                  type="text"
                  name="course"
                  placeholder="Enter your course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
            <div className="auth-form-group">

              <label>Semester</label>

              <div className="auth-input">

                <span>📚</span>

                <input
                  type="text"
                  name="semester"
                  placeholder="Enter your semester"
                  value={formData.semester}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
            <div className="auth-form-group">

              <label>Password</label>

              <div className="auth-input">

                <span>🔒</span>

                <input
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

              </div>

            </div>
            

            <button
  className="auth-button"
  type="submit"
  disabled={loading}
>
  {loading ? "Creating Account..." : "Create Account"}
  <span>→</span>
</button>


          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          <div className="auth-switch">
            Already have an account?
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

export default Register;