import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../Layout/AuthLayout";
import Button from "../Common/Button";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError("");

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
    // Handle paste
    else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const pastedNumbers = text.replace(/\D/g, "").slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = pastedNumbers[i] || "";
        }
        setOtp(newOtp);

        // Focus last filled input or next empty input
        const nextIndex = Math.min(pastedNumbers.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("OTP verification:", otpString);
      // Handle successful verification here
      // navigate('/dashboard');
    } catch (error) {
      setError("Mã OTP không chính xác. Vui lòng thử lại.");
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Resend OTP requested");

      // Reset timer
      setResendTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);

      // Focus first input
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <AuthLayout subtitle="Xác thực tài khoản để tiếp tục">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Xác nhận OTP</h2>
        <p className="text-muted mb-3">
          Chúng tôi đã gửi mã xác thực 6 số đến
          <br />
          <strong>example@email.com</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* OTP Input Fields */}
        <div className="d-flex justify-content-center gap-2 mb-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              className={`form-control text-center fw-bold fs-4 ${
                error ? "is-invalid" : ""
              }`}
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "8px",
                border: "2px solid #dee2e6",
              }}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {error && (
          <div className="alert alert-danger text-center py-2 mb-3">
            <small>{error}</small>
          </div>
        )}

        <div className="d-grid mb-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading || otp.join("").length !== 6}
            className="py-3 fw-semibold"
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Đang xác thực...
              </>
            ) : (
              "Xác nhận OTP"
            )}
          </Button>
        </div>

        {/* Resend OTP */}
        <div className="text-center mb-3">
          {canResend ? (
            <button
              type="button"
              className="btn btn-link text-primary text-decoration-none p-0"
              onClick={handleResendOTP}
            >
              Gửi lại mã OTP
            </button>
          ) : (
            <span className="text-muted">Gửi lại mã sau {resendTimer}s</span>
          )}
        </div>

        <div className="text-center">
          <Link to="/login" className="text-muted text-decoration-none">
            ← Quay lại đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};

export default OTPVerification;
