import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const features = [
  {
    icon: "📄",
    title: "Upload Project",
    text: "Upload your project report in PDF format along with your source code ZIP."
  },
  {
    icon: "🤖",
    title: "AI Evaluation",
    text: "AI analyzes documentation, code structure, innovation and project completeness."
  },
  {
    icon: "📊",
    title: "Smart Scoring",
    text: "Get an overall assessment score with module-wise evaluation."
  },
  {
    icon: "💡",
    title: "Actionable Feedback",
    text: "Receive useful suggestions to improve your project and documentation."
  },
  {
    icon: "📑",
    title: "Detailed Reports",
    text: "Generate and download detailed AI assessment reports."
  },
  {
    icon: "📈",
    title: "Analytics",
    text: "Track previous assessments, scores and project progress from your dashboard."
  }
];

const steps = [
  {
    number: "01",
    title: "Create Account",
    text: "Register with your name, email, college and department."
  },
  {
    number: "02",
    title: "Upload Project",
    text: "Submit your project report and source code."
  },
  {
    number: "03",
    title: "AI Analysis",
    text: "AssessAI analyzes your project using AI."
  },
  {
    number: "04",
    title: "Get Report",
    text: "View your score, feedback and recommendations."
  }
];

function Home() {
  return (
    <div className="home">

      {/* ================= NAVBAR ================= */}
      <header className="navbar">
        <div className="nav-container">

          <Link to="/" className="logo">
            <div className="logo-icon">A</div>
            <span>Assess<span>AI</span></span>
          </Link>

          <nav className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
            <a href="#about">About</a>
          </nav>

          <div className="nav-actions">
            <Link to="/login" className="login-btn">
              Login
            </Link>
          </div>

        </div>
      </header>


      {/* ================= HERO ================= */}
      <section className="hero">

        <div className="hero-container">

          <div className="hero-content">

            <div className="badge">
              <span className="badge-dot"></span>
              AI-Powered Project Assessment
            </div>

            <h1>
              Evaluate Your Project
              <br />
              <span>Smarter with AI.</span>
            </h1>

            <p>
              AssessAI automatically evaluates student mini projects,
              analyzes documentation and source code, generates scores,
              and provides actionable feedback.
            </p>

            <div className="hero-buttons">
              <Link to="/login" className="primary-btn">
                Start Assessment
                <span>→</span>
              </Link>

              <a href="#how-it-works" className="secondary-btn">
                How It Works
              </a>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <strong>AI</strong>
                <span>Powered</span>
              </div>

              <div className="trust-line"></div>

              <div className="trust-item">
                <strong>Fast</strong>
                <span>Evaluation</span>
              </div>

              <div className="trust-line"></div>

              <div className="trust-item">
                <strong>Smart</strong>
                <span>Feedback</span>
              </div>
            </div>

          </div>


          {/* AI DASHBOARD PREVIEW */}
          <div className="hero-visual">

            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>

            <div className="dashboard-card">

              <div className="dashboard-top">
                <div>
                  <span className="small-label">PROJECT ASSESSMENT</span>
                  <h3>AI Evaluation Report</h3>
                </div>

                <span className="status">
                  ● Completed
                </span>
              </div>

              <div className="score-section">

                <div className="score-circle">
                  <div>
                    <strong>87</strong>
                    <span>/100</span>
                  </div>
                </div>

                <div className="score-info">
                  <h4>Excellent Project</h4>
                  <p>
                    Your project demonstrates strong documentation,
                    code quality and innovation.
                  </p>
                </div>

              </div>

              <div className="progress-list">

                <div className="progress-item">
                  <div>
                    <span>Documentation</span>
                    <b>90%</b>
                  </div>
                  <div className="progress">
                    <span style={{ width: "90%" }}></span>
                  </div>
                </div>

                <div className="progress-item">
                  <div>
                    <span>Code Quality</span>
                    <b>85%</b>
                  </div>
                  <div className="progress">
                    <span style={{ width: "85%" }}></span>
                  </div>
                </div>

                <div className="progress-item">
                  <div>
                    <span>Innovation</span>
                    <b>88%</b>
                  </div>
                  <div className="progress">
                    <span style={{ width: "88%" }}></span>
                  </div>
                </div>

              </div>

              <div className="ai-message">
                <div className="ai-icon">✦</div>

                <div>
                  <strong>AI Recommendation</strong>
                  <p>
                    Improve testing documentation and add more
                    detailed API descriptions.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <span>POWERFUL FEATURES</span>

          <h2>
            Everything you need to
            <br />
            <strong>assess projects better.</strong>
          </h2>

          <p>
            AssessAI combines AI-powered analysis with an easy-to-use
            project assessment workflow.
          </p>
        </div>

        <div className="features-grid">

          {features.map((feature, index) => (
            <div className="feature-card" key={index}>

              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>

              <p>{feature.text}</p>

              <div className="feature-arrow">
                →
              </div>

            </div>
          ))}

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="workflow-section" id="how-it-works">

        <div className="section-heading">
          <span>SIMPLE WORKFLOW</span>

          <h2>
            From project upload to
            <br />
            <strong>AI-powered report.</strong>
          </h2>
        </div>

        <div className="steps-container">

          {steps.map((step, index) => (

            <div className="step" key={index}>

              <div className="step-number">
                {step.number}
              </div>

              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>

              {index !== steps.length - 1 && (
                <div className="step-line"></div>
              )}

            </div>

          ))}

        </div>

      </section>


      {/* ================= AI EVALUATION ================= */}
      <section className="evaluation-section">

        <div className="evaluation-container">

          <div className="evaluation-content">

            <span className="section-tag">
              INTELLIGENT ASSESSMENT
            </span>

            <h2>
              Turn your project into
              <br />
              <span>meaningful insights.</span>
            </h2>

            <p>
              AssessAI evaluates important aspects of your project
              including documentation quality, project completeness,
              code structure, innovation, technology stack and missing
              modules.
            </p>

            <div className="check-list">

              <div>✓ Documentation Quality</div>
              <div>✓ Project Completeness</div>
              <div>✓ Code Structure</div>
              <div>✓ Innovation</div>
              <div>✓ Technology Stack</div>
              <div>✓ Missing Modules</div>

            </div>

            <Link to="/login" className="primary-btn">
              Try AssessAI
              <span>→</span>
            </Link>

          </div>

          <div className="evaluation-card">

            <div className="evaluation-header">
              <span>AI ANALYSIS</span>
              <span className="live-dot">● LIVE</span>
            </div>

            <div className="analysis-row">
              <span>Documentation</span>
              <strong>92%</strong>
            </div>

            <div className="analysis-row">
              <span>Completeness</span>
              <strong>88%</strong>
            </div>

            <div className="analysis-row">
              <span>Code Quality</span>
              <strong>85%</strong>
            </div>

            <div className="analysis-row">
              <span>Innovation</span>
              <strong>90%</strong>
            </div>

            <div className="overall-score">
              <span>Overall Score</span>
              <strong>88.7</strong>
            </div>

          </div>

        </div>

      </section>


      {/* ================= ABOUT ================= */}
      <section className="about-section" id="about">

        <div className="about-card">

          <div className="about-icon">
            ✦
          </div>

          <div>
            <span>ABOUT ASSESSAI</span>

            <h2>
              Better assessment.
              <br />
              Better projects.
            </h2>

            <p>
              AssessAI is designed to reduce manual assessment effort,
              improve consistency and provide students with detailed
              feedback for improving their projects.
            </p>
          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}
      <section className="cta-section">

        <div className="cta-content">

          <div className="cta-icon">
            ✦
          </div>

          <h2>
            Ready to assess your project?
          </h2>

          <p>
            Upload your project and let AI provide meaningful
            insights, scores and recommendations.
          </p>

          <Link to="/login" className="cta-btn">
            Get Started with AssessAI
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="footer">

        <div className="footer-container">

          <div className="footer-brand">

            <Link to="/" className="logo">
              <div className="logo-icon">A</div>
              <span>Assess<span>AI</span></span>
            </Link>

            <p>
              AI-powered student project assessment platform.
            </p>

          </div>

          <div className="footer-links">

            <div>
              <h4>Platform</h4>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <a href="#features">Features</a>
            </div>

            <div>
              <h4>Product</h4>
              <a href="#how-it-works">How It Works</a>
              <a href="#about">About</a>
            </div>

          </div>

        </div>

        <div className="footer-bottom">
          <span>© 2026 AssessAI. All rights reserved.</span>
          <span>Built with MERN + AI</span>
        </div>

      </footer>

    </div>
  );
}

export default Home;