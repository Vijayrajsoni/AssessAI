const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dashboardRoutes = require("./routes/dashboardRoutes");


dotenv.config();

const connectDB = require("./config/db");
const passport = require("./config/googleAuth");

const app = express();

connectDB();

app.use(
  cors({
    origin: [
      "https://assessai-f.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const profileRoutes = require("./routes/profileRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use(
  "/api/assessments",
  assessmentRoutes
);
app.use("/api/profile", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  res.json({
    message: "AssessAI Backend is running successfully 🚀",
  });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "AssessAI API working",
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
