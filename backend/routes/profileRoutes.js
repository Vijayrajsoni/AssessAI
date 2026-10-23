const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  getSettings,
  updateSettings,
} = require("../controllers/profileController");

const router = express.Router();

// Profile
router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);



module.exports = router;