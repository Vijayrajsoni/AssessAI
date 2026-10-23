const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  assessProject,
  getAssessment,
} = require("../controllers/assessmentController");

const router = express.Router();

router.post(
  "/:projectId",
  protect,
  assessProject
);

router.get(
  "/:projectId",
  protect,
  getAssessment
);

module.exports = router;