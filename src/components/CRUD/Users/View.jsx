import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const ViewUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    email: "",
    role: "user",
    status: "active",
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated()) {
        alert("Authentication required. Please log in again.");
        navigate("/login");
        return;
      }
      try {
        setIsFetching(true);
        const response = await axiosInstance.get(`/api/users/${id}`);
        const user = response.data.data || response.data;
        setFormData({
          id: user.id || "",
          username: user.username || "",
          email: user.email || "",
          role: user.role || "user",
          status: user.status || "active",
          createdAt: user.createdAt || "",
          updatedAt: user.updatedAt || "",
        });
      } catch (error) {
        alert("Failed to load user data.");
        navigate("/dashboard/users");
      } finally {
        setIsFetching(false);
      }
    };
    fetchUser();
  }, [id, navigate]);
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center p-5">
          <div className="spinner-border text-primary"></div>
          <p className="mt-3">Loading user data...</p>
        </div>
      </DashboardLayout>
    );
  }

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
    if (!formData.role) newErrors.role = "Role is required";
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
    setIsLoading(true);
    try {
      await axiosInstance.put(`/api/users/${id}`, formData);
      alert("User updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      alert("Failed to update user. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/users");
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setErrors({});
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="container-fluid">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading user data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">{isEditMode ? "Edit User" : "User Details"}</h4>
            <p className="text-muted mb-0">{isEditMode ? "Modify user information" : "View complete user information"}</p>
          </div>
          <div className="d-flex gap-2">
            <Button variant="outline-secondary" onClick={handleCancel} className="d-flex align-items-center gap-2">
              <i className="bi bi-arrow-left"></i> Back to Users
            </Button>
            {!isEditMode && (
              <Button variant="outline-primary" onClick={handleEditToggle} className="d-flex align-items-center gap-2">
                <i className="bi bi-pencil"></i> Edit User
              </Button>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            {Object.keys(errors).length > 0 && isEditMode && (
              <div className="alert alert-danger mb-4" role="alert">
                <h6 className="alert-heading"><i className="bi bi-exclamation-triangle me-2"></i> Please fix the following errors:</h6>
                <ul className="mb-0 mt-2">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
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
                    disabled={!isEditMode}
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
                    disabled={!isEditMode}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Role</label>
                  <select
                    className="form-select"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    disabled={!isEditMode}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                  {errors.role && <div className="text-danger small">{errors.role}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <Input
                    label="Status"
                    type="text"
                    name="status"
                    value={formData.status}
                    placeholder="Status"
                    disabled={true}
                    icon="bi bi-circle-fill"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <Input
                    label="Created At"
                    type="text"
                    name="createdAt"
                    value={formData.createdAt}
                    placeholder="Created At"
                    disabled={true}
                    icon="bi bi-calendar-plus"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <Input
                    label="Updated At"
                    type="text"
                    name="updatedAt"
                    value={formData.updatedAt}
                    placeholder="Updated At"
                    disabled={true}
                    icon="bi bi-calendar-check"
                  />
                </div>
              </div>
              {isEditMode && (
                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <Button variant="outline-secondary" onClick={handleEditToggle} disabled={isLoading} className="px-4">
                    <i className="bi bi-x-circle me-2"></i> Cancel Edit
                  </Button>
                  <Button type="submit" variant="primary" disabled={isLoading} className="px-4">
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span> Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i> Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewUser; 