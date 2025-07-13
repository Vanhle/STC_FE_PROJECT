import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import districtData from "../../data/district.json";

const ProjectManagement = () => {
  const [searchValues, setSearchValues] = useState({
    name: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  // Mock data - thay thế bằng API call thực tế
  const mockProjects = [
    {
      id: "#AHGA68",
      name: "Dự án siêu đô thị Vinhomes Smart City",
      address: "Tây Mỗ, Nam Từ Liêm, Hà Nội",
      district: "Nam Từ Liêm",
      status: "Hiển thị",
      updateAt: "20/03/2025",
    },
    {
      id: "#AHGA69",
      name: "Chung cư The Manor Central Park",
      address: "Hoàng Mai, Hà Nội",
      district: "Hoàng Mai",
      status: "Ẩn",
      updateAt: "19/03/2025",
    },
    {
      id: "#AHGA70",
      name: "Khu đô thị Ecopark",
      address: "Văn Giang, Hưng Yên",
      district: "Hà Đông",
      status: "Hiển thị",
      updateAt: "18/03/2025",
    },
    {
      id: "#AHGA71",
      name: "Times City Park Hill",
      address: "Hai Bà Trưng, Hà Nội",
      district: "Hai Bà Trưng",
      status: "Hiển thị",
      updateAt: "17/03/2025",
    },
    {
      id: "#AHGA72",
      name: "Royal City",
      address: "Thanh Xuân, Hà Nội",
      district: "Thanh Xuân",
      status: "Ẩn",
      updateAt: "16/03/2025",
    },
    {
      id: "#AHGA73",
      name: "Chung cư Goldmark City",
      address: "Bắc Từ Liêm, Hà Nội",
      district: "Bắc Từ Liêm",
      status: "Hiển thị",
      updateAt: "15/03/2025",
    },
    {
      id: "#AHGA74",
      name: "Khu đô thị Ciputra",
      address: "Tây Hồ, Hà Nội",
      district: "Tây Hồ",
      status: "Ẩn",
      updateAt: "14/03/2025",
    },
  ];

  // Search form configuration - Thêm status search
  const searchFields = [
    {
      name: "name",
      placeholder: "Tìm theo tên dự án...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Tên dự án",
    },
    {
      name: "status",
      type: "singleselect",
      placeholder: "Chọn trạng thái...",
      colSize: 6,
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
      label: "Project ID",
      width: "120px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Tên dự án",
      width: "250px",
    },
    {
      key: "address",
      label: "Địa chỉ",
      width: "300px",
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
    {
      key: "updateAt",
      label: "Cập nhật",
      width: "120px",
    },
  ];

  // Load data effect
  useEffect(() => {
    loadProjects();
  }, [currentPage, searchValues]);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter projects based on search values
      let filteredProjects = mockProjects;

      // Filter by name
      if (searchValues.name) {
        filteredProjects = filteredProjects.filter((p) =>
          p.name.toLowerCase().includes(searchValues.name.toLowerCase())
        );
      }

      // Filter by status
      if (searchValues.status) {
        filteredProjects = filteredProjects.filter(
          (p) => p.status === searchValues.status
        );
      }

      setProjects(filteredProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
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
    setCurrentPage(1); // Reset to first page when searching
    loadProjects();
  };

  const handleReset = () => {
    setSearchValues({
      name: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleView = (project) => {
    console.log("View project:", project);
    // Navigate to project detail page
  };

  const handleEdit = (project) => {
    console.log("Edit project:", project);
    // Navigate to project edit page
  };

  const handleDelete = (project) => {
    console.log("Delete project:", project);
    // Show confirmation modal and delete
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    console.log("Add new project");
    // Navigate to add project page
  };

  return (
    <DashboardLayout title="PROJECT MANAGEMENT">
      {/* Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Quản lý dự án</h5>
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
          Thêm dự án
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
        data={projects}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy dự án nào"
      />

      {/* Pagination */}
      {projects.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(projects.length / 10)} // Use filtered results for pagination
          totalItems={projects.length}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};

export default ProjectManagement;
