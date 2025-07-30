import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const CreateUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    hashedPassword: "", // Đúng tên trường backend yêu cầu
    // role: "user", // Nếu backend không yêu cầu thì bỏ
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.hashedPassword.trim()) newErrors.hashedPassword = "Password is required";
    if (formData.hashedPassword.length < 8) newErrors.hashedPassword = "Password must be at least 8 characters long";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!isAuthenticated()) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }
    // Bỏ kiểm tra isAuthenticated để không bị chuyển hướng login
    setIsLoading(true);
    try {
      console.log(formData);
      await axiosInstance.post("/api/users/create", formData);
      alert("User created successfully!");
      navigate("/dashboard/users");
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert("Failed to create user: " + error.response.data.message);
      } else {
        alert("Failed to create user. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/users");
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">Add New User</h4>
            <p className="text-muted mb-0">Create a new user account</p>
          </div>
          <Button variant="outline-secondary" onClick={handleCancel} className="d-flex align-items-center gap-2">
            <i className="bi bi-arrow-left"></i> Back to Users
          </Button>
        </div>
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Input
                    label="Username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter username"
                    required
                    error={errors.username}
                    icon="bi bi-person"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                    required
                    error={errors.email}
                    icon="bi bi-envelope"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Input
                    label="Password"
                    type="password"
                    name="hashedPassword" // Đúng tên trường backend yêu cầu
                    value={formData.hashedPassword}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    required
                    error={errors.hashedPassword}
                    icon="bi bi-lock"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                  </select>
                  {errors.role && <div className="text-danger small">{errors.role}</div>}
                </div>
              </div>
              <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                <Button variant="outline-secondary" onClick={handleCancel} disabled={isLoading} className="px-4">
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isLoading} className="px-4">
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i> Create User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser; 
