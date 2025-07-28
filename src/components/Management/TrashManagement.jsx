import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";

const TrashManagement = () => {
  const [searchValues, setSearchValues] = useState({
    name: "",
    type: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [trashItems, setTrashItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);

  const searchFields = [
    {
      name: "name",
      placeholder: "Search by name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Name",
    },
    {
      name: "type",
      type: "singleselect",
      placeholder: "Select type...",
      colSize: 6,
      label: "Type",
      options: [
        { value: "", label: "All types" },
        { value: "projects", label: "Project" },
        { value: "buildings", label: "Building" },
        { value: "apartments", label: "Apartment" },
      ],
    },
  ];

  const tableColumns = [
    {
      key: "id",
      label: "ID",
      width: "50px",
      render: (value) => (
        <span className="text-primary fw-semibold">{value}</span>
      ),
    },
    {
      key: "code",
      label: "Code",
      width: "200px",
    },
    {
      key: "name",
      label: "Name",
      width: "200px",
    },
    {
      key: "active",
      label: "Status",
      width: "90px",
      render: () => (
        <span
          className="badge bg-danger d-flex align-items-center gap-1"
          style={{ width: "fit-content" }}
        >
          <i className="bi bi-trash3" style={{ fontSize: "12px" }}></i>
          Deleted
        </span>
      ),
    },
    {
      key: "deletedAt",
      label: "Deleted Date",
      width: "120px",
      render: (value) => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US");
      },
    },
    {
      key: "updatedBy",
      label: "Deleted By",
      width: "100px",
    },
  ];

  // Load data from API
  useEffect(() => {
    if (isAuthenticated()) {
      loadTrashItems();
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 0 for trash
    conditions.push("active==0");

    if (searchValues.name) {
      conditions.push(`name=="*${searchValues.name}*"`);
    }

    return conditions.join(";");
  };

  const loadTrashItems = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        console.error("Authentication required");
        setTrashItems([]);
        setTotalItems(0);
        return;
      }

      const type = searchValues.type;
      if (!type) {
        setTrashItems([]);
        setTotalItems(0);
        return;
      }

      const response = await axiosInstance.get(`/api/${type}/search`, {
        params: {
          page: currentPage - 1,
          size: 10,
          query: generateQuery(),
        },
      });

      if (response.data) {
        setTrashItems(response.data.content);
        setTotalItems(response.data.totalElements);
      } else {
        setTrashItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading trash items:", error);
      setTrashItems([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFieldChange = (fieldName, value) => {
    setCurrentPage(1);
    setSearchValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchValues({
      name: "",
      type: "",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRestore = async (item) => {
    if (confirm(`Are you sure you want to restore "${item.name}"?`)) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.put(`/api/${type}/restore/${item.id}`);
        alert("Restore successful!");
        loadTrashItems();
      } catch (err) {
        alert("Restore failed.");
        console.error(err);
      }
    }
  };

  const handlePermanentDelete = async (item) => {
    if (
      confirm(
        `Are you sure you want to permanently delete "${item.name}"? This action cannot be undone!`
      )
    ) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.delete(
          `/api/${type}/trash/permanentDelete/${item.id}`
        );
        alert("Permanent deletion successful!");
        loadTrashItems();
      } catch (err) {
        alert("Permanent deletion failed.");
        console.error(err);
      }
    }
  };

  const handleRestoreAll = async () => {
    if (confirm("Are you sure you want to restore all items in the trash?")) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.put(`/api/${type}/restoreAllFromTrash`);
        alert("All items restored successfully!");
        loadTrashItems();
      } catch (err) {
        alert("Failed to restore all items.");
        console.error(err);
      }
    }
  };

  const handleDeleteAll = async () => {
    if (
      confirm(
        "Are you sure you want to permanently delete all items in the trash?"
      )
    ) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.delete(`/api/${type}/trash/clear`);
        alert("All items permanently deleted!");
        loadTrashItems();
      } catch (err) {
        alert("Failed to delete all items.");
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view trash
          data.
          <a href="/login" className="alert-link ms-2">
            Log in now
          </a>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Trash Management</h5>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-danger" onClick={handleDeleteAll}>
            <i className="bi bi-trash3 me-2"></i> Delete All Permanently
          </button>
          <button className="btn btn-success" onClick={handleRestoreAll}>
            <i className="bi bi-arrow-counterclockwise me-2"></i> Restore All
          </button>
        </div>
      </div>

      {/* Search */}
      <SearchForm
        fields={searchFields}
        values={searchValues}
        onFieldChange={handleSearchFieldChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      {/* Info */}
      <div className="alert alert-success mb-4">
        <i className="bi bi-trash3 me-2"></i>
        Items in trash will be permanently deleted after 30 days.
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th style={{ width: "50px" }}></th>
                {tableColumns.map((col, i) => (
                  <th key={i} style={{ width: col.width || "auto" }}>
                    {col.label}
                  </th>
                ))}
                <th style={{ width: "200px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-5"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : !searchValues.type ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    <i className="bi bi-funnel display-6 text-muted d-block mb-3"></i>
                    Please select a type to view
                  </td>
                </tr>
              ) : trashItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    Trash is empty
                  </td>
                </tr>
              ) : (
                trashItems.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    <td>
                      <input type="checkbox" className="form-check-input" />
                    </td>
                    {tableColumns.map((col, colIndex) => (
                      <td key={colIndex}>
                        {col.render
                          ? col.render(row[col.key], row, rowIndex)
                          : row[col.key]}
                      </td>
                    ))}
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-outline-success btn-sm d-flex flex-column align-items-center px-3 py-2"
                          onClick={() => handleRestore(row)}
                          style={{ minWidth: "60px" }}
                        >
                          <i
                            className="bi bi-arrow-counterclockwise mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontSize: "10px" }}>Restore</span>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2"
                          onClick={() => handlePermanentDelete(row)}
                          style={{ minWidth: "60px" }}
                        >
                          <i
                            className="bi bi-trash3 mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontSize: "10px" }}>Delete</span>
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalItems / 10)}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default TrashManagement;
