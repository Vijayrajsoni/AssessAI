import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import API from "../../services/api";
import "./AssessmentReport.css";

const AssessmentReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAssessment();
  }, [id]);

  const fetchAssessment = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError("Assessment ID not found");
        setLoading(false);
        return;
      }

      console.log("Fetching assessment for:", id);

      const response = await API.get(`/assessments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Assessment Report Response:", response.data);

      if (response.data.success) {
        setAssessment(response.data.assessment);
      } else {
        setError(
          response.data.message || "Failed to load assessment"
        );
      }
    } catch (err) {
      console.error("Assessment Report Error:", err);
      console.error("Backend Response:", err.response?.data);

      setError(
        err.response?.data?.message ||
          "Failed to load assessment report"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="report-page">
        <Sidebar />

        <main className="report-main">
          <div className="report-loading">
            <div className="loading-spinner"></div>
            <h2>Generating Assessment Report...</h2>
            <p>Please wait while we load your AI assessment.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-page">
        <Sidebar />

        <main className="report-main">
          <div className="report-error">
            <div className="error-icon">⚠️</div>

            <h2>Unable to Load Report</h2>

            <p>{error}</p>

            <button
              className="report-back-btn"
              onClick={() => navigate("/my-projects")}
            >
              ← Back to My Projects
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="report-page">
        <Sidebar />

        <main className="report-main">
          <div className="report-error">
            <div className="error-icon">📄</div>

            <h2>No Assessment Found</h2>

            <button
              className="report-back-btn"
              onClick={() => navigate("/my-projects")}
            >
              ← Back to My Projects
            </button>
          </div>
        </main>
      </div>
    );
  }

  const modules = [
    {
      name: "Documentation Quality",
      value: assessment.documentationQuality ?? 0,
      icon: "📚",
    },
    {
      name: "Project Completeness",
      value: assessment.projectCompleteness ?? 0,
      icon: "✅",
    },
    {
      name: "Code Structure",
      value: assessment.codeStructure ?? 0,
      icon: "💻",
    },
    {
      name: "Innovation",
      value: assessment.innovation ?? 0,
      icon: "💡",
    },
    {
      name: "Technology Stack",
      value: assessment.technologyStack ?? 0,
      icon: "⚙️",
    },
    {
      name: "Missing Modules",
      value: assessment.missingModules ?? 0,
      icon: "🔍",
    },
  ];

  const overallScore = Math.round(
    assessment.overallScore ?? 0
  );

  const getGrade = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };
  const confidenceScore = assessment?.confidenceScore;

  return (
    <div className="report-page">
      <Sidebar />

      <main className="report-main">

        {/* Header */}

        <div className="report-header">
          <div>
            <span className="report-label">
              AI ASSESSMENT
            </span>

            <h1>Assessment Report</h1>

            <p className="report-subtitle">
              AI-powered evaluation of your mini-project
            </p>
          </div>

          <div className="report-header-actions">
  <button
    className="report-back"
    onClick={() => navigate("/my-projects")}
  >
    ← Back
  </button>

  <button
    className="download-report"
    onClick={handleDownload}
  >
    🖨️ Download PDF
  </button>

  <button
    className="improve-btn"
    onClick={() => navigate(`/upload-project?reassess=${id}`)}
  >
    🔄 Improve & Re-Assess
  </button>
</div>
        </div>

        {/* Project Header */}

        <div className="project-report-header">

          <div className="project-report-info">

            <div className="report-project-icon">
              🤖
            </div>

            <div>
              <h2>
                {assessment.projectTitle ||
                  "Student Project"}
              </h2>

              <p>
                Assessment ID:{" "}
                <strong>
                  {assessment.projectId || id}
                </strong>
              </p>

              <span className="completed-report">
                ● Completed
              </span>
            </div>

          </div>

        </div>

        {/* Score Overview */}

        <section className="score-overview">

          <div className="overall-score-card">

            <div
              className="score-ring"
              style={{
                "--score": `${overallScore * 3.6}deg`,
              }}
            >
              <div className="score-ring-inner">
                <strong>{overallScore}</strong>
                <span>/100</span>
              </div>
            </div>

            <div className="overall-score-content">

              <span className="section-label">
                OVERALL SCORE
              </span>

              <h2>
                {overallScore >= 80
                  ? "Excellent Work!"
                  : overallScore >= 60
                  ? "Good Work!"
                  : "Needs Improvement"}
              </h2>

              <p>
                Your project has been evaluated using
                AssessAI's AI assessment system.
              </p>

              <span className="grade-badge">
                Grade {getGrade(overallScore)}
              </span>

            </div>

          </div>

        </section>
        <div className="confidence-card">
  <div className="confidence-icon">🤖</div>

  <div>
    <p>AI Assessment Confidence</p>
    <h2>{assessment?.confidenceScore ?? 0}%</h2>
    <span>
      Confidence level of the AI-generated assessment
    </span>
  </div>
</div>


        {/* Module Scores */}

        <section className="report-section">

          <div className="report-section-heading">

            <div>
              <span className="section-label">
                DETAILED EVALUATION
              </span>

              <h2>Module-wise Scores</h2>
            </div>

            <span className="ai-evaluated">
              ✨ AI Evaluated
            </span>

          </div>

          <div className="module-grid">

            {modules.map((module) => (

              <div
                className="module-card"
                key={module.name}
              >

                <div className="module-top">

                  <div className="module-icon">
                    {module.icon}
                  </div>

                  <div>
                    <h3>{module.name}</h3>

                    <p>
                      AI evaluation score
                    </p>
                  </div>

                  <strong className="module-score">
                    {Math.round(module.value)}
                  </strong>

                </div>
                
                <div className="module-progress">

                  <div
                    className="module-progress-fill"
                    style={{
                      width: `${Math.min(
                        Math.max(module.value, 0),
                        100
                      )}%`,
                    }}
                  ></div>

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* Strengths & Improvements */}

        <section className="report-section">

          <div className="report-section-heading">

            <div>
              <span className="section-label">
                AI FEEDBACK
              </span>

              <h2>Strengths & Improvements</h2>
            </div>

          </div>

          <div className="feedback-grid">

            {/* Strengths */}

            <div className="feedback-card strengths">

              <div className="feedback-heading">

                <div className="feedback-icon">
                  💪
                </div>

                <div>
                  <h3>Strengths</h3>
                  <p>What your project does well</p>
                </div>

              </div>

              {assessment.strengths?.length > 0 ? (
                <ul>
                  {assessment.strengths.map(
                    (strength, index) => (
                      <li key={index}>
                        <span>✓</span>
                        {strength}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No strengths available.</p>
              )}

            </div>

            {/* Improvements */}

            <div className="feedback-card improvements">

              <div className="feedback-heading">

                <div className="feedback-icon">
                  🚀
                </div>

                <div>
                  <h3>Improvements</h3>
                  <p>Areas where you can improve</p>
                </div>

              </div>

              {assessment.improvements?.length > 0 ? (
                <ul>
                  {assessment.improvements.map(
                    (improvement, index) => (
                      <li key={index}>
                        <span>{index + 1}</span>
                        {improvement}
                      </li>
                    )
                  )}
                </ul>
              ) : (
                <p>No improvement suggestions available.</p>
              )}

            </div>

          </div>

        </section>

        {/* Recommendation */}

        <section className="report-section">

          <div className="recommendation-card">

            <div className="recommendation-icon">
              🎯
            </div>

            <div className="recommendation-content">

              <span className="section-label">
                FINAL RECOMMENDATION
              </span>

              <h2>
                AI Recommendation
              </h2>

              <p>
                {assessment.recommendation ||
                  "No recommendation available."}
              </p>

            </div>

            <div className="recommendation-score">
              {overallScore}/100
            </div>

          </div>

        </section>

        {/* AI Analysis */}

        <section className="ai-analysis">

          <div className="analysis-header">

            <div className="analysis-ai-icon">
              ✨
            </div>

            <div>
              <h2>AssessAI Analysis</h2>

              <p>
                This report was generated using
                artificial intelligence.
              </p>
            </div>

          </div>

          <div className="analysis-points">

            <div>
              <span>✓</span>
              Documentation evaluated
            </div>

            <div>
              <span>✓</span>
              Project completeness evaluated
            </div>

            <div>
              <span>✓</span>
              Code structure evaluated
            </div>

            <div>
              <span>✓</span>
              Innovation evaluated
            </div>

            <div>
              <span>✓</span>
              Technology stack evaluated
            </div>

            <div>
              <span>✓</span>
              Missing modules identified
            </div>

          </div>

        </section>

        {/* Footer */}

        <footer className="report-footer">
          <p>
            Generated by <strong>AssessAI</strong> •
            AI-powered Project Assessment System
          </p>
        </footer>

      </main>
    </div>
  );
};

export default AssessmentReport;