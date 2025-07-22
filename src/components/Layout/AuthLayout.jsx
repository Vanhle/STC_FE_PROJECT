import React from "react";
import Logo from "../Common/Logo";

const AuthLayout = ({
  children,
  subtitle = "Login your account to get started",
}) => {
  return (
    <div className="min-vh-100 d-flex">
      {/* Left Panel - Blue Background */}
      <div className="col-md-8 d-none d-md-flex align-items-center justify-content-center auth-gradient-bg">
        {/* Content */}
        <div className="text-center position-relative z-index-1 animate-fade-in">
          <Logo size="large" className="mb-4" />
          <p className="text-white fs-5 mb-4 opacity-90">{subtitle}</p>
        </div>
      </div>

      {/* Right Panel - White Background */}
      <div className="col-md-4 col-12 d-flex align-items-center justify-content-center bg-light auth-right-panel">
        <div
          className="w-100 px-4 py-5 auth-form"
          style={{ maxWidth: "400px" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
