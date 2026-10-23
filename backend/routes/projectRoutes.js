const express = require("express");
const multer = require("multer");
const path = require("path");

const protect = require("../middleware/authMiddleware");

const {
  uploadProject,
  getMyProjects,
  getProjectById,
  updateProject,
   deleteProject,
} = require("../controllers/projectController");

const router = express.Router();

// ===============================
// MULTER STORAGE
// ===============================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      ext;

    cb(null, filename);
  },
});

// ===============================
// MULTER CONFIG
// ===============================
const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    const ext = path
      .extname(file.originalname)
      .toLowerCase();

    console.log("FILE RECEIVED:");
    console.log("Field:", file.fieldname);
    console.log("Name:", file.originalname);
    console.log("Extension:", ext);
    console.log("Mimetype:", file.mimetype);

    if (ext === ".pdf" || ext === ".zip") {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and ZIP files are allowed"
        )
      );
    }
  },

  limits: {
    fileSize:2024 * 1024 * 1024,
  },
});

// ===============================
// ROUTES
// ===============================

// Get all logged-in user's projects
router.get(
  "/my-projects",
  protect,
  getMyProjects
);


// Get single project
router.get(
  "/:id",
  protect,
  getProjectById
);

// Upload new project
router.post(
  "/upload",
  protect,
  upload.fields([
    {
      name: "report",
      maxCount: 1,
    },
    {
      name: "sourceCode",
      maxCount: 1,
    },
  ]),
  uploadProject
);

// Update project / Re-assess
router.put(
  "/:id",
  protect,
  upload.fields([
    {
      name: "report",
      maxCount: 1,
    },
    {
      name: "sourceCode",
      maxCount: 1,
    },
  ]),
  updateProject
);

router.delete("/:id", protect, deleteProject);

module.exports = router;