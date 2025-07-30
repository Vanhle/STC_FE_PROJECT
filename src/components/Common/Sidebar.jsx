import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/dashboard/statistics",
      icon: "bi bi-graph-up",
      label: "Statistics",
      active: location.pathname.includes("/statistics"),
    },
    {
      path: "/dashboard/projects",
      icon: "bi bi-diagram-3",
      label: "Project",
      active: location.pathname.includes("/projects"),
    },
    {
      path: "/dashboard/buildings",
      icon: "bi bi-building",
      label: "Building",
      active: location.pathname.includes("/buildings"),
    },
    {
      path: "/dashboard/apartments",
      icon: "bi bi-house-door",
      label: "Apartment",
      active: location.pathname.includes("/apartments"),
    },
     {
      path: "/dashboard/users",
      icon: "bi bi-person",
      label: "User",
      active: location.pathname.includes("/users"),
    },
    {
      path: "/dashboard/trash",
      icon: "bi bi-trash",
      label: "Trash",
      active: location.pathname.includes("/trash"),
    },
    {
      path: "/dashboard/deactivated",
      icon: "bi bi-power mb-1",
      label: "Deactivated",
      active: location.pathname.includes("/deactivated"),
    },
  ];

  return (
    <div
      className="sidebar bg-white border-end"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      {/* Sidebar Header */}
      <div
        className="sidebar-header p-3 border-bottom position-relative"
        style={{
          background:
            "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(194, 241, 255) 100%)",
          borderBottom: "none !important",
        }}
      >
        <Link
          to="/dashboard/statistics"
          className="text-decoration-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <div className="flex-grow-1 text-center">
            <h5
              className="fw-bold mb-0"
              style={{
                fontSize: "18px",
                letterSpacing: "-0.5px",
                color: "#1e40af",
              }}
            >
              STC-Building
            </h5>
            <p className="mb-0" style={{ fontSize: "12px", color: "#3b82f6" }}>
              Management System
            </p>
          </div>
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu">
        <nav>
          <ul className="list-unstyled m-0">
            {menuItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`d-flex align-items-center py-3 px-4 text-decoration-none transition-all ${
                    item.active
                      ? "bg-primary text-white"
                      : "text-muted hover-bg-light"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: item.active ? "600" : "500",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
                    display: "block",
                    width: "100%",
                  }}
                >
                  <i
                    className={`${item.icon} me-3`}
                    style={{ fontSize: "18px" }}
                  ></i>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Sidebar Footer
      <div className="sidebar-footer mt-auto p-3 border-top">
        <div className="d-flex align-items-center">
          <div
            className="avatar bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="bi bi-person text-muted"></i>
          </div>
          <div>
            <div className="fw-semibold" style={{ fontSize: "14px" }}>
              Admin User
            </div>
            <small className="text-muted">Building Manager</small>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
