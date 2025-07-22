import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";

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
  const [totalApartments, setTotalApartments] = useState(0);

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
        { value: "1", label: "👁️ Hiển thị" },
        { value: "0", label: "🚫 Ẩn" },
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

  // Table columns configuration - updated for database structure
  const tableColumns = [
    {
      key: "code",
      label: "Apartment Code",
      width: "140px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "buildingName",
      label: "Tên tòa nhà",
      width: "180px",
    },
    {
      key: "name",
      label: "Tên căn hộ",
      width: "160px",
      render: (value) => <span className="fw-semibold">{value}</span>,
    },
    {
      key: "atFloor",
      label: "Tầng",
      width: "55px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "totalArea",
      label: "Diện tích",
      width: "80px",
      render: (value) => (
        <span className="badge bg-info">{value?.toFixed(1)}m²</span>
      ),
    },
    {
      key: "price",
      label: "Giá",
      width: "100px",
      render: (value) => (
        <span className="fw-semibold text-success">
          {(value / 1000000000)?.toFixed(2)} tỷ
        </span>
      ),
    },
    {
      key: "active",
      label: "Trạng thái",
      width: "90px",
      render: (value) => {
        const isActive = value === 1;
        const statusClass = isActive ? "bg-success" : "bg-secondary";
        const statusIcon = isActive ? "bi bi-eye" : "bi bi-eye-slash";
        const statusText = isActive ? "Hiển thị" : "Ẩn";
        return (
          <span
            className={`badge ${statusClass} d-flex align-items-center gap-1`}
            style={{ width: "fit-content" }}
          >
            <i className={statusIcon} style={{ fontSize: "12px" }}></i>
            {statusText}
          </span>
        );
      },
    },
  ];

  // Load data effect
  useEffect(() => {
    loadApartments();
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    let query = "";
    if (searchValues.buildingName) {
      query += `building.name=="*${searchValues.buildingName}*"`;
    }
    if (searchValues.apartmentName) {
      query += `name=="*${searchValues.apartmentName}*"`;
    }
    if (searchValues.areaMin) {
      query += `areaMin>=${searchValues.areaMin}`;
    }
    if (searchValues.areaMax) {
      query += `areaMax<=${searchValues.areaMax}`;
    }
    if (searchValues.priceMin) {
      query += `priceMin>=${searchValues.priceMin}`;
    }
    if (searchValues.priceMax) {
      query += `priceMax<=${searchValues.priceMax}`;
    }
    if (searchValues.status) {
      query += `status==${searchValues.status}`;
    }
    return query;
  };

  const loadApartments = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("authToken");
      const expiredAt = localStorage.getItem("tokenExpiredAt");

      if (!token || !expiredAt || Date.now() >= Number(expiredAt)) {
        console.error("Authentication required");
        setApartments([]);
        setTotalApartments(0);
        return;
      }

      // API call to get apartments
      const response = await axiosInstance.get(
        "http://localhost:8080/api/apartments/search?query=" + generateQuery(),
        {
          params: {
            page: currentPage - 1, // Backend thường dùng 0-based pagination
            size: 10,
            buildingName: searchValues.buildingName || undefined,
            apartmentName: searchValues.apartmentName || undefined,
            areaMin: searchValues.areaMin || undefined,
            areaMax: searchValues.areaMax || undefined,
            priceMin: searchValues.priceMin
              ? searchValues.priceMin * 1000000000
              : undefined, // Convert tỷ to VND
            priceMax: searchValues.priceMax
              ? searchValues.priceMax * 1000000000
              : undefined,
            active:
              searchValues.status !== ""
                ? parseInt(searchValues.status)
                : undefined,
          },
        }
      );

      // Kiểm tra nhiều format response có thể có
      if (response.data) {
        setApartments(response.data.content);
        setTotalApartments(response.data.totalElements);
      } else {
        // No data received
        setApartments([]);
        setTotalApartments(0);
      }
    } catch (error) {
      console.error("Error loading apartments:", error);
      setApartments([]);
      setTotalApartments(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFieldChange = (fieldName, value) => {
    setCurrentPage(1);
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
      {/* Authentication Warning */}
      {(!localStorage.getItem("authToken") ||
        !localStorage.getItem("tokenExpiredAt") ||
        Date.now() >= Number(localStorage.getItem("tokenExpiredAt"))) && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Yêu cầu đăng nhập:</strong> Bạn cần đăng nhập để xem dữ liệu
          căn hộ.
          <a href="/login" className="alert-link ms-2">
            Đăng nhập ngay
          </a>
        </div>
      )}

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
        emptyMessage={
          !localStorage.getItem("authToken") ||
          !localStorage.getItem("tokenExpiredAt") ||
          Date.now() >= Number(localStorage.getItem("tokenExpiredAt"))
            ? "Vui lòng đăng nhập để xem dữ liệu căn hộ"
            : "Không tìm thấy căn hộ nào phù hợp với tiêu chí tìm kiếm"
        }
      />

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalApartments / 10)}
        totalItems={totalApartments}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default ApartmentManagement;
