import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import UploadProject from "./pages/student/UploadProject.jsx";
import MyProjects from "./pages/student/MyProjects.jsx";
import AssessmentReport from "./pages/student/AssessmentReport.jsx";
import Profile from "./pages/student/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import OAuthSuccess from "./pages/auth/OAuthSuccess.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
     
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <StudentDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/upload-project"
  element={
    <ProtectedRoute>
      <UploadProject />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-projects"
  element={
    <ProtectedRoute>
      <MyProjects />
    </ProtectedRoute>
  }
/>

<Route
  path="/assessment/:id"
  element={
    <ProtectedRoute>
      <AssessmentReport />
    </ProtectedRoute>
  }
/>
<Route path="/my-projects" element={<MyProjects />} />
<Route path="/assessments" element={<MyProjects />} />
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/reset-password/:token" element={<ResetPassword />} />

<Route
  path="/oauth-success"
  element={<OAuthSuccess />}
/>

    </Routes>
  );
}

export default App;