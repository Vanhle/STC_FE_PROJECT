import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import Input from "../Common/Input";
import Button from "../Common/Button";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = "Username là bắt buộc";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      const res = await axiosInstance.post("/auth/register", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "Đăng ký thành công!", {
          type: "success",
        });
        navigate("/verify-otp", { state: { email: formData.email } });
      } else {
        showToast(res.data.message || "Đăng ký thất bại!", { type: "error" });
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Đăng ký thất bại!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Đăng ký tài khoản để bắt đầu sử dụng">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Đăng ký</h2>
        <p className="text-muted">Tạo tài khoản mới</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={formData.username}
          onChange={handleChange}
          icon="bi bi-person"
          error={errors.username}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          icon="bi bi-envelope"
          error={errors.email}
        />
        <Input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={formData.password}
          onChange={handleChange}
          icon="bi bi-lock"
          error={errors.password}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          icon="bi bi-lock-fill"
          error={errors.confirmPassword}
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
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </div>
        <div className="text-center">
          <span className="text-muted">Đã có tài khoản? </span>
          <Link
            to="/login"
            className="text-primary text-decoration-none fw-semibold"
          >
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
