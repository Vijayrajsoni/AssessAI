const Project = require("../models/Project");

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const projects = await Project.find({
      user: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalProjects = projects.length;

    const completedAssessments = projects.filter(
      (project) =>
        project.assessment &&
        project.assessment.overallScore !== null &&
        project.assessment.overallScore !== undefined
    );

    const scores = completedAssessments
      .map((project) => Number(project.assessment.overallScore))
      .filter((score) => !isNaN(score));

    const averageScore =
      scores.length > 0
        ? Math.round(
            scores.reduce((sum, score) => sum + score, 0) /
              scores.length
          )
        : 0;

    const latestProject =
      projects.length > 0 ? projects[0] : null;

    const recentAssessments = completedAssessments
      .slice(0, 5)
      .map((project) => ({
        _id: project._id,
        projectId: project._id,
        projectTitle:
          project.title ||
          project.projectTitle ||
          "Untitled Project",

        overallScore:
          project.assessment?.overallScore ?? null,

        status: "Completed",

        createdAt: project.updatedAt || project.createdAt,

        strengths:
          project.assessment?.strengths || [],

        improvements:
          project.assessment?.improvements || [],

        recommendation:
          project.assessment?.recommendation || "",
      }));

    res.status(200).json({
      success: true,

      stats: {
        totalProjects,
        completedAssessments:
          completedAssessments.length,
        averageScore,
      },

      latestProject,

      recentAssessments,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};