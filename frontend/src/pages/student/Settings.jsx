import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar.jsx";
import API from "../../services/api";

import "./Settings.css";

function Settings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNotifications: true,
    assessmentNotifications: true,
    reportNotifications: true,
    darkMode: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================
  // LOAD SETTINGS
  // =====================================

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await API.get("/profile/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSettings({
          emailNotifications:
            response.data.settings?.emailNotifications ?? true,

          assessmentNotifications:
            response.data.settings?.assessmentNotifications ?? true,

          reportNotifications:
            response.data.settings?.reportNotifications ?? true,

          darkMode:
            response.data.settings?.darkMode ?? false,
        });
      } catch (err) {
        console.error("Settings Error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load settings"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [navigate]);

  // =====================================
  // TOGGLE
  // =====================================

  const handleToggle = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  // =====================================
  // SAVE SETTINGS
  // =====================================

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const token = localStorage.getItem("token");

      const response = await API.put(
        "/profile/settings",
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(response.data.settings);

      setMessage("Settings saved successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (err) {
      console.error("Save Settings Error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="settings-page">
        <Sidebar />

        <main className="settings-main">
          <div className="settings-loading">
            <div className="settings-spinner"></div>
            <p>Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <Sidebar />

      <main className="settings-main">

        {/* HEADER */}
        <div className="settings-header">
          <div>
            <span className="settings-label">
              PREFERENCES
            </span>

            <h1>Settings</h1>

            <p>
              Manage your AssessAI account preferences.
            </p>
          </div>

          <button
            className="save-settings-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "✓ Save Settings"}
          </button>
        </div>

        {/* SUCCESS */}
        {message && (
          <div className="settings-success">
            ✓ {message}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="settings-error">
            ⚠ {error}
          </div>
        )}

        {/* =================================
            NOTIFICATIONS
        ================================= */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon">
              🔔
            </div>

            <div>
              <h2>Notifications</h2>
              <p>
                Choose which notifications you want to receive.
              </p>
            </div>
          </div>

          <div className="settings-list">

            {/* Email */}
            <div className="setting-item">
              <div className="setting-info">
                <h3>Email Notifications</h3>
                <p>
                  Receive important account updates through email.
                </p>
              </div>

              <button
                className={`toggle ${
                  settings.emailNotifications
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleToggle("emailNotifications")
                }
              >
                <span></span>
              </button>
            </div>

            {/* Assessment */}
            <div className="setting-item">
              <div className="setting-info">
                <h3>AI Assessment Updates</h3>
                <p>
                  Get notified when your project assessment is completed.
                </p>
              </div>

              <button
                className={`toggle ${
                  settings.assessmentNotifications
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleToggle("assessmentNotifications")
                }
              >
                <span></span>
              </button>
            </div>

            {/* Report */}
            <div className="setting-item">
              <div className="setting-info">
                <h3>Report Notifications</h3>
                <p>
                  Receive notifications when your assessment report is ready.
                </p>
              </div>

              <button
                className={`toggle ${
                  settings.reportNotifications
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleToggle("reportNotifications")
                }
              >
                <span></span>
              </button>
            </div>

          </div>
        </section>

        {/* =================================
            APPEARANCE
        ================================= */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon">
              🎨
            </div>

            <div>
              <h2>Appearance</h2>
              <p>
                Customize how AssessAI looks for you.
              </p>
            </div>
          </div>

          <div className="setting-item">

            <div className="setting-info">
              <h3>Dark Mode</h3>
              <p>
                Use a darker appearance across the application.
              </p>
            </div>

            <button
              className={`toggle ${
                settings.darkMode ? "active" : ""
              }`}
              onClick={() =>
                handleToggle("darkMode")
              }
            >
              <span></span>
            </button>

          </div>

        </section>

        {/* =================================
            SECURITY
        ================================= */}

        <section className="settings-card">

          <div className="settings-card-header">
            <div className="settings-card-icon">
              🔒
            </div>

            <div>
              <h2>Security</h2>
              <p>
                Manage your account security.
              </p>
            </div>
          </div>

          <div className="security-item">

            <div>
              <h3>Account Password</h3>
              <p>
                Keep your password secure and never share it with anyone.
              </p>
            </div>

            <button
              className="secondary-settings-btn"
              onClick={() =>
                alert(
                  "Password change feature can be added here."
                )
              }
            >
              Change Password
            </button>

          </div>

        </section>

        {/* =================================
            LOGOUT
        ================================= */}

        <section className="settings-card danger-card">

          <div className="settings-card-header">
            <div className="settings-card-icon danger-icon">
              🚪
            </div>

            <div>
              <h2>Logout</h2>
              <p>
                Sign out from your AssessAI account.
              </p>
            </div>
          </div>

          <button
            className="logout-settings-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </section>

        <footer className="settings-footer">
          © 2026 AssessAI · AI Powered Project Assessment
        </footer>

      </main>
    </div>
  );
}

export default Settings;