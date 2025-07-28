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
      setError("Email is required");
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post("/auth/forgotpassword", { email });
      if (res.data && res.data.status === 200) {
        showToast(res.data.message || "OTP code has been sent to your email", {
          type: "success",
        });
        navigate("/reset-password", { state: { email } });
      } else {
        showToast(res.data.message || "Failed to send OTP code!", {
          type: "error",
        });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP code!", {
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout subtitle="Forgot password? Enter your email to receive an OTP code to reset your password">
      <div className="text-center mb-4">
        <h2 className="fw-bold text-dark mb-2">Forgot Password</h2>
        <p className="text-muted">
          Please enter your email to receive an OTP code
        </p>
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
                Sending code...
              </>
            ) : (
              "Send OTP code"
            )}
          </Button>
        </div>
      </form>
      <div className="text-center mt-3">
        <Link
          to="/login"
          className="text-primary text-decoration-none fw-semibold"
        >
          ← Back to login
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
