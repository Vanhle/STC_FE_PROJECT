import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import AddressSelector from "../../Common/AddressSelector";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const ViewProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    code: "",
    name: "",
    address: "",
    numberOfBlocks: "",
    constructionStartDateFrom: "",
    expectedCompletionDate: "",
    description: "",
    active: "",
    deletedAt: "",
    deactivatedAt: "",
    createdAt: "",
    updatedAt: "",
    createdBy: "",
    updatedBy: "",
  });

  // Utility functions for date formatting
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Reusable function to fetch and format project data
  const fetchAndFormatProjectData = async () => {
    if (!isAuthenticated()) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/projects/${id}`);
      console.log("API Response:", response.data); // Debug log

      // Handle different response structures
      const project = response.data.data || response.data;

      if (!project) {
        throw new Error("Project data not found in response");
      }

      const formattedData = {
        id: project.id || "",
        code: project.code || "",
        name: project.name || "",
        address: project.address || "",
        numberOfBlocks: project.numberOfBlocks?.toString() || "",
        constructionStartDateFrom: formatDate(
          project.constructionStartDateFrom
        ),
        expectedCompletionDate: formatDate(project.expectedCompletionDate),
        description: project.description || "",
        active: project.active === 1 ? "Active" : "Inactive",
        deletedAt: project.deletedAt
          ? formatDateTime(project.deletedAt)
          : "N/A",
        deactivatedAt: project.deactivatedAt
          ? formatDateTime(project.deactivatedAt)
          : "N/A",
        createdAt: formatDateTime(project.createdAt),
        updatedAt: formatDateTime(project.updatedAt),
        createdBy: project.createdBy || "N/A",
        updatedBy: project.updatedBy || "N/A",
      };

      setFormData(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching project:", error);
      let errorMessage = "Failed to load project data.";
      alert(errorMessage);
      navigate("/dashboard/projects");
      throw error;
    }
  };

  // Fetch project data when component mounts
  useEffect(() => {
    const fetchProject = async () => {
      if (id) {
        try {
          setIsFetching(true);
          await fetchAndFormatProjectData();
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchProject();
  }, [id, navigate]);

  const handleInputChange = (e) => {
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Project code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.numberOfBlocks || formData.numberOfBlocks <= 0) {
      newErrors.numberOfBlocks = "Number of blocks must be greater than 0";
    }

    if (!formData.constructionStartDateFrom) {
      newErrors.constructionStartDateFrom =
        "Construction start date is required";
    }

    if (!formData.expectedCompletionDate) {
      newErrors.expectedCompletionDate = "Expected completion date is required";
    }

    // Validate dates
    if (formData.constructionStartDateFrom && formData.expectedCompletionDate) {
      const startDate = new Date(formData.constructionStartDateFrom);
      const endDate = new Date(formData.expectedCompletionDate);

      if (endDate <= startDate) {
        newErrors.expectedCompletionDate =
          "Completion date must be after start date";
      }
    }

    console.log("Validation errors:", newErrors); // Debug log
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!"); // Debug log
    console.log("Form data:", formData); // Debug log

    if (!validateForm()) {
      console.log("Validation failed!", errors); // Debug log
      return;
    }

    if (!isAuthenticated()) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        code: formData.code,
        name: formData.name,
        address: formData.address,
        numberOfBlocks: parseInt(formData.numberOfBlocks),
        constructionStartDateFrom: formData.constructionStartDateFrom,
        expectedCompletionDate: formData.expectedCompletionDate,
        description: formData.description,
      };

      console.log("Sending project data:", projectData); // Debug log

      const response = await axiosInstance.put(
        `/api/projects/${id}`,
        projectData
      );

      console.log("Update response:", response); // Debug log
      alert("Project updated successfully!");
      setIsEditMode(false);

      // Re-fetch fresh data using the reusable function
      await fetchAndFormatProjectData();
    } catch (error) {
      console.error("Error updating project:", error);
      let errorMessage = "Failed to update project. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/projects");
  };

  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setErrors({}); // Clear errors when toggling
  };

  // Show loading spinner while fetching data
  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="container-fluid">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "400px" }}
          >
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted">Loading project data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">
              {isEditMode ? "Edit Project" : "Project Details"}
            </h4>
            <p className="text-muted mb-0">
              {isEditMode
                ? "Modify project information"
                : "View complete project information"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              className="d-flex align-items-center gap-2"
            >
              <i className="bi bi-arrow-left"></i>
              Back to Projects
            </Button>
            {!isEditMode && (
              <Button
                variant="outline-primary"
                onClick={handleEditToggle}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-pencil"></i>
                Edit Project
              </Button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="row">
          <div className="col-12">
            {/* Display validation errors */}
            {Object.keys(errors).length > 0 && isEditMode && (
              <div className="alert alert-danger mb-4" role="alert">
                <h6 className="alert-heading">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Please fix the following errors:
                </h6>
                <ul className="mb-0 mt-2">
                  {Object.entries(errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Basic Information
                </h6>

                <div className="row">
                  <div className="col-md-3 mb-3">
                    <Input
                      label="Project ID"
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Project ID"
                      disabled={true}
                      icon="bi bi-hash"
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <Input
                      label="Project Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter project code"
                      required
                      error={errors.code}
                      icon="bi bi-code-slash"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <Input
                      label="Project Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter project name"
                      required
                      error={errors.name}
                      icon="bi bi-building"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-3 mb-3">
                    <Input
                      label="Number of Blocks"
                      type="number"
                      name="numberOfBlocks"
                      value={formData.numberOfBlocks}
                      onChange={handleInputChange}
                      placeholder="Enter number of blocks"
                      required
                      min="1"
                      error={errors.numberOfBlocks}
                      icon="bi bi-layers"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <AddressSelector
                    label="Address"
                    value={formData.address}
                    onChange={(value) => {
                      setFormData((prev) => ({ ...prev, address: value }));
                      // Clear error when user changes address
                      if (errors.address) {
                        setErrors((prev) => ({ ...prev, address: "" }));
                      }
                    }}
                    required
                    error={errors.address}
                    icon="bi bi-geo-alt"
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-calendar-range me-2"></i>
                  Project Timeline
                </h6>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Input
                      label="Construction Start Date"
                      type="date"
                      name="constructionStartDateFrom"
                      value={formData.constructionStartDateFrom}
                      onChange={handleInputChange}
                      required
                      error={errors.constructionStartDateFrom}
                      icon="bi bi-calendar-plus"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Expected Completion Date"
                      type="date"
                      name="expectedCompletionDate"
                      value={formData.expectedCompletionDate}
                      onChange={handleInputChange}
                      required
                      error={errors.expectedCompletionDate}
                      icon="bi bi-calendar-check"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-card-text me-2"></i>
                  Description
                </h6>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-text me-2"></i>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description..."
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                    disabled={!isEditMode}
                  />
                </div>
              </div>

              {/* System Information */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-gear me-2"></i>
                  System Information
                </h6>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Input
                      label="Status"
                      type="text"
                      name="active"
                      value={formData.active}
                      placeholder="Status"
                      disabled={true}
                      icon="bi bi-circle-fill"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Deleted At"
                      type="text"
                      name="deletedAt"
                      value={formData.deletedAt}
                      placeholder="Deleted At"
                      disabled={true}
                      icon="bi bi-trash"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Deactivated At"
                      type="text"
                      name="deactivatedAt"
                      value={formData.deactivatedAt}
                      placeholder="Deactivated At"
                      disabled={true}
                      icon="bi bi-power mb-1"
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

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Input
                      label="Created By"
                      type="text"
                      name="createdBy"
                      value={formData.createdBy}
                      placeholder="Created By"
                      disabled={true}
                      icon="bi bi-person-plus"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Updated By"
                      type="text"
                      name="updatedBy"
                      value={formData.updatedBy}
                      placeholder="Updated By"
                      disabled={true}
                      icon="bi bi-person-check"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditMode && (
                <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                  <Button
                    variant="outline-secondary"
                    onClick={handleEditToggle}
                    disabled={isLoading}
                    className="px-4"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel Edit
                  </Button>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                    className="px-4"
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Save Changes
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

export default ViewProject;
