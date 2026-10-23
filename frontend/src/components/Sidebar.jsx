import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      icon: "⌂",
      path: "/dashboard",
    },
    {
      name: "Upload Project",
      icon: "＋",
      path: "/upload-project",
    },
    {
      name: "My Projects",
      icon: "▣",
      path: "/my-projects",
    },
    {
      name: "Reports",
      icon: "◈",
      path: "/assessments",
    },
    {
      name: "Profile",
      icon: "◉",
      path: "/profile",
    },
    
  ];

 const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.replace("/");
};
  return (
    <aside className="student-sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <img
          src="/favicon1.png"
          alt="AssessAI"
        />

        <div className="sidebar-brand">
          <span>Assess</span>
          <strong>AI</strong>
        </div>
      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-menu">

        {menuItems.map((item) => (
          <button
            key={item.path}
            className={`sidebar-menu-item ${
              location.pathname === item.path ||
              (item.path === "/assessments" &&
                location.pathname.startsWith("/assessment"))
                ? "active"
                : ""
            }`}
            onClick={() => navigate(item.path)}
          >
            <span className="sidebar-menu-icon">
              {item.icon}
            </span>

            <span className="sidebar-menu-text">
              {item.name}
            </span>
          </button>
        ))}

      </nav>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        


        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </div>

    </aside>
  );
};

export default Sidebar;