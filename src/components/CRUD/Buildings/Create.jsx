import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import SingleSelect from "../../Common/SingleSelect";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const CreateBuilding = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [projects, setProjects] = useState([]);

  const [formData, setFormData] = useState({
    projectId: "",
    code: "",
    name: "",
    numberOfBasements: "",
    numberOfLivingFloors: "",
    numberOfApartments: "",
    description: "",
  });

  // xử lý việc chuyển đổi response data thành array
  const normalizeToArray = (data) => {
    // Kiểm tra nếu data đã là array thì trả về luôn
    if (Array.isArray(data)) return data;

    // Kiểm tra nếu data tồn tại và là object
    if (data && typeof data === "object") {
      // Tạo array chứa các thuộc tính có thể chứa data dạng array từ response
      const possibleArrays = [data.content];

      for (const arr of possibleArrays) {
        if (Array.isArray(arr)) return arr;
      }

      // Fallback to object values
      return Object.values(data);
    }

    return [];
  };

  // Fetch projects for dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!isAuthenticated()) {
          alert("Authentication required. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get(
          "/api/projects/search?query=active==1"
        );

        // Lấy data từ response và chuyển đổi data thành array
        const projectData = response.data.data || response.data;
        const projectArray = normalizeToArray(projectData);

        // Kiểm tra nếu data không phải là array hoặc không có dữ liệu
        if (!Array.isArray(projectArray) || projectArray.length === 0) {
          console.warn("No projects found or invalid data format");
          setProjects([]);
          return;
        }

        // Transform array thành format mà SingleSelect component yêu cầu (value/label pairs)
        const formattedProjects = projectArray.map((project) => ({
          value: project.id,
          label: project.code,
        }));

        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        alert("Failed to load projects. Please refresh the page.");
        setProjects([]);
      }
    };

    fetchProjects();
  }, [navigate]);

  // Get project code from combobox value
  const selectedProject = projects.find(
    (project) => project.value === formData.projectId
  );
  const projectCode = selectedProject ? selectedProject.label : "";

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

  // Handle combobox/dropdown changes
  const handleComboboxChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));

    // Clear error when user selects option
    if (errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Building code is required (must be unique)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Building name is required";
    }

    if (
      !formData.numberOfBasements ||
      isNaN(formData.numberOfBasements) ||
      formData.numberOfBasements < 0
    ) {
      newErrors.numberOfBasements =
        "Number of basements must be a number greater than 0";
    }

    if (
      !formData.numberOfLivingFloors ||
      isNaN(formData.numberOfLivingFloors) ||
      formData.numberOfLivingFloors <= 0
    ) {
      newErrors.numberOfLivingFloors =
        "Number of living floors must be a number greater than 0";
    }

    if (
      !formData.numberOfApartments ||
      isNaN(formData.numberOfApartments) ||
      formData.numberOfApartments <= 0
    ) {
      newErrors.numberOfApartments =
        "Number of apartments must be a number greater than 0";
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
      const buildingData = {
        ...formData,
        projectId: parseInt(formData.projectId),
        numberOfBasements: parseInt(formData.numberOfBasements),
        numberOfLivingFloors: parseInt(formData.numberOfLivingFloors),
        numberOfApartments: parseInt(formData.numberOfApartments),
      };

      await axiosInstance.post("/api/buildings", buildingData);

      alert("Building created successfully!");
      navigate("/dashboard/buildings");
    } catch (error) {
      console.error("Error creating building:", error);
      let errorMessage = "Failed to create building. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/buildings");
  };

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">Add New Building</h4>
            <p className="text-muted mb-0">
              Create a new building with detailed information
            </p>
          </div>
          <Button
            variant="outline-secondary"
            onClick={handleCancel}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Buildings
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
                  <div className="col-md-12 mb-3">
                    <SingleSelect
                      label="Project Code"
                      value={formData.projectId}
                      onChange={(value) =>
                        handleComboboxChange("projectId", value)
                      }
                      options={projects}
                      placeholder="Select a project code"
                      required
                      error={errors.projectId}
                      icon="bi bi-building-gear"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <Input
                      label="Building Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={
                        projectCode
                          ? `Must be unique and contain Project code (example: ${projectCode} B1)`
                          : "Enter building code (Must be unique and contain Project code)"
                      }
                      required
                      error={errors.code}
                      icon="bi bi-code-slash"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <Input
                      label="Building Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={`Must be unique ( example: Tòa nhà B1 - ${projectCode} )`}
                      required
                      error={errors.name}
                      icon="bi bi-buildings"
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
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter building description..."
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
                      Create Building
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

export default CreateBuilding;
