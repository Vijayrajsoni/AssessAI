import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar.jsx";
import API from "../../services/api";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    semester: "",
    college: "",
    rollNo: "",
    department: "",
  });

  // ================================
  // GET PROFILE
  // ================================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again.");
          return;
        }

        const response = await API.get("/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response.data.user;

        setProfile({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          course: user.course || "",
          semester: user.semester || "",
          college: user.college || "",
          rollNo: user.rollNo || "",
          department: user.department || "",
        });
      } catch (err) {
        console.error("Profile Error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load profile"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================================
  // INPUT CHANGE
  // ================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================================
  // SAVE PROFILE
  // ================================
  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.put(
  "/profile",
  {
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    college: profile.college,
    course: profile.course,
    semester: profile.semester,
    rollNo: profile.rollNo,
    department: profile.department,
  },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const user = response.data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        course: user.course || "",
        semester: user.semester || "",
        college: user.college || "",
        rollNo: user.rollNo || "",
        department: user.department || "",
      });

      // Update localStorage user if present
      const oldUser = localStorage.getItem("user");

      if (oldUser) {
        const parsedUser = JSON.parse(oldUser);

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...parsedUser,
            ...user,
          })
        );
      }

      setIsEditing(false);
      setMessage("Profile updated successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Update Profile Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // CANCEL
  // ================================
  const handleCancel = async () => {
    setIsEditing(false);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      const response = await API.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = response.data.user;

      setProfile({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        course: user.course || "",
        semester: user.semester || "",
        college: user.college || "",
        rollNo: user.rollNo || "",
        department: user.department || "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ================================
  // LOADING
  // ================================
  if (loading) {
    return (
      <div className="profile-page">
        <Sidebar />

        <main className="profile-main">
          <div className="profile-loading">
            <div className="profile-spinner"></div>
            <p>Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Sidebar />

      <main className="profile-main">

        {/* Header */}
        <div className="profile-header">
          <div>
            <span className="profile-label">
              ACCOUNT
            </span>

            <h1>My Profile</h1>

            <p>
              Manage your personal information and account details.
            </p>
          </div>

          {!isEditing ? (
            <button
              className="edit-profile-btn"
              onClick={() => {
                setIsEditing(true);
                setMessage("");
                setError("");
              }}
            >
              ✏️ Edit Profile
            </button>
          ) : (
            <div className="profile-header-buttons">
              <button
                className="cancel-profile-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                className="save-profile-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "✓ Save Changes"}
              </button>
            </div>
          )}
        </div>

        {/* Success */}
        {message && (
          <div className="profile-success">
            ✓ {message}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="profile-error">
            ⚠ {error}
          </div>
        )}

        {/* Profile Content */}
        <div className="profile-layout">

          {/* Left Card */}
          <div className="profile-card profile-summary">

            <div className="profile-avatar-large">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <h2>
              {profile.name || "Student"}
            </h2>

            <p className="profile-email">
              {profile.email || "No email"}
            </p>

            <span className="student-badge">
              🎓 Student
            </span>

            <div className="profile-divider"></div>

            <div className="profile-summary-item">
              <span>Course</span>
              <strong>
                {profile.course || "Not added"}
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Semester</span>
              <strong>
                {profile.semester || "Not added"}
              </strong>
            </div>

            <div className="profile-summary-item">
              <span>Roll Number</span>
              <strong>
                {profile.rollNo || "Not added"}
              </strong>
            </div>

          </div>

          {/* Right Card */}
          <div className="profile-card profile-information">

            <div className="profile-card-title">
              <div>
                <h2>Personal Information</h2>

                <p>
                  Your basic account information
                </p>
              </div>

              <span className="secure-badge">
                🔒 Secure
              </span>
            </div>

            <div className="profile-form">

              {/* Name */}
              <div className="profile-input-group">
                <label>Full Name</label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your name"
                />
              </div>

              {/* Email */}
              <div className="profile-input-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div className="profile-input-group">
                <label>Phone Number</label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter phone number"
                />
              </div>

              {/* College */}
              <div className="profile-input-group">
                <label>College / University</label>

                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter college name"
                />
              </div>

              {/* Course */}
              <div className="profile-input-group">
                <label>Course</label>

                <input
                  type="text"
                  name="course"
                  value={profile.course}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter course"
                />
              </div>

              {/* Semester */}
              <div className="profile-input-group">
                <label>Semester</label>

                <input
                  type="text"
                  name="semester"
                  value={profile.semester}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter semester"
                />
              </div>

              {/* Roll Number */}
              <div className="profile-input-group">
                <label>Roll Number</label>

                <input
                  type="text"
                  name="rollNo"
                  value={profile.rollNo}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Enter roll number"
                />
              </div>

              {/* Department */}
              <div className="profile-input-group">
                <label>Department</label>

                <input
                  type="text"
                  name="department"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={true}
                  placeholder="Department"
                />
              </div>

            </div>


          </div>
        </div>

        <footer className="profile-footer">
          © 2026 AssessAI · AI Powered Project Assessment
        </footer>

      </main>
    </div>
  );
}

export default Profile;