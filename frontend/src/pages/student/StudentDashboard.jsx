import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import API from "../../services/api";

import "./StudentBoard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState({
    stats: {
      totalProjects: 0,
      completedAssessments: 0,
      averageScore: 0,
    },
    latestProject: null,
    recentAssessments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setDashboard({
          stats: response.data.stats || {
            totalProjects: 0,
            completedAssessments: 0,
            averageScore: 0,
          },

          latestProject: response.data.latestProject || null,

          recentAssessments:
            response.data.recentAssessments || [],
        });
      }
    } catch (err) {
      console.error("Dashboard Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  const getUserName = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      return user?.name || "Student";
    } catch {
      return "Student";
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    if (score >= 40) return "average";

    return "low";
  };

  const getStatusClass = (status) => {
    if (!status) return "pending";

    return status.toLowerCase();
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-main">
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">

        {/* HEADER */}
        <section className="dashboard-header">
          <div>
            <p className="dashboard-small-title">
              Student Dashboard
            </p>

            <h1>
              Welcome back, {getUserName()} 👋
            </h1>

            <p>
              Track your projects, assessments and AI
              evaluation results from one place.
            </p>
          </div>

          <button
            className="primary-btn"
            onClick={() => navigate("/upload-project")}
          >
            + Upload Project
          </button>
        </section>

        {/* ERROR */}
        {error && (
          <div className="dashboard-error">
            <span>{error}</span>

            <button onClick={fetchDashboard}>
              Retry
            </button>
          </div>
        )}

        {/* STATS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon project-icon">
              📁
            </div>

            <div>
              <p>Total Projects</p>

              <h2>
                {dashboard.stats.totalProjects}
              </h2>

              <span>
                Projects uploaded
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon assessment-icon">
              📊
            </div>

            <div>
              <p>Assessments</p>

              <h2>
                {dashboard.stats.completedAssessments}
              </h2>

              <span>
                Completed assessments
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon score-icon">
              ⭐
            </div>

            <div>
              <p>Average Score</p>

              <h2>
                {dashboard.stats.averageScore}%
              </h2>

              <span>
                Overall performance
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon ai-icon">
              🤖
            </div>

            <div>
              <p>AI Evaluation</p>

              <h2>Active</h2>

              <span>
                Automated assessment
              </span>
            </div>
          </div>

        </section>

        {/* MAIN GRID */}
        <section className="dashboard-content">

          {/* LATEST PROJECT */}
          <div className="dashboard-card latest-project-card">

            <div className="card-header">
              <div>
                <h2>Latest Project</h2>
                <p>Your most recently uploaded project</p>
              </div>

              <button
                className="text-btn"
                onClick={() =>
                  navigate("/my-projects")
                }
              >
                View All
              </button>
            </div>

            {dashboard.latestProject ? (
              <div className="latest-project">

                <div className="project-info">

                  <div className="project-file-icon">
                    📄
                  </div>

                  <div>
                    <h3>
                      {
                        dashboard.latestProject
                          .title ||
                        dashboard.latestProject
                          .projectTitle ||
                        "Untitled Project"
                      }
                    </h3>

                    <p>
                      Uploaded{" "}
                      {formatDate(
                        dashboard.latestProject
                          .createdAt
                      )}
                    </p>
                  </div>

                </div>

                <div className="project-actions">

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      navigate("/my-projects")
                    }
                  >
                    View Project
                  </button>

                  <button
                    className="primary-small-btn"
                    onClick={() =>
                      navigate("/my-projects")
                    }
                  >
                    Assess
                  </button>

                </div>

              </div>
            ) : (
              <div className="empty-project">

                <div className="empty-icon">
                  📂
                </div>

                <h3>No projects yet</h3>

                <p>
                  Upload your first project to start
                  an AI assessment.
                </p>

                <button
                  className="primary-btn"
                  onClick={() =>
                    navigate("/upload-project")
                  }
                >
                  Upload Your First Project
                </button>

              </div>
            )}

          </div>

          {/* QUICK ACTIONS */}
          <div className="dashboard-card quick-card">

            <div className="card-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Manage your AssessAI workspace</p>
              </div>
            </div>

            <div className="quick-actions">

              <button
                onClick={() =>
                  navigate("/upload-project")
                }
              >
                <span>📤</span>
                <div>
                  <strong>Upload Project</strong>
                  <small>
                    Submit a new project
                  </small>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/my-projects")
                }
              >
                <span>📁</span>
                <div>
                  <strong>My Projects</strong>
                  <small>
                    View uploaded projects
                  </small>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/assessments")
                }
              >
                <span>📊</span>
                <div>
                  <strong>Assessments</strong>
                  <small>
                    View AI assessments
                  </small>
                </div>
              </button>

              <button
                onClick={() =>
                  navigate("/profile")
                }
              >
                <span>👤</span>
                <div>
                  <strong>My Profile</strong>
                  <small>
                    Manage profile information
                  </small>
                </div>
              </button>

            </div>

          </div>

        </section>

        {/* RECENT ASSESSMENTS */}
        <section className="dashboard-card recent-card">

          <div className="card-header">
            <div>
              <h2>Recent Assessments</h2>
              <p>
                Latest AI evaluation results
              </p>
            </div>

            <button
              className="text-btn"
              onClick={() =>
                navigate("/assessments")
              }
            >
              View All
            </button>
          </div>

          {dashboard.recentAssessments.length > 0 ? (
            <div className="assessment-list">

              {dashboard.recentAssessments.map(
                (assessment) => {

                  const score = Number(
                    assessment.overallScore
                  );

                  const projectTitle =
                    assessment.project?.title ||
                    assessment.project?.projectTitle ||
                    assessment.projectTitle ||
                    "Project Assessment";

                  return (
                    <div
                      className="assessment-row"
                      key={assessment._id}
                    >

                      <div className="assessment-project">

                        <div className="assessment-icon-box">
                          📊
                        </div>

                        <div>
                          <h3>
                            {projectTitle}
                          </h3>

                          <p>
                            {formatDate(
                              assessment.createdAt
                            )}
                          </p>
                        </div>

                      </div>

                      <div className="assessment-status">

                        <span
                          className={`status-badge ${getStatusClass(
                            assessment.status
                          )}`}
                        >
                          {assessment.status ||
                            "Pending"}
                        </span>

                      </div>

                      <div className="assessment-score">

                        {assessment.overallScore !==
                        null &&
                        !isNaN(score) ? (
                          <>
                            <div
                              className={`score-circle ${getScoreClass(
                                score
                              )}`}
                            >
                              {score}%
                            </div>
                          </>
                        ) : (
                          <span className="no-score">
                            Not scored
                          </span>
                        )}

                      </div>

                      <button
                        className="view-assessment-btn"
                        onClick={() =>
                          navigate(
                            `/assessment/${assessment._id}`
                          )
                        }
                      >
                        View →
                      </button>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="empty-assessments">

              <div className="empty-icon">
                📊
              </div>

              <h3>
                No assessments yet
              </h3>

              <p>
                Once you submit a project for AI
                evaluation, your results will appear
                here.
              </p>

              <button
                className="secondary-btn"
                onClick={() =>
                  navigate("/upload-project")
                }
              >
                Start Assessment
              </button>

            </div>
          )}

        </section>

        {/* PERFORMANCE */}
        <section className="dashboard-card performance-card">

          <div className="card-header">
            <div>
              <h2>Performance Overview</h2>
              <p>
                Your average AI assessment score
              </p>
            </div>
          </div>

          <div className="performance-content">

            <div className="performance-score">
              <strong>
                {dashboard.stats.averageScore}%
              </strong>

              <span>
                Average Score
              </span>
            </div>

            <div className="performance-progress-wrapper">

              <div className="performance-label">
                <span>Overall Performance</span>

                <strong>
                  {dashboard.stats.averageScore}%
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${Math.min(
                      dashboard.stats.averageScore,
                      100
                    )}%`,
                  }}
                ></div>
              </div>

              <div className="performance-scale">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>

            </div>

          </div>

        </section>

      </main>
    </div>
  );
};

export default StudentDashboard;
