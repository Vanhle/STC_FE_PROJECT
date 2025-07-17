import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
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
      path: "/dashboard/trash",
      icon: "bi bi-trash",
      label: "Thùng rác",
      active: location.pathname.includes("/trash"),
    },
  ];

  return (
    <div
      className="sidebar bg-white border-end"
      style={{ width: "250px", minHeight: "100vh" }}
    >
      {/* Sidebar Header */}
      <div className="sidebar-header p-3 border-bottom">
        <Link
          to="/dashboard"
          className="text-decoration-none"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          <h4 className="text-primary fw-bold mb-0">STC-Building</h4>
        </Link>
      </div>

      {/* Sidebar Menu */}
      <div className="sidebar-menu p-3">
        <nav>
          <ul className="list-unstyled">
            {menuItems.map((item, index) => (
              <li key={index} className="mb-2">
                <Link
                  to={item.path}
                  className={`d-flex align-items-center p-3 rounded text-decoration-none transition-all ${
                    item.active
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted hover-bg-light"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: item.active ? "600" : "500",
                    fontSize: "15px",
                    transition: "all 0.3s ease",
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

      {/* Sidebar Footer */}
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
      </div>
    </div>
  );
};

export default Sidebar;
