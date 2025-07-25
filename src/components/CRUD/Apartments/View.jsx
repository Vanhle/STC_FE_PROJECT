import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const ViewApartment = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    id: "",
    buildingId: "", // Add buildingId for backend update
    buildingName: "",
    code: "",
    name: "",
    atFloor: "",
    totalArea: "",
    price: "",
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

  // Format price for display
  const formatPrice = (price) => {
    if (!price) return "0";
    return (price / 1000000000).toFixed(2);
  };

  // Reusable function to fetch and format apartment data
  const fetchAndFormatApartmentData = async () => {
    if (!isAuthenticated()) {
      alert("Authentication required. Please log in again.");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/apartments/${id}`);
      console.log("API Response:", response.data); // Debug log

      // Handle different response structures
      const apartment = response.data.data || response.data;

      if (!apartment) {
        throw new Error("Apartment data not found in response");
      }

      console.log("Apartment object:", apartment); // Debug log
      console.log(
        "BuildingId from API:",
        apartment.buildingId || apartment.building?.id
      ); // Debug log

      // Extract buildingId and buildingName from API response
      const buildingId = apartment.buildingId?.toString() || "";
      const buildingName = apartment.buildingName || "";

      console.log("Apartment response:", apartment); // Debug log
      console.log("Extracted buildingId:", buildingId); // Debug log
      console.log("Extracted buildingName:", buildingName); // Debug log

      const formattedData = {
        id: apartment.id || "",
        buildingId: buildingId,
        buildingName: buildingName,
        code: apartment.code || "",
        name: apartment.name || "",
        atFloor: apartment.atFloor?.toString() || "",
        totalArea: apartment.totalArea?.toString() || "",
        price: formatPrice(apartment.price),
        active: apartment.active === 1 ? "Active" : "Inactive",
        deletedAt: apartment.deletedAt
          ? formatDateTime(apartment.deletedAt)
          : "N/A",
        deactivatedAt: apartment.deactivatedAt
          ? formatDateTime(apartment.deactivatedAt)
          : "N/A",
        createdAt: formatDateTime(apartment.createdAt),
        updatedAt: formatDateTime(apartment.updatedAt),
        createdBy: apartment.createdBy || "N/A",
        updatedBy: apartment.updatedBy || "N/A",
      };

      setFormData(formattedData);
      return formattedData;
    } catch (error) {
      console.error("Error fetching apartment:", error);
      let errorMessage = "Failed to load apartment data.";
      alert(errorMessage);
      navigate("/dashboard/apartments");
      throw error;
    }
  };

  // Fetch apartment data when component mounts
  useEffect(() => {
    const fetchApartment = async () => {
      if (id) {
        try {
          setIsFetching(true);
          await fetchAndFormatApartmentData();
        } finally {
          setIsFetching(false);
        }
      }
    };

    fetchApartment();
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

    if (!formData.buildingId) {
      newErrors.buildingId = "Building ID is missing. Please reload the page.";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Apartment code is required";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Apartment name is required";
    }

    if (!formData.atFloor || formData.atFloor <= 0) {
      newErrors.atFloor = "Floor must be greater than 0";
    }

    if (!formData.totalArea || formData.totalArea <= 0) {
      newErrors.totalArea = "Total area must be greater than 0";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
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
      // Validate buildingId before sending
      if (!formData.buildingId || isNaN(parseInt(formData.buildingId))) {
        alert(
          "Missing or invalid building information. Please reload the page and try again."
        );
        return;
      }

      const apartmentData = {
        buildingId: parseInt(formData.buildingId), // Convert buildingName -> buildingId for backend
        code: formData.code,
        name: formData.name,
        atFloor: parseInt(formData.atFloor),
        totalArea: parseFloat(formData.totalArea),
        price: parseFloat(formData.price) * 1000000000, // Convert back to original value
      };

      console.log(
        "FormData buildingId (from buildingName):",
        formData.buildingId
      ); // Debug log
      console.log("FormData buildingName:", formData.buildingName); // Debug log
      console.log("Converted buildingId:", parseInt(formData.buildingId)); // Debug log
      console.log("Final apartment data for backend:", apartmentData); // Debug log

      const response = await axiosInstance.put(
        `/api/apartments/${id}`,
        apartmentData
      );

      console.log("Update response:", response); // Debug log
      alert("Apartment updated successfully!");
      setIsEditMode(false);

      // Re-fetch fresh data using the reusable function
      await fetchAndFormatApartmentData();
    } catch (error) {
      console.error("Error updating apartment:", error);
      let errorMessage = "Failed to update apartment. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/apartments");
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
              <p className="text-muted">Loading apartment data...</p>
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
              {isEditMode ? "Edit Apartment" : "Apartment Details"}
            </h4>
            <p className="text-muted mb-0">
              {isEditMode
                ? "Modify apartment information"
                : "View complete apartment information"}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              className="d-flex align-items-center gap-2"
            >
              <i className="bi bi-arrow-left"></i>
              Back to Apartments
            </Button>
            {!isEditMode && (
              <Button
                variant="outline-primary"
                onClick={handleEditToggle}
                className="d-flex align-items-center gap-2"
              >
                <i className="bi bi-pencil"></i>
                Edit Apartment
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
                      label="Apartment ID"
                      type="text"
                      name="id"
                      value={formData.id}
                      onChange={handleInputChange}
                      placeholder="Apartment ID"
                      disabled={true}
                      icon="bi bi-hash"
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Building Name"
                      type="text"
                      name="buildingName"
                      value={formData.buildingName}
                      onChange={handleInputChange}
                      placeholder="Building Name"
                      disabled={true}
                      icon="bi bi-buildings"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <Input
                      label="Apartment Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder="Enter apartment code"
                      required
                      error={errors.code}
                      icon="bi bi-code-slash"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <Input
                      label="Apartment Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter apartment name"
                      required
                      error={errors.name}
                      icon="bi bi-door-open"
                      disabled={!isEditMode}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <Input
                      label="Floor"
                      type="number"
                      name="atFloor"
                      value={formData.atFloor}
                      onChange={handleInputChange}
                      placeholder="Enter floor number"
                      required
                      min="1"
                      error={errors.atFloor}
                      icon="bi bi-layers"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Total Area (m²)"
                      type="number"
                      name="totalArea"
                      value={formData.totalArea}
                      onChange={handleInputChange}
                      placeholder="Enter total area"
                      required
                      min="0.1"
                      step="0.1"
                      error={errors.totalArea}
                      icon="bi bi-aspect-ratio"
                      disabled={!isEditMode}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Price (billion VND)"
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Enter price in billion VND"
                      required
                      min="0.01"
                      step="0.01"
                      error={errors.price}
                      icon="bi bi-currency-dollar"
                      disabled={!isEditMode}
                    />
                  </div>
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

export default ViewApartment;
