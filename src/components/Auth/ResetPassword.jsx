import React, { useState, useEffect } from "react";
import AuthLayout from "../Layout/AuthLayout";
import Input from "../Common/Input";
import Button from "../Common/Button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { showToast } from "../Common/Toast";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const emailFromState = location.state?.email || "";
  const [formData, setFormData] = useState({
    email: emailFromState,
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (emailFromState) {
      setFormData((prev) => ({ ...prev, email: emailFromState }));
    }
  }, [emailFromState]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      // Chỉ cho nhập số và tối đa 6 ký tự
      if (!/^\d{0,6}$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate đơn giản
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email là bắt buộc";
    if (!formData.otp || formData.otp.length !== 6)
      newErrors.otp = "OTP phải đủ 6 số";
    if (!formData.password) newErrors.password = "Mật khẩu mới là bắt buộc";
    if (formData.password.length < 6)
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      const res = await axiosInstance.post("/auth/resetpassword", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "Đặt lại mật khẩu thành công", {
          type: "success",
        });
        navigate("/login");
      } else {
        showToast(res.data.message || "Đặt lại mật khẩu thất bại!", {
          type: "error",
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Đặt lại mật khẩu thất bại!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    try {
      const payload = { email: formData.email, isReset: true };
      const res = await axiosInstance.post("/auth/resendotp", payload);
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "Đã gửi lại mã OTP!", {
          type: "success",
        });
        setResendTimer(60);
        setCanResend(false);
      } else {
        showToast(res.data.message || "Gửi lại OTP thất bại!", {
          type: "error",
        });
      }
    } catch (error) {
      showToast(error.response?.data?.message || "Gửi lại OTP thất bại!", {
        type: "error",
      });
    }
  };

  return (
    <AuthLayout subtitle="Đặt lại mật khẩu cho tài khoản của bạn">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Đặt lại mật khẩu</h2>
        <p className="text-muted">
          Vui lòng nhập thông tin để đặt lại mật khẩu
        </p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          icon="bi bi-envelope"
          error={errors.email}
          disabled={!!emailFromState}
        />
        <div className="d-flex align-items-center mb-2">
          <Input
            type="text"
            name="otp"
            placeholder="Mã OTP"
            value={formData.otp}
            onChange={handleChange}
            icon="bi bi-shield-lock"
            error={errors.otp}
            style={{ flex: 1 }}
            maxLength={6}
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <div className="ms-2">
            {canResend ? (
              <Button
                type="button"
                variant="outline-primary"
                size="sm"
                onClick={handleResendOTP}
              >
                Gửi lại mã OTP
              </Button>
            ) : (
              <span className="text-muted" style={{ fontSize: 14 }}>
                Gửi lại mã sau {resendTimer}s
              </span>
            )}
          </div>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Mật khẩu mới"
          value={formData.password}
          onChange={handleChange}
          icon="bi bi-lock"
          error={errors.password}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Xác nhận mật khẩu mới"
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
                Đang xử lý...
              </>
            ) : (
              "Đặt lại mật khẩu"
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

export default ResetPassword;
