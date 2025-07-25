import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../Layout/DashboardLayout";
import Input from "../../Common/Input";
import Button from "../../Common/Button";
import SingleSelect from "../../Common/SingleSelect";
import axiosInstance from "../../../api/axiosInstance";
import { isAuthenticated } from "../../../utils/authUtils";

const CreateApartment = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [buildings, setBuildings] = useState([]);

  const [formData, setFormData] = useState({
    buildingId: "",
    code: "",
    name: "",
    atFloor: "",
    totalArea: "",
    price: "",
    description: "",
  });

  // xử lý việc chuyển đổi response data thành array
  const normalizeToArray = (data) => {
    // Kiểm tra nếu data đã là array thì trả về luôn
    if (Array.isArray(data)) return data;

    // Kiểm tra nếu data tồn tại và là object
    if (data && typeof data === "object") {
      //  Tạo array chứa các thuộc tính có thể chứa data dạng array từ response
      const possibleArrays = [data.content];

      for (const arr of possibleArrays) {
        if (Array.isArray(arr)) return arr;
      }

      // Fallback to object values
      return Object.values(data);
    }

    return [];
  };

  // Fetch buildings for dropdown
  useEffect(() => {
    const fetchBuildings = async () => {
      try {
        if (!isAuthenticated()) {
          alert("Authentication required. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axiosInstance.get(
          "/api/buildings/search?query=active==1"
        );

        // Lấy data từ response và chuyển đổi data thành array
        const buildingData = response.data.data || response.data;
        const buildingArray = normalizeToArray(buildingData);

        // Kiểm tra nếu data không phải là array hoặc không có dữ liệu
        if (!Array.isArray(buildingArray) || buildingArray.length === 0) {
          console.warn("No buildings found or invalid data format");
          setBuildings([]);
          return;
        }

        // Transform array thành format mà SingleSelect component yêu cầu (value/label pairs)
        const formattedBuildings = buildingArray.map((building) => ({
          value: building.id,
          label: building.code,
        }));

        setBuildings(formattedBuildings);
      } catch (error) {
        console.error("Error fetching buildings:", error);
        alert("Failed to load buildings. Please refresh the page.");
        setBuildings([]);
      }
    };

    fetchBuildings();
  }, [navigate]);

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
      newErrors.buildingId = "Building is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Apartment code is required (must be unique)";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Apartment name is required";
    }

    if (
      !formData.atFloor ||
      isNaN(formData.atFloor) ||
      Number(formData.atFloor) <= 0
    ) {
      newErrors.atFloor = "Floor must be a number greater than 0";
    }

    if (
      !formData.totalArea ||
      isNaN(formData.totalArea) ||
      Number(formData.totalArea) <= 0
    ) {
      newErrors.totalArea = "Total area must be a number greater than 0";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a number greater than 0";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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
      const apartmentData = {
        buildingId: parseInt(formData.buildingId),
        code: formData.code,
        name: formData.name,
        atFloor: parseInt(formData.atFloor),
        totalArea: parseFloat(formData.totalArea),
        price: parseFloat(formData.price) * 1000000000, // Convert billion to actual value
        description: formData.description,
      };

      await axiosInstance.post("/api/apartments", apartmentData);

      alert("Apartment created successfully!");
      navigate("/dashboard/apartments");
    } catch (error) {
      console.error("Error creating apartment:", error);
      let errorMessage = "Failed to create apartment. Please try again.";
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard/apartments");
  };

  // Get building code from selected building
  const selectedBuilding = buildings.find(
    (building) => building.value === formData.buildingId
  );
  const buildingCode = selectedBuilding ? selectedBuilding.label : "";

  return (
    <DashboardLayout>
      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="text-primary mb-1">Add New Apartment</h4>
            <p className="text-muted mb-0">
              Create a new apartment with detailed information
            </p>
          </div>
          <Button
            variant="outline-secondary"
            onClick={handleCancel}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-arrow-left"></i>
            Back to Apartments
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
                      label="Building Code"
                      value={formData.buildingId}
                      onChange={(value) => {
                        setFormData((prev) => ({ ...prev, buildingId: value }));
                        // Clear error when user selects building
                        if (errors.buildingId) {
                          setErrors((prev) => ({ ...prev, buildingId: "" }));
                        }
                      }}
                      options={buildings}
                      placeholder="Select a building code"
                      required
                      error={errors.buildingId}
                      icon="bi bi-buildings"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-12 mb-3">
                    <Input
                      label="Apartment Code"
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={
                        buildingCode
                          ? `Must be unique and contain Building code ( example: ${buildingCode} APT1 )`
                          : "Enter apartment code ( Must be unique and contain Building code )"
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
                      label="Apartment Name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={`Enter apartment name ( example: Căn hộ 2 - ${buildingCode} )`}
                      required
                      error={errors.name}
                      icon="bi bi-door-open"
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
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <Input
                      label="Total Area (m²)"
                      type="number"
                      name="totalArea"
                      value={formData.totalArea}
                      onChange={handleInputChange}
                      placeholder="Enter total area (m²)"
                      required
                      error={errors.totalArea}
                      icon="bi bi-aspect-ratio"
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
                      error={errors.price}
                      icon="bi bi-currency-dollar"
                    />
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
                    placeholder="Enter apartment description (e.g., Căn hộ 4PN, tầng 4, nội thất sang trọng, vị trí đẹp)..."
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "14px",
                      resize: "vertical",
                    }}
                  />
                  {errors.description && (
                    <div className="invalid-feedback d-block">
                      {errors.description}
                    </div>
                  )}
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
                      Create Apartment
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

export default CreateApartment;
