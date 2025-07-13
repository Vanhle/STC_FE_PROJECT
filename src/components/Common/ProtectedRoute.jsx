import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  // Thay đổi logic này theo cách authentication của bạn
  const isAuthenticated = () => {
    // Kiểm tra token trong localStorage hoặc sessionStorage
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
    const user = localStorage.getItem("user") || sessionStorage.getItem("user");

    // Có thể thêm logic kiểm tra token expired ở đây
    return token && user;
  };

  // Nếu chưa đăng nhập, redirect về login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Nếu đã đăng nhập, hiển thị component
  return children;
};

export default ProtectedRoute;
