import React, { useState } from "react";
import AuthLayout from "../Layout/AuthLayout";
import Input from "../Common/Input";
import Button from "../Common/Button";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email là bắt buộc");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/auth/forgotpassword", { email });
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "Mã OTP đã được gửi đến email của bạn", {
          type: "success",
        });
        navigate("/reset-password", { state: { email } });
      } else {
        showToast(res.data.message || "Gửi mã OTP thất bại!", {
          type: "error",
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Gửi mã OTP thất bại!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Quên mật khẩu? Nhập email để nhận mã OTP đặt lại mật khẩu">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Quên mật khẩu</h2>
        <p className="text-muted">Vui lòng nhập email để nhận mã OTP</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          icon="bi bi-envelope"
          error={error}
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
                Đang gửi mã...
              </>
            ) : (
              "Gửi mã OTP"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center mt-3">
        <Link
          to="/login"
          className="text-primary text-decoration-none fw-semibold"
        >
          ← Quay về đăng nhập
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
