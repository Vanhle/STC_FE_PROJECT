import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";

const ApartmentManagement = () => {
  const [searchValues, setSearchValues] = useState({
    buildingName: "",
    apartmentName: "",
    areaMin: "",
    areaMax: "",
    priceMin: "",
    priceMax: "",
    status: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apartments, setApartments] = useState([]);

  // Mock data - thay thế bằng API call thực tế
  const mockApartments = [
    {
      id: "#APT001",
      buildingName: "Tòa nhà A1",
      apartmentName: "A1-1201",
      floor: 12,
      area: 85, // m²
      price: 2.8, // tỷ đồng
      status: "Hiển thị",
      updateAt: "25/03/2025",
    },
    {
      id: "#APT002",
      buildingName: "Tòa nhà B2",
      apartmentName: "B2-0801",
      floor: 8,
      area: 72,
      price: 2.1,
      status: "Ẩn",
      updateAt: "24/03/2025",
    },
    {
      id: "#APT003",
      buildingName: "Tòa nhà C3",
      apartmentName: "C3-1502",
      floor: 15,
      area: 95,
      price: 3.2,
      status: "Hiển thị",
      updateAt: "23/03/2025",
    },
    {
      id: "#APT004",
      buildingName: "Tòa nhà D4",
      apartmentName: "D4-0705",
      floor: 7,
      area: 68,
      price: 2.1,
      status: "Hiển thị",
      updateAt: "22/03/2025",
    },
    {
      id: "#APT005",
      buildingName: "Tòa nhà A1",
      apartmentName: "A1-0903",
      floor: 9,
      area: 78,
      price: 2.5,
      status: "Ẩn",
      updateAt: "21/03/2025",
    },
    {
      id: "#APT006",
      buildingName: "Tòa nhà E5",
      apartmentName: "E5-1101",
      floor: 11,
      area: 110,
      price: 4.2,
      status: "Hiển thị",
      updateAt: "20/03/2025",
    },
    {
      id: "#APT007",
      buildingName: "Tòa nhà B2",
      apartmentName: "B2-0505",
      floor: 5,
      area: 60,
      price: 1.8,
      status: "Hiển thị",
      updateAt: "19/03/2025",
    },
  ];

  // Search form configuration
  const searchFields = [
    {
      name: "buildingName",
      placeholder: "Tìm theo tên tòa nhà...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Tên tòa nhà",
    },
    {
      name: "apartmentName",
      placeholder: "Tìm theo tên căn hộ...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Tên căn hộ",
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
    {
      name: "areaMin",
      placeholder: "Từ (m²)",
      colSize: 3,
      type: "number",
      label: "Diện tích từ",
    },
    {
      name: "areaMax",
      placeholder: "Đến (m²)",
      colSize: 3,
      type: "number",
      label: "Diện tích đến",
    },
    {
      name: "priceMin",
      placeholder: "Từ (tỷ)",
      colSize: 3,
      type: "number",
      label: "Giá từ",
    },
    {
      name: "priceMax",
      placeholder: "Đến (tỷ)",
      colSize: 3,
      type: "number",
      label: "Giá đến",
    },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: "id",
      label: "Apartment ID",
      width: "110px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "buildingName",
      label: "Tên tòa nhà",
      width: "130px",
    },
    {
      key: "apartmentName",
      label: "Tên căn hộ",
      width: "110px",
      render: (value) => <span className="fw-semibold">{value}</span>,
    },
    {
      key: "floor",
      label: "Tầng",
      width: "55px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "area",
      label: "Diện tích",
      width: "80px",
      render: (value) => <span className="badge bg-info">{value}m²</span>,
    },
    {
      key: "price",
      label: "Giá",
      width: "85px",
      render: (value) => (
        <span className="fw-semibold text-success">{value} tỷ</span>
      ),
    },
    {
      key: "status",
      label: "Trạng thái",
      width: "90px",
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
    loadApartments();
  }, [currentPage, searchValues]);

  const loadApartments = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter apartments based on search values
      let filteredApartments = mockApartments;

      if (searchValues.buildingName) {
        filteredApartments = filteredApartments.filter((a) =>
          a.buildingName
            .toLowerCase()
            .includes(searchValues.buildingName.toLowerCase())
        );
      }

      if (searchValues.apartmentName) {
        filteredApartments = filteredApartments.filter((a) =>
          a.apartmentName
            .toLowerCase()
            .includes(searchValues.apartmentName.toLowerCase())
        );
      }

      // Filter by area range
      if (searchValues.areaMin && searchValues.areaMin !== "") {
        filteredApartments = filteredApartments.filter(
          (a) => a.area >= Number(searchValues.areaMin)
        );
      }

      if (searchValues.areaMax && searchValues.areaMax !== "") {
        filteredApartments = filteredApartments.filter(
          (a) => a.area <= Number(searchValues.areaMax)
        );
      }

      // Filter by price range
      if (searchValues.priceMin && searchValues.priceMin !== "") {
        filteredApartments = filteredApartments.filter(
          (a) => a.price >= Number(searchValues.priceMin)
        );
      }

      if (searchValues.priceMax && searchValues.priceMax !== "") {
        filteredApartments = filteredApartments.filter(
          (a) => a.price <= Number(searchValues.priceMax)
        );
      }

      if (searchValues.status) {
        filteredApartments = filteredApartments.filter(
          (a) => a.status === searchValues.status
        );
      }

      setApartments(filteredApartments);
    } catch (error) {
      console.error("Error loading apartments:", error);
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
    loadApartments();
  };

  const handleReset = () => {
    setSearchValues({
      buildingName: "",
      apartmentName: "",
      areaMin: "",
      areaMax: "",
      priceMin: "",
      priceMax: "",
      status: "",
    });
    setCurrentPage(1);
  };

  const handleView = (apartment) => {
    console.log("View apartment:", apartment);
  };

  const handleEdit = (apartment) => {
    console.log("Edit apartment:", apartment);
  };

  const handleDelete = (apartment) => {
    console.log("Delete apartment:", apartment);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    console.log("Add new apartment");
    // Navigate to add apartment page
  };

  return (
    <DashboardLayout title="APARTMENT MANAGEMENT">
      {/* Header with Add Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Quản lý căn hộ</h5>
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
          Thêm căn hộ
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
        data={apartments}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
        emptyMessage="Không tìm thấy căn hộ nào"
      />

      {/* Pagination */}
      {apartments.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(mockApartments.length / 10)}
          totalItems={mockApartments.length}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};

export default ApartmentManagement;
