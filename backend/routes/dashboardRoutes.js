const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("https://assessai-b.onrender.com/api/dashboard", protect, getDashboard);

module.exports = router;
