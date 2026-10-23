const Project = require("../models/Project");

const uploadProject = async (req, res) => {
  try {
    const { projectTitle, abstract } = req.body;

    if (!projectTitle || !abstract) {
      return res.status(400).json({
        success: false,
        message: "Project title and abstract are required",
      });
    }

    if (!req.files?.report || !req.files?.sourceCode) {
      return res.status(400).json({
        success: false,
        message: "Report PDF and source code ZIP are required",
      });
    }

    const project = await Project.create({
      user: req.user.id,
      projectTitle,
      abstract,
      reportFile: req.files.report[0].filename,
      sourceCodeFile: req.files.sourceCode[0].filename,
      status: "Uploaded",
    });

    res.status(201).json({
      success: true,
      message: "Project uploaded successfully",
      project,
    });
  }  catch (error) {
  console.error("Upload Project Error:", error);

  return res.status(500).json({
    success: false,
    message: "Project upload failed",
    error: error.message,
  });
}
};

// ===============================
// GET MY PROJECTS
// ===============================
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
};

// ===============================
// GET SINGLE PROJECT
// ===============================
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: error.message,
    });
  }
};
// =====================================
// DELETE PROJECT
// =====================================
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete project",
      error: error.message,
    });
  }
};
// ===============================
// RE-ASSESS / UPDATE PROJECT
// ===============================
const updateProject = async (req, res) => {
  try {
    const { projectTitle, abstract } = req.body;

    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!projectTitle || !abstract) {
      return res.status(400).json({
        success: false,
        message: "Project title and abstract are required",
      });
    }

    // Update project details
    project.projectTitle = projectTitle;
    project.abstract = abstract;

    // Update new files if uploaded
    if (req.files?.report?.[0]) {
      project.reportFile = req.files.report[0].filename;
    }

    if (req.files?.sourceCode?.[0]) {
      project.sourceCodeFile = req.files.sourceCode[0].filename;
    }

    // Reset old assessment
    project.assessment = {
      documentationQuality: null,
      projectCompleteness: null,
      codeStructure: null,
      innovation: null,
      technologyStack: null,
      missingModules: null,
      overallScore: null,
      strengths: [],
      improvements: [],
      recommendation: "",
    };

    project.status = "Uploaded";

    await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully. Ready for re-assessment.",
      project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);

    res.status(500).json({
      success: false,
      message: "Project update failed",
      error: error.message,
    });
  }
};

module.exports = {
  uploadProject,
  getMyProjects,
  getProjectById,
  updateProject,
   deleteProject,
};
