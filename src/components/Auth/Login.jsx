import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import Input from "../Common/Input";
import Button from "../Common/Button";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email hoặc Username là bắt buộc";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock successful login - thay thế bằng API call thực tế
      const mockUser = {
        id: 1,
        name: "Admin User",
        email: formData.email,
        role: "administrator",
      };
      const mockToken = "mock-jwt-token-" + Date.now();

      // Store auth data
      localStorage.setItem("authToken", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      // Redirect to dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      setErrors({
        general: "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Xin chào</h2>
        <p className="text-muted">Welcome Back</p>
      </div>

      <form onSubmit={handleSubmit}>
        {errors.general && (
          <div className="alert alert-danger" role="alert">
            {errors.general}
          </div>
        )}

        <Input
          type="text"
          name="email"
          placeholder="Email or Username"
          value={formData.email}
          onChange={handleChange}
          icon="bi bi-envelope"
          error={errors.email}
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          icon="bi bi-lock"
          error={errors.password}
        />

        <div className="d-grid mb-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="py-3 fw-semibold"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Đang đăng nhập...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </div>

        <div className="text-center mb-3">
          <Link
            to="/forgot-password"
            className="text-decoration-none text-muted"
          >
            Forgot Password
          </Link>
        </div>

        <div className="text-center">
          <span className="text-muted">Don't have an account? </span>
          <Link
            to="/register"
            className="text-primary text-decoration-none fw-semibold"
          >
            Register here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
