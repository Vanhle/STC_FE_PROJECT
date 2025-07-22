import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "./Toast";

const Navbar = ({ title = "Dashboard" }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/auth/aboutme");
        if (res.data && res.data.status === 200) {
          setUsername(res.data.data);
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          showToast("Phiên đăng nhập đã hết hạn!", { type: "error" });
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("tokenExpiredAt");
          navigate("/login");
        }
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout", {});
      showToast("Đăng xuất thành công!", { type: "success" });
    } finally {
      // Xoá token
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("tokenExpiredAt");
      // Điều hướng về login
      navigate("/login");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom px-4 py-3">
      <div className="container-fluid">
        {/* Page Title */}
        <div className="navbar-brand mb-0">
          <h2
            className="fw-bold text-dark mb-0"
            style={{
              fontFamily: "'Inter', sans-serif",
              letterSpacing: "-0.025em",
              fontSize: "24px",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Right side - User menu */}
        <div className="navbar-nav ms-auto">
          <div className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle d-flex align-items-center text-decoration-none border-0 bg-transparent"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {/* User Avatar */}
              <div className="d-flex align-items-center">
                <div
                  className="avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-person text-white"></i>
                </div>
                <div className="text-start d-none d-md-block">
                  <div
                    className="fw-semibold text-dark"
                    style={{ fontSize: "14px" }}
                  >
                    {username || "Admin User"}
                  </div>
                  <small className="text-muted">Administrator</small>
                </div>
                <i className="bi bi-chevron-down ms-2 text-muted"></i>
              </div>
            </button>

            {/* Dropdown Menu */}
            <ul
              className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2"
              style={{ minWidth: "200px" }}
            >
              <li>
                <h6
                  className="dropdown-header"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Tài khoản
                </h6>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center py-2">
                  <i className="bi bi-person me-3 text-muted"></i>
                  Hồ sơ cá nhân
                </button>
              </li>
              <li>
                <button className="dropdown-item d-flex align-items-center py-2">
                  <i className="bi bi-gear me-3 text-muted"></i>
                  Cài đặt
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center py-2 text-danger"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-3"></i>
                  Đăng xuất
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
