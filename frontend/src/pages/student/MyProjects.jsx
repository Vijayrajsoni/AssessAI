import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import API from "../../services/api";
import "./MyProject.css";
import axios from "axios";
const MyProjects = () => {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assessingId, setAssessingId] = useState(null);

  // ==========================================
  // FETCH PROJECTS FROM BACKEND
  // ==========================================

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await API.get(
        "/projects/my-projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Projects Response:",
        response.data
      );

      if (response.data.success) {
        setProjects(response.data.projects || []);
      }
    } catch (error) {
      console.error(
        "Fetch Projects Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      alert(
        error.response?.data?.message ||
          "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROJECTS WHEN PAGE OPENS
  // ==========================================

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (projectId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this project?"
  );

  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `http://localhost:5000/api/projects/${projectId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.success) {
      alert("Project deleted successfully");

      // Remove deleted project from UI
      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== projectId
        )
      );
    }
  } catch (error) {
    console.error("Delete Project Error:", error);

    alert(
      error.response?.data?.message ||
        "Failed to delete project"
    );
  }
};
  // ==========================================
  // START AI ASSESSMENT
  // ==========================================

  const handleAssessment = async (projectId) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      if (!projectId) {
        alert("Project ID not found");
        return;
      }

      console.log(
        "Starting AI Assessment..."
      );

      console.log(
        "Project ID:",
        projectId
      );

      setAssessingId(projectId);

      const response = await API.post(
        `/assessments/${projectId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Assessment Response:",
        response.data
      );

      if (response.data.success) {
        alert(
          "AI Assessment completed successfully 🎉"
        );

        navigate(
          `/assessment/${response.data.projectId}`
        );
      }

      // Refresh project status
      fetchProjects();
    } catch (error) {
      console.error("Assessment Error:", error);

      const data = error.response?.data;

      if (data?.code === "AI_DAILY_QUOTA_EXCEEDED") {
        alert(
          "⚠️ AI daily limit reached.\n\nPlease try again after quota reset or upgrade your Gemini API plan."
        );
        return;
      }

      if (data?.code === "AI_RATE_LIMITED") {
        alert(
          "⚠️ AI service is temporarily busy.\n\nPlease try again after a short wait."
        );
        return;
      }

      alert(
        data?.message ||
          "AI assessment failed. Please try again."
      );
    } finally {
      setAssessingId(null);
    }
  };

  // ==========================================
  // FILTER + SEARCH
  // ==========================================

  const filteredProjects = projects.filter(
    (project) => {
      const projectTitle =
        project.projectTitle || "";

      const projectAbstract =
        project.abstract || "";

      const matchesFilter =
        filter === "All" ||
        project.status === filter;

      const matchesSearch =
        projectTitle
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        projectAbstract
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      return (
        matchesFilter &&
        matchesSearch
      );
    }
  );

  // ==========================================
  // STATISTICS
  // ==========================================

  const totalProjects =
    projects.length;

  const completedProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Completed"
    ).length;

  const processingProjects =
    projects.filter(
      (project) =>
        project.status ===
        "Processing"
    ).length;

  const draftProjects =
    projects.filter(
      (project) =>
        project.status === "Draft"
    ).length;

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {
    return (
      <div className="projects-page">
        <Sidebar />

        <main className="projects-main">
          <div className="projects-loading">
            <div className="loading-spinner">
              ⟳
            </div>

            <p>
              Loading your projects...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <div className="projects-page">

      <Sidebar />

      <main className="projects-main">

        {/* ================= HEADER ================= */}

        <header className="projects-header">

          <div>
            <span className="projects-label">
              PROJECTS
            </span>

            <h1>
              My Projects
            </h1>

            <p className="projects-subtitle">
              View and manage all your
              submitted projects and AI
              assessments.
            </p>
          </div>

          <Link
            to="/upload-project"
            className="new-project-btn"
          >
            <span>＋</span>
            Upload New Project
          </Link>

        </header>

        {/* ================= STATS ================= */}

        <section className="project-stats">

          <div className="project-stat-card">

            <div className="project-stat-icon purple">
              ▣
            </div>

            <div>
              <span>
                Total Projects
              </span>

              <h2>
                {totalProjects}
              </h2>

              <small>
                All submissions
              </small>
            </div>

          </div>

          <div className="project-stat-card">

            <div className="project-stat-icon green">
              ✓
            </div>

            <div>
              <span>
                Completed
              </span>

              <h2>
                {completedProjects}
              </h2>

              <small>
                AI assessments done
              </small>
            </div>

          </div>

          <div className="project-stat-card">

            <div className="project-stat-icon orange">
              ◷
            </div>

            <div>
              <span>
                Processing
              </span>

              <h2>
                {processingProjects}
              </h2>

              <small>
                Under assessment
              </small>
            </div>

          </div>

          <div className="project-stat-card">

            <div className="project-stat-icon blue">
              ◌
            </div>

            <div>
              <span>
                Drafts
              </span>

              <h2>
                {draftProjects}
              </h2>

              <small>
                Not submitted
              </small>
            </div>

          </div>

        </section>

        {/* ================= TOOLBAR ================= */}

        <section className="projects-toolbar">

          <div className="filter-buttons">

            {[
              "All",
              "Completed",
              "Processing",
              "Uploaded",
              "Draft",
            ].map((item) => (
              <button
                key={item}
                className={`filter-btn ${
                  filter === item
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setFilter(item)
                }
              >
                {item}
              </button>
            ))}

          </div>

          <div className="project-search">

            <span>⌕</span>

            <input
            className="se"
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

        </section>


        {/* ================= PROJECT GRID ================= */}

        <section className="projects-grid">

          {filteredProjects.length > 0 ? (

            filteredProjects.map(
              (project) => (

                <article
                  className="project-card"
                  key={project._id}
                >

                  {/* CARD TOP */}

                  <div className="project-card-top">

                    <div className="project-main-icon">

                      {(project.projectTitle ||
                        "Project")
                        .split(" ")
                        .slice(0, 2)
                        .map(
                          (word) =>
                            word[0]
                        )
                        .join("")
                        .toUpperCase()}

                    </div>

                    <span
                      className={`project-status ${
                        (
                          project.status ||
                          "Uploaded"
                        ).toLowerCase()
                      }`}
                    >

                      {project.status ===
                        "Completed" &&
                        "✓ "}

                      {project.status ===
                        "Processing" &&
                        "◷ "}

                      {project.status ===
                        "Uploaded" &&
                        "↑ "}

                      {project.status ===
                        "Draft" &&
                        "○ "}

                      {project.status}

                    </span>

                  </div>

                  {/* CARD CONTENT */}

                  <div className="project-card-content">

                    <h2>
                      {project.projectTitle}
                    </h2>


                    <div className="technology-list">

                      <span>
                        MERN
                      </span>

                      <span>
                        AI
                      </span>

                      <span>
                        AssessAI
                      </span>

                    </div>

                  </div>

                  {/* CARD BOTTOM */}

                  <div className="project-card-bottom">

                    <div className="project-date">

                      <span>◷</span>

                      <div>

                        <small>
                          Submitted
                        </small>

                        <strong>
                          {project.createdAt
                            ? new Date(
                                project.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                            : "Recently"}
                        </strong>

                      </div>

                    </div>

                    <div
                      className={`project-score ${
                        project.score ===
                        null
                          ? "waiting"
                          : ""
                      }`}
                    >

                      {project.score !==
                      null &&
                      project.score !==
                        undefined ? (

                        <>
                          <strong>
                            {project.score}
                          </strong>

                          <span>
                            /100
                          </span>
                        </>

                      ) : (

                        <span>
                          {project.status ===
                          "Processing"
                            ? "Pending"
                            : project.status ===
                              "Uploaded"
                            ? "Not assessed"
                            : "Not submitted"}
                        </span>

                      )}

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="project-actions">

                    {/* UPLOADED */}

                    {project.status ===
                      "Uploaded" && (

                      <button
                        type="button"
                        className="ai-assessment-btn"
                        onClick={() =>
                          handleAssessment(
                            project._id
                          )
                        }
                        disabled={
                          assessingId ===
                          project._id
                        }
                      >

                        {assessingId ===
                        project._id
                          ? "⏳ Assessing..."
                          : "🤖 Start AI Assessment"}

                      </button>

                    )}

                    {/* PROCESSING */}

                    {project.status ===
                      "Processing" && (

                      <button
                        type="button"
                        className="processing-btn"
                        disabled
                      >
                        ⏳ AI Assessment in Progress
                      </button>

                    )}

                    {/* COMPLETED */}

                    {project.status ===
                      "Completed" && (

                      <>

                        <button
                          type="button"
                          className="view-project-btn"
                          onClick={() =>
                            navigate(
                              `/assessment/${project._id}`
                            )
                          }
                        >
                          View Project
                        </button>

                        <button
                          type="button"
                          className="view-report-btn"
                          onClick={() =>
                            navigate(
                              `/assessment/${project._id}`
                            )
                          }
                        >
                          View Report →
                        </button>
                        <button
  className="delete-btn"
  onClick={() => handleDelete(project._id)}
>
  🗑️ Delete
</button>

                      </>

                    )}

                    {/* DRAFT */}

                    {project.status ===
                      "Draft" && (

                      <Link
                        to="/upload-project"
                        className="continue-btn"
                      >
                        Continue Upload →
                      </Link>

                    )}

                    {/* FAILED */}

                    {project.status ===
                      "Failed" && (

                      <button
                        type="button"
                        className="ai-assessment-btn"
                        onClick={() =>
                          handleAssessment(
                            project._id
                          )
                        }
                      >
                        🔄 Try Assessment Again
                      </button>

                    )}

                  </div>

                </article>

              )
            )

          ) : (

            <div className="empty-projects">

              <div className="empty-icon">
                📁
              </div>

              <h2>
                No Projects Found
              </h2>

              <p>
                {projects.length === 0
                  ? "Upload your first project to start an AI assessment."
                  : "Try changing your search or filter."}
              </p>

              {projects.length === 0 && (
                <button
                  type="button"
                  className="new-project-btn"
                  onClick={() =>
                    navigate(
                      "/upload-project"
                    )
                  }
                >
                  ＋ Upload Project
                </button>
              )}

            </div>

          )}

        </section>

        {/* ================= AI TIP ================= */}

        <section className="projects-ai-tip">

          <div className="ai-tip-icon">
            ✦
          </div>

          <div className="ai-tip-content">

            <span>
              AI TIP
            </span>

            <h3>
              Improve your project
              assessment score
            </h3>

            <p>
              AssessAI evaluates
              documentation quality,
              project completeness,
              code structure,
              innovation, technology
              stack and missing modules.
            </p>

          </div>

          <Link
            to="/upload-project"
            className="tip-action"
          >
            Assess New Project →
          </Link>

        </section>

        {/* ================= FOOTER ================= */}

        <footer className="projects-footer">

          <span>
            © 2026 AssessAI
          </span>

          <span>
            AI-Powered Student Project Assessment
          </span>

        </footer>

      </main>

    </div>
  );
};

export default MyProjects;