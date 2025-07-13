import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";

const BuildingManagement = () => {
  const [searchValues, setSearchValues] = useState({
    projectName: "",
    buildingName: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);

  // Mock data - thay thế bằng API call thực tế
  const mockBuildings = [
    {
      id: "#BLD001",
      projectName: "Vinhomes Smart City",
      buildingName: "Tòa nhà A1",
      basementFloors: 2,
      floors: 25,
      apartments: 480,
      status: "Hiển thị",
      updateAt: "22/03/2025",
    },
    {
      id: "#BLD002",
      projectName: "Times City Park Hill",
      buildingName: "Tòa nhà B2",
      basementFloors: 3,
      floors: 30,
      apartments: 600,
      status: "Ẩn",
      updateAt: "21/03/2025",
    },
    {
      id: "#BLD003",
      projectName: "Royal City",
      buildingName: "Tòa nhà C3",
      basementFloors: 2,
      floors: 28,
      apartments: 560,
      status: "Hiển thị",
      updateAt: "20/03/2025",
    },
    {
      id: "#BLD004",
      projectName: "Khu đô thị Ecopark",
      buildingName: "Tòa nhà D4",
      basementFloors: 1,
      floors: 20,
      apartments: 400,
      status: "Hiển thị",
      updateAt: "19/03/2025",
    },
    {
      id: "#BLD005",
      projectName: "Chung cư Goldmark City",
      buildingName: "Tòa nhà E5",
      basementFloors: 2,
      floors: 32,
      apartments: 640,
      status: "Ẩn",
      updateAt: "18/03/2025",
    },
  ];

  // Search form configuration
  const searchFields = [
    {
      name: "projectName",
      placeholder: "Tìm theo tên dự án...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Tên dự án",
    },
    {
      name: "buildingName",
      placeholder: "Tìm theo tên tòa nhà...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Tên tòa nhà",
    },
    {
      name: "status",
      type: "singleselect",
      placeholder: "Chọn trạng thái...",
      colSize: 4,
      label: "Trạng thái",
      options: [
        { value: "", label: "Tất cả trạng thái" },
        { value: "Hiển thị", label: "👁️ Hiển thị" },
        { value: "Ẩn", label: "🚫 Ẩn" },
      ],
    },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: "id",
      label: "Building ID",
      width: "120px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "projectName",
      label: "Tên dự án",
      width: "180px",
    },
    {
      key: "buildingName",
      label: "Tên tòa nhà",
      width: "150px",
    },
    {
      key: "basementFloors",
      label: "Số tầng hầm",
      width: "100px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "floors",
      label: "Số tầng",
      width: "80px",
      render: (value) => <span className="badge bg-info">{value}</span>,
    },
    {
      key: "apartments",
      label: "Số căn hộ",
      width: "90px",
      render: (value) => <span className="badge bg-primary">{value}</span>,
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "100px",
      render: (value) => {
        const statusClass =
          value === "Hiển thị" ? "bg-success" : "bg-secondary";
        const statusIcon =
          value === "Hiển thị" ? "bi bi-eye" : "bi bi-eye-slash";
        return (
          <span
            className={`badge ${statusClass} d-flex align-items-center gap-1`}
            style={{ width: "fit-content" }}
          >
            <i className={statusIcon} style={{ fontSize: "12px" }}></i>
            {value}
          </span>
        );
      },
    },
  ];

  // Load data effect
  useEffect(() => {
    loadBuildings();
  }, [currentPage, searchValues]);

  const loadBuildings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter buildings based on search values
      let filteredBuildings = mockBuildings;

      if (searchValues.projectName) {
        filteredBuildings = filteredBuildings.filter((b) =>
          b.projectName
            .toLowerCase()
            .includes(searchValues.projectName.toLowerCase())
        );
      }

      if (searchValues.buildingName) {
        filteredBuildings = filteredBuildings.filter((b) =>
          b.buildingName
            .toLowerCase()
            .includes(searchValues.buildingName.toLowerCase())
        );
      }

      if (searchValues.status) {
        filteredBuildings = filteredBuildings.filter(
          (b) => b.status === searchValues.status
        );
      }

      setBuildings(filteredBuildings);
    } catch (error) {
      console.error("Error loading buildings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFieldChange = (fieldName, value) => {
    setSearchValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSearch = (values) => {
    setCurrentPage(1);
    loadBuildings();
  };

  const handleReset = () => {
    setSearchValues({
      projectName: "",
      buildingName: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleView = (building) => {
    console.log("View building:", building);
  };

  const handleEdit = (building) => {
    console.log("Edit building:", building);
  };

  const handleDelete = (building) => {
    console.log("Delete building:", building);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    console.log("Add new building");
    // Navigate to add building page
  };

  return (
    <DashboardLayout title="BUILDING MANAGEMENT">
      {/* Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Quản lý tòa nhà</h5>
        <button
          className="btn btn-primary"
          onClick={handleAdd}
          style={{
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 16px",
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Thêm tòa nhà
        </button>
      </div>

      {/* Search Form */}
      <SearchForm
        fields={searchFields}
        values={searchValues}
        onFieldChange={handleSearchFieldChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Data Table */}
      <DataTable
        columns={tableColumns}
        data={buildings}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy tòa nhà nào"
      />

      {/* Pagination */}
      {buildings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(mockBuildings.length / 10)}
          totalItems={mockBuildings.length}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};

export default BuildingManagement;
