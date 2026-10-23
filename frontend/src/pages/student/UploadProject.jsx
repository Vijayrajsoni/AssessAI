import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar.jsx";
import "./UploadProject.css";
import API from "../../services/api";

const UploadProject = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const reassessId = searchParams.get("reassess");

  const [projectTitle, setProjectTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleReportChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a PDF report.");
      return;
    }

    setReportFile(file);
  };

  const handleSourceChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".zip")) {
      alert("Please upload source code in ZIP format.");
      return;
    }

    setSourceFile(file);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!projectTitle.trim()) {
    alert("Please enter project title");
    return;
  }

  if (!abstract.trim()) {
    alert("Please enter abstract");
    return;
  }

  if (!reportFile) {
    alert("Please select PDF report");
    return;
  }

  if (!sourceFile) {
    alert("Please select ZIP source code");
    return;
  }

  console.log("REPORT:", reportFile.name);
  console.log("REPORT TYPE:", reportFile.type);

  console.log("SOURCE:", sourceFile.name);
  console.log("SOURCE TYPE:", sourceFile.type);

  const formData = new FormData();

  formData.append("projectTitle", projectTitle);
  formData.append("abstract", abstract);
  formData.append("report", reportFile);
  formData.append("sourceCode", sourceFile);

  const token = localStorage.getItem("token");

  try {
    setLoading(true);

    let response;

if (reassessId) {
  // 1. Update project with new files
  const updateResponse = await API.put(
    `/projects/${reassessId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!updateResponse.data.success) {
    throw new Error("Project update failed");
  }

  // 2. Start AI assessment again
  const assessmentResponse = await API.post(
    `/assessments/${reassessId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Re-Assessment Response:",
    assessmentResponse.data
  );

  if (assessmentResponse.data.success) {
    alert("Project re-assessed successfully 🎉");

    navigate(`/assessment/${reassessId}`);
  }
} else {
  // =========================
  // NORMAL NEW PROJECT
  // =========================
  response = await API.post(
    "/projects/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "Upload Response:",
    response.data
  );

  if (response.data.success) {
    alert(
      "Project uploaded successfully 🎉"
    );

    navigate("/my-projects");
  }
}
  } catch (error) {
    console.error("Upload Error:", error);

    console.log(
      "Backend Response:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
        "Project upload failed"
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const loadOldProject = async () => {
    if (!reassessId) return;

    const token = localStorage.getItem("token");

    try {
      const response = await API.get(`/projects/${reassessId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const project = response.data.project || response.data;

      setProjectTitle(
        project.projectTitle || project.title || ""
      );

      setAbstract(project.abstract || "");
    } catch (error) {
      console.error("Failed to load old project:", error);
      alert("Previous project details could not be loaded.");
    }
  };

  loadOldProject();
}, [reassessId]);
  return (
    <div className="upload-page">

        <Sidebar />

      {/* ================= MAIN ================= */}
      <main className="upload-main">

        {/* HEADER */}
        <header className="upload-header">

          <div>

            <h1>Upload Your Project</h1>

            <p className="upload-description">
              Submit your project details and files for
              AI-powered assessment.
            </p>

          </div>


        </header>

        {/* PROGRESS */}
        <div className="upload-progress">

          <div className="progress-step active">
            <span>1</span>
            <div>
              <strong>Project Details</strong>
              <small>Basic information</small>
            </div>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <span>2</span>
            <div>
              <strong>Upload Files</strong>
              <small>Report & source code</small>
            </div>
          </div>

          <div className="progress-line"></div>

          <div className="progress-step">
            <span>3</span>
            <div>
              <strong>AI Assessment</strong>
              <small>Get your score</small>
            </div>
          </div>

        </div>

        {/* ================= FORM ================= */}
        <form
          className="project-upload-form"
          onSubmit={handleSubmit}
        >

          {/* PROJECT DETAILS */}
          <section className="upload-section">

            <div className="section-title">

              <span className="section-number">
                01
              </span>

              <div>
                <h2>Project Details</h2>

                <p>
                  Tell us about your mini project
                </p>
              </div>

            </div>

            <div className="form-content">

              {/* TITLE */}
              <div className="input-group">

                <label htmlFor="projectTitle">
                  Project Title
                  <span>*</span>
                </label>

                <input
                  id="projectTitle"
                  type="text"
                  placeholder="e.g. AI Based Attendance System"
                  value={projectTitle}
                  onChange={(e) =>
                    setProjectTitle(e.target.value)
                  }
                  maxLength={100}
                />

                <small>
                  Enter the complete name of your project.
                </small>

              </div>

              {/* ABSTRACT */}
              <div className="input-group">

                <label htmlFor="abstract">
                  Project Abstract
                  <span>*</span>
                </label>

                <textarea
                  id="abstract"
                  rows="7"
                  placeholder="Briefly describe your project, its purpose, technologies used and main features..."
                  value={abstract}
                  onChange={(e) =>
                    setAbstract(e.target.value)
                  }
                  maxLength={1000}
                />

                <div className="character-count">
                  <span>
                    Brief description of your project
                  </span>

                  <span>
                    {abstract.length}/1000
                  </span>
                </div>

              </div>

            </div>

          </section>

          {/* FILE UPLOAD */}
          <section className="upload-section">

            <div className="section-title">

              <span className="section-number">
                02
              </span>

              <div>
                <h2>Project Files</h2>

                <p>
                  Upload your report and source code
                </p>
              </div>

            </div>

            <div className="file-upload-grid">

              {/* PDF */}
              <div className="file-upload-card">

                <div className="file-card-header">

                  <div className="file-type-icon pdf-icon">
                    PDF
                  </div>

                  <div>
                    <h3>Project Report</h3>
                    <p>PDF format only</p>
                  </div>

                </div>

                <label className="drop-zone">
<input
  type="file"
  accept=".pdf"
  onChange={(e) => {
    const file = e.target.files[0];

    console.log("PDF FILE:", file);
    console.log("PDF NAME:", file?.name);
    console.log("PDF TYPE:", file?.type);

    setReportFile(file);
  }}
/>

                  {reportFile ? (
                    <div className="selected-file">

                      <div className="selected-file-icon">
                        ✓
                      </div>

                      <div>
                        <strong>
                          {reportFile.name}
                        </strong>

                        <small>
                          {(reportFile.size / 1024 / 1024).toFixed(2)}
                          {" "}MB
                        </small>
                      </div>

                    </div>
                  ) : (
                    <>
                      <div className="upload-cloud">
                        ↑
                      </div>

                      <strong>
                        Click to upload
                      </strong>

                      <span>
                        or drag and drop your PDF here
                      </span>
                    </>
                  )}

                </label>

              </div>

              {/* ZIP */}
              <div className="file-upload-card">

                <div className="file-card-header">

                  <div className="file-type-icon code-icon">
                    ZIP
                  </div>

                  <div>
                    <h3>Source Code</h3>
                    <p>ZIP format only</p>
                  </div>

                </div>

                <label className="drop-zone">

                 <input
  type="file"
  accept=".zip"
  onChange={(e) => {
    const file = e.target.files[0];

    console.log("ZIP FILE:", file);
    console.log("ZIP NAME:", file?.name);
    console.log("ZIP TYPE:", file?.type);

    setSourceFile(file);
  }}
/>
                  {sourceFile ? (
                    <div className="selected-file">

                      <div className="selected-file-icon">
                        ✓
                      </div>

                      <div>
                        <strong>
                          {sourceFile.name}
                        </strong>

                        <small>
                          {(sourceFile.size / 1024 / 1024).toFixed(2)}
                          {" "}MB
                        </small>
                      </div>

                    </div>
                  ) : (
                    <>
                      <div className="upload-cloud">
                        ↑
                      </div>

                      <strong>
                        Click to upload
                      </strong>

                      <span>
                        or drag and drop your ZIP here
                      </span>
                    </>
                  )}

                </label>

              </div>

            </div>

          </section>


          {/* ACTIONS */}
          <div className="upload-actions">

            <Link
              to="/dashboard"
              className="cancel-upload"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="submit-project"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  Submit for AI Assessment
                  <span>→</span>
                </>
              )}
            </button>

          </div>

        </form>

        {/* FOOTER */}
        <footer className="upload-footer">
          <span>© 2026 AssessAI</span>

          <span>
            Your project files are securely handled.
          </span>
        </footer>

      </main>

    </div>
  );
};

export default UploadProject;