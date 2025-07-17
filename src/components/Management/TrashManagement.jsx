import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";

const TrashManagement = () => {
  const [searchValues, setSearchValues] = useState({
    name: "",
    type: "",
    project: "",
    building: "",
    apartment: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [trashItems, setTrashItems] = useState([]);

  // Mock data cho thùng rác
  const mockTrashItems = [
    {
      id: "#PRJ001",
      name: "Dự án Vinhomes Ocean Park",
      type: "Project",
      project: "Vinhomes Ocean Park",
      building: "-",
      apartment: "-",
      deletedAt: "25/03/2025",
      deletedBy: "Admin",
    },
    {
      id: "#BLD001",
      name: "Tòa nhà A1",
      type: "Building",
      project: "Times City",
      building: "Tòa A1",
      apartment: "-",
      deletedAt: "24/03/2025",
      deletedBy: "Manager",
    },
    {
      id: "#APT001",
      name: "Căn hộ 1201",
      type: "Apartment",
      project: "Royal City",
      building: "Tòa R1",
      apartment: "Căn 1201",
      deletedAt: "23/03/2025",
      deletedBy: "Admin",
    },
    {
      id: "#APT002",
      name: "Căn hộ 0505",
      type: "Apartment",
      project: "Goldmark City",
      building: "Tòa C2",
      apartment: "Căn 0505",
      deletedAt: "22/03/2025",
      deletedBy: "Manager",
    },
    {
      id: "#BLD002",
      name: "Tòa nhà B3",
      type: "Building",
      project: "Ecopark",
      building: "Tòa B3",
      apartment: "-",
      deletedAt: "21/03/2025",
      deletedBy: "Admin",
    },
  ];

  // Search form configuration
  const searchFields = [
    {
      name: "name",
      placeholder: "Tìm theo tên...",
      colSize: 3,
      icon: "bi bi-search",
      label: "Tên",
    },
    {
      name: "type",
      type: "singleselect",
      placeholder: "Chọn loại...",
      colSize: 3,
      label: "Loại",
      options: [
        { value: "", label: "Tất cả loại" },
        { value: "Project", label: "🏢 Dự án" },
        { value: "Building", label: "🏠 Tòa nhà" },
        { value: "Apartment", label: "🏠 Căn hộ" },
      ],
    },
    {
      name: "project",
      type: "singleselect",
      placeholder: "Chọn dự án...",
      colSize: 2,
      label: "Dự án",
      options: [
        { value: "", label: "Tất cả dự án" },
        { value: "Vinhomes Ocean Park", label: "Vinhomes Ocean Park" },
        { value: "Times City", label: "Times City" },
        { value: "Royal City", label: "Royal City" },
        { value: "Goldmark City", label: "Goldmark City" },
        { value: "Ecopark", label: "Ecopark" },
      ],
    },
    {
      name: "building",
      type: "singleselect",
      placeholder: "Chọn tòa nhà...",
      colSize: 2,
      label: "Tòa nhà",
      options: [
        { value: "", label: "Tất cả tòa nhà" },
        { value: "Tòa A1", label: "Tòa A1" },
        { value: "Tòa R1", label: "Tòa R1" },
        { value: "Tòa C2", label: "Tòa C2" },
        { value: "Tòa B3", label: "Tòa B3" },
      ],
    },
    {
      name: "apartment",
      type: "singleselect",
      placeholder: "Chọn căn hộ...",
      colSize: 2,
      label: "Căn hộ",
      options: [
        { value: "", label: "Tất cả căn hộ" },
        { value: "Căn 1201", label: "Căn 1201" },
        { value: "Căn 0505", label: "Căn 0505" },
      ],
    },
  ];

  // Table columns configuration
  const tableColumns = [
    {
      key: "id",
      label: "ID",
      width: "100px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "name",
      label: "Tên",
      width: "200px",
    },
    {
      key: "type",
      label: "Loại",
      width: "100px",
      render: (value) => {
        let badgeClass = "bg-secondary";
        let icon = "bi bi-question";

        if (value === "Project") {
          badgeClass = "bg-primary";
          icon = "bi bi-diagram-3";
        } else if (value === "Building") {
          badgeClass = "bg-info";
          icon = "bi bi-building";
        } else if (value === "Apartment") {
          badgeClass = "bg-warning";
          icon = "bi bi-house-door";
        }

        return (
          <span
            className={`badge ${badgeClass} d-flex align-items-center gap-1`}
          >
            <i className={icon} style={{ fontSize: "12px" }}></i>
            {value}
          </span>
        );
      },
    },
    {
      key: "project",
      label: "Dự án",
      width: "150px",
    },
    {
      key: "building",
      label: "Tòa nhà",
      width: "120px",
    },
    {
      key: "apartment",
      label: "Căn hộ",
      width: "120px",
    },
    {
      key: "deletedAt",
      label: "Ngày xóa",
      width: "120px",
    },
    {
      key: "deletedBy",
      label: "Người xóa",
      width: "100px",
    },
  ];

  // Load data effect
  useEffect(() => {
    loadTrashItems();
  }, [currentPage, searchValues]);

  const loadTrashItems = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Filter items based on search values
      let filteredItems = mockTrashItems;

      // Filter by name
      if (searchValues.name) {
        filteredItems = filteredItems.filter((item) =>
          item.name.toLowerCase().includes(searchValues.name.toLowerCase())
        );
      }

      // Filter by type
      if (searchValues.type) {
        filteredItems = filteredItems.filter(
          (item) => item.type === searchValues.type
        );
      }

      // Filter by project
      if (searchValues.project) {
        filteredItems = filteredItems.filter(
          (item) => item.project === searchValues.project
        );
      }

      // Filter by building
      if (searchValues.building) {
        filteredItems = filteredItems.filter(
          (item) => item.building === searchValues.building
        );
      }

      // Filter by apartment
      if (searchValues.apartment) {
        filteredItems = filteredItems.filter(
          (item) => item.apartment === searchValues.apartment
        );
      }

      setTrashItems(filteredItems);
    } catch (error) {
      console.error("Error loading trash items:", error);
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
    loadTrashItems();
  };

  const handleReset = () => {
    setSearchValues({
      name: "",
      type: "",
      project: "",
      building: "",
      apartment: "",
    });
    setCurrentPage(1);
  };

  const handleRestore = (item) => {
    console.log("Restore item:", item);
    // Hiển thị modal xác nhận và thực hiện phục hồi
    if (confirm(`Bạn có chắc chắn muốn phục hồi "${item.name}"?`)) {
      // Gọi API phục hồi
      alert("Phục hồi thành công!");
      loadTrashItems();
    }
  };

  const handlePermanentDelete = (item) => {
    console.log("Permanent delete item:", item);
    // Hiển thị modal xác nhận và thực hiện xóa vĩnh viễn
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa vĩnh viễn "${item.name}"? Hành động này không thể hoàn tác!`
      )
    ) {
      // Gọi API xóa vĩnh viễn
      alert("Xóa vĩnh viễn thành công!");
      loadTrashItems();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Custom DataTable cho thùng rác
  const TrashDataTable = ({
    columns,
    data,
    onRestore,
    onPermanentDelete,
    isLoading,
    emptyMessage,
  }) => {
    if (isLoading) {
      return (
        <div className="bg-white rounded shadow-sm p-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: "50px" }}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={(e) => {
                      console.log("Select all:", e.target.checked);
                    }}
                  />
                </th>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: "600",
                      fontSize: "14px",
                      width: column.width || "auto",
                    }}
                  >
                    {column.label}
                  </th>
                ))}
                <th
                  scope="col"
                  style={{
                    width: "200px",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    <i className="bi bi-trash display-6 text-muted d-block mb-3"></i>
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                data.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        onChange={(e) => {
                          console.log(
                            "Row selected:",
                            rowIndex,
                            e.target.checked
                          );
                        }}
                      />
                    </td>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        style={{
                          fontFamily: "'Inter', sans-serif",
                          fontSize: "14px",
                        }}
                      >
                        {column.render
                          ? column.render(row[column.key], row, rowIndex)
                          : row[column.key]}
                      </td>
                    ))}
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-success btn-sm px-3"
                          onClick={() => onRestore && onRestore(row)}
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          <i className="bi bi-arrow-counterclockwise me-1"></i>
                          Phục hồi
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm px-3"
                          onClick={() =>
                            onPermanentDelete && onPermanentDelete(row)
                          }
                          style={{
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          <i className="bi bi-trash3 me-1"></i>
                          Xóa vĩnh viễn
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout title="TRASH MANAGEMENT">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">
          <i className="bi bi-trash me-2"></i>
          Quản lý thùng rác
        </h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              if (
                confirm(
                  "Bạn có chắc chắn muốn xóa vĩnh viễn tất cả mục trong thùng rác?"
                )
              ) {
                alert("Đã xóa vĩnh viễn tất cả!");
                loadTrashItems();
              }
            }}
            style={{
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "600",
              fontSize: "14px",
              padding: "8px 16px",
            }}
          >
            <i className="bi bi-trash3 me-2"></i>
            Xóa vĩnh viễn tất cả
          </button>
          <button
            className="btn btn-success"
            onClick={() => {
              if (
                confirm(
                  "Bạn có chắc chắn muốn phục hồi tất cả mục trong thùng rác?"
                )
              ) {
                alert("Đã phục hồi tất cả!");
                loadTrashItems();
              }
            }}
            style={{
              borderRadius: "8px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: "600",
              fontSize: "14px",
              padding: "8px 16px",
            }}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Phục hồi tất cả
          </button>
        </div>
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
      <TrashDataTable
        columns={tableColumns}
        data={trashItems}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        isLoading={isLoading}
        emptyMessage="Thùng rác trống"
      />

      {/* Pagination */}
      {trashItems.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(trashItems.length / 10)}
          totalItems={trashItems.length}
          itemsPerPage={10}
          onPageChange={handlePageChange}
        />
      )}
    </DashboardLayout>
  );
};

export default TrashManagement;
