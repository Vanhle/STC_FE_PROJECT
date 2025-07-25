import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import AddressSelector from "../../Common/AddressSelector";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const CreateProject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    address: "",
    numberOfBlocks: "",
    constructionStartDateFrom: "",
    expectedCompletionDate: "",
    description: "",
  });

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

  const handleAddressChange = useCallback((value) => {
    setFormData((prev) => ({
      ...prev,
      address: value,
    }));

    // Clear error when address changes
    setErrors((prev) => {
      if (prev.address) {
        return {
          ...prev,
          address: "",
        };
      }
      return prev;
    });
  }, []); // No dependencies needed as we're using functional updates

  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = "Project code is required (must be unique)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    if (!formData.address.trim()) {
      newErrors.address =
        "Please complete all address fields (district, ward, and specific address)";
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
        ...formData,
        numberOfBlocks: parseInt(formData.numberOfBlocks),
      };

      await axiosInstance.post("/api/projects", projectData);

      alert("Project created successfully!");
      navigate("/dashboard/projects");
    } catch (error) {
      console.error("Error creating project:", error);

      let errorMessage = "Failed to create project. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/projects");
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">Add New Project</h4>
            <p className="text-muted mb-0">
              Create a new project with detailed information
            </p>
          </div>
          <Button
            variant="outline-secondary"
            onClick={handleCancel}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Projects
          </Button>
        </div>

        {/* Form */}
        <div className="row">
          <div className="col-12">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="mb-4">
                <h6 className="text-muted mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Basic Information
                </h6>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Input
                      label="Project Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter project code (must be unique)"
                      required
                      error={errors.code}
                      icon="bi bi-code-slash"
                    />
                  </div>

                  <div className="col-md-4 mb-3">
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
                    />
                  </div>

                  <div className="col-md-4 mb-3">
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
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <AddressSelector
                    label="Address"
                    value={formData.address}
                    onChange={handleAddressChange}
                    required
                    error={errors.address}
                    icon="bi bi-geo-alt"
                  />
                  <small className="text-muted">
                    <i className="bi bi-info-circle me-1"></i>
                    Please complete all 3 steps: select district, ward, and
                    enter specific address
                  </small>
                </div>

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
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="bi bi-card-text me-2"></i>
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter project description..."
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex gap-3 justify-content-end pt-3 border-top">
                <Button
                  variant="outline-secondary"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="px-4"
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Cancel
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
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Project
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

export default CreateProject;
