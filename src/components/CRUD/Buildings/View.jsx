import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const ViewBuilding = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    projectId: "", // Add projectId for backend update
    projectName: "",
    code: "",
    name: "",
    numberOfBasements: "",
    numberOfLivingFloors: "",
    numberOfApartments: "",
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

  // Reusable function to fetch and format building data
  const fetchAndFormatBuildingData = async () => {
    if (!isAuthenticated()) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/buildings/${id}`);
      console.log("API Response:", response.data); // Debug log

      // Handle different response structures
      const building = response.data.data || response.data;

      if (!building) {
        throw new Error("Building data not found in response");
      }

      console.log("Building object:", building); // Debug log
      console.log(
        "ProjectId from API:",
        building.projectId || building.project?.id
      ); // Debug log

      // Extract projectId and projectName from API response
      const projectId = building.projectId?.toString() || "";
      const projectName = building.projectName || "";

      console.log("Building response:", building); // Debug log
      console.log("Extracted projectId:", projectId); // Debug log
      console.log("Extracted projectName:", projectName); // Debug log

      const formattedData = {
        id: building.id || "",
        projectId: projectId,
        projectName: projectName,
        code: building.code || "",
        name: building.name || "",
        numberOfBasements: building.numberOfBasements?.toString() || "",
        numberOfLivingFloors: building.numberOfLivingFloors?.toString() || "",
        numberOfApartments: building.numberOfApartments?.toString() || "",
        description: building.description || "",
        active: building.active === 1 ? "Active" : "Inactive",
        deletedAt: building.deletedAt
          ? formatDateTime(building.deletedAt)
          : "N/A",
        deactivatedAt: building.deactivatedAt
          ? formatDateTime(building.deactivatedAt)
          : "N/A",
        createdAt: formatDateTime(building.createdAt),
        updatedAt: formatDateTime(building.updatedAt),
        createdBy: building.createdBy || "N/A",
        updatedBy: building.updatedBy || "N/A",
      };

      setFormData(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching building:", error);
      let errorMessage = "Failed to load building data.";
      alert(errorMessage);
      navigate("/dashboard/buildings");
      throw error;
    }
  };

  // Fetch building data when component mounts
  useEffect(() => {
    const fetchBuilding = async () => {
      if (id) {
        try {
          setIsFetching(true);
          await fetchAndFormatBuildingData();
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchBuilding();
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

    if (!formData.projectId) {
      newErrors.projectId = "Project ID is missing. Please reload the page.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Building code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Building name is required";
    }

    if (!formData.numberOfBasements || formData.numberOfBasements < 0) {
      newErrors.numberOfBasements = "Number of basements must be 0 or greater";
    }

    if (!formData.numberOfLivingFloors || formData.numberOfLivingFloors <= 0) {
      newErrors.numberOfLivingFloors =
        "Number of living floors must be greater than 0";
    }

    if (!formData.numberOfApartments || formData.numberOfApartments <= 0) {
      newErrors.numberOfApartments =
        "Number of apartments must be greater than 0";
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
      // Validate projectId before sending
      if (!formData.projectId || isNaN(parseInt(formData.projectId))) {
        alert(
          "Missing or invalid project information. Please reload the page and try again."
        );
        return;
      }

      const buildingData = {
        projectId: parseInt(formData.projectId), // Convert projectName -> projectId for backend
        code: formData.code,
        name: formData.name,
        numberOfBasements: parseInt(formData.numberOfBasements),
        numberOfLivingFloors: parseInt(formData.numberOfLivingFloors),
        numberOfApartments: parseInt(formData.numberOfApartments),
        description: formData.description,
      };

      console.log("FormData projectId (from projectName):", formData.projectId); // Debug log
      console.log("FormData projectName:", formData.projectName); // Debug log
      console.log("Converted projectId:", parseInt(formData.projectId)); // Debug log
      console.log("Final building data for backend:", buildingData); // Debug log

      const response = await axiosInstance.put(
        `/api/buildings/${id}`,
        buildingData
      );

      console.log("Update response:", response); // Debug log
      alert("Building updated successfully!");
      setIsEditMode(false);

      // Re-fetch fresh data using the reusable function
      await fetchAndFormatBuildingData();
    } catch (error) {
      console.error("Error updating building:", error);
      let errorMessage = "Failed to update building. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/buildings");
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
              <p className="text-muted">Loading building data...</p>
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
              {isEditMode ? "Edit Building" : "Building Details"}
            </h4>
            <p className="text-muted mb-0">
              {isEditMode
                ? "Modify building information"
                : "View complete building information"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              className="d-flex align-items-center gap-2"
            >
              <i className="bi bi-arrow-left"></i>
              Back to Buildings
            </Button>
            {!isEditMode && (
              <Button
                variant="outline-primary"
                onClick={handleEditToggle}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-pencil"></i>
                Edit Building
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
                  <div className="col-md-6 mb-3">
                    <Input
                      label="Building ID"
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Building ID"
                      disabled={true}
                      icon="bi bi-hash"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Project Name"
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Project Name"
                      disabled={true}
                      icon="bi bi-building-gear"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Input
                      label="Building Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter building code"
                      required
                      error={errors.code}
                      icon="bi bi-code-slash"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Building Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter building name"
                      required
                      error={errors.name}
                      icon="bi bi-buildings"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Input
                      label="Number of Basements"
                      type="number"
                      name="numberOfBasements"
                      value={formData.numberOfBasements}
                      onChange={handleInputChange}
                      placeholder="Enter number of basements"
                      required
                      min="0"
                      error={errors.numberOfBasements}
                      icon="bi bi-arrow-down-circle"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Number of Living Floors"
                      type="number"
                      name="numberOfLivingFloors"
                      value={formData.numberOfLivingFloors}
                      onChange={handleInputChange}
                      placeholder="Enter number of living floors"
                      required
                      min="1"
                      error={errors.numberOfLivingFloors}
                      icon="bi bi-arrow-up-circle"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Number of Apartments"
                      type="number"
                      name="numberOfApartments"
                      value={formData.numberOfApartments}
                      onChange={handleInputChange}
                      placeholder="Enter number of apartments"
                      required
                      min="1"
                      error={errors.numberOfApartments}
                      icon="bi bi-door-open"
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
                    placeholder="Enter building description..."
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

export default ViewBuilding;
