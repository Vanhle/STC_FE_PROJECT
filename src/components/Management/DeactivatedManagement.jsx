import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";

const DeactivatedManagement = () => {
  const [searchValues, setSearchValues] = useState({
    name: "",
    type: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [deactivatedItems, setDeactivatedItems] = useState([]);
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
      width: "50px",
      render: () => (
        <span
          className="badge bg-warning d-flex align-items-center gap-1"
          style={{ width: "fit-content" }}
        >
          <i className="bi bi-pause-circle" style={{ fontSize: "12px" }}></i>
          Deactivated
        </span>
      ),
    },
    {
      key: "updatedAt",
      label: "Deactivated Date",
      width: "160px",
      render: (value) => {
        const date = new Date(value);
        return isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US");
      },
    },
    {
      key: "updatedBy",
      label: "Deactivated By",
      width: "140px",
    },
  ];

  // Load data from API
  useEffect(() => {
    if (isAuthenticated()) {
      loadDeactivatedItems();
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 2 for deactivated items
    conditions.push("active==2");

    if (searchValues.name) {
      conditions.push(`name=="*${searchValues.name}*"`);
    }

    return conditions.join(";");
  };

  const loadDeactivatedItems = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        console.error("Authentication required");
        setDeactivatedItems([]);
        setTotalItems(0);
        return;
      }

      const type = searchValues.type;
      if (!type) {
        setDeactivatedItems([]);
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
        setDeactivatedItems(response.data.content);
        setTotalItems(response.data.totalElements);
      } else {
        setDeactivatedItems([]);
        setTotalItems(0);
      }
    } catch (error) {
      console.error("Error loading deactivated items:", error);
      setDeactivatedItems([]);
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

  const handleReactivate = async (item) => {
    if (confirm(`Are you sure you want to reactivate "${item.name}"?`)) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.put(`/api/${type}/restore/${item.id}`);
        alert("Reactivate successful!");
        loadDeactivatedItems();
      } catch (err) {
        alert("Reactivate failed.");
        console.error(err);
      }
    }
  };

  const handleMoveToTrash = async (item) => {
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.delete(`/api/${type}/moveToTrash/${item.id}`);
        alert("Move to trash successful!");
        loadDeactivatedItems();
      } catch (err) {
        alert("Move to trash failed.");
        console.error(err);
      }
    }
  };

  const handleMoveAllDeactivatedToTrash = async () => {
    if (
      confirm("Are you sure you want to move all deactivated items to trash?")
    ) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.delete(`/api/${type}/moveDeactivateToTrashAll`);
        alert("All deactivated items moved to trash successfully!");
        loadDeactivatedItems();
      } catch (err) {
        alert("Failed to move all items to trash.");
        console.error(err);
      }
    }
  };

  const handleActivateAll = async () => {
    if (confirm("Are you sure you want to reactivate all deactivated items?")) {
      const type = searchValues.type;
      if (!type) {
        alert("Please select a type first.");
        return;
      }
      try {
        await axiosInstance.put(`/api/${type}/restoreAllDeactivated`);
        alert("All items reactivated successfully!");
        loadDeactivatedItems();
      } catch (err) {
        alert("Failed to reactivate all items.");
        console.error(err);
      }
    }
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view
          deactivated data.
          <a href="/login" className="alert-link ms-2">
            Log in now
          </a>
        </div>
      )}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Deactivated Management</h5>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger"
            onClick={handleMoveAllDeactivatedToTrash}
          >
            <i className="bi bi-trash3 me-2"></i> Move All to Trash
          </button>
          <button className="btn btn-success" onClick={handleActivateAll}>
            <i className="bi bi-play-circle me-2"></i> Reactivate All
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
      <div className="alert alert-warning mb-4">
        <i className="bi bi-info-circle me-2"></i>
        Deactivated items are hidden from normal operations but can be
        reactivated.
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
              ) : deactivatedItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length + 2}
                    className="text-center py-4 text-muted"
                  >
                    No deactivated items found
                  </td>
                </tr>
              ) : (
                deactivatedItems.map((row, rowIndex) => (
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
                          onClick={() => handleReactivate(row)}
                          style={{ minWidth: "70px" }}
                        >
                          <i
                            className="bi bi-play-circle mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontSize: "10px" }}>Reactivate</span>
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm d-flex flex-column align-items-center px-3 py-2"
                          onClick={() => handleMoveToTrash(row)}
                          style={{ minWidth: "100px" }}
                        >
                          <i
                            className="bi bi-trash3 mb-1"
                            style={{ fontSize: "14px" }}
                          ></i>
                          <span style={{ fontSize: "10px" }}>
                            Move to trash
                          </span>
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

export default DeactivatedManagement;
