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
  const [totalBuildings, setTotalBuildings] = useState(0);

  // Search form configuration
  const searchFields = [
    {
      name: "projectName",
      placeholder: "Search by project name...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Project Name",
    },
    {
      name: "buildingName",
      placeholder: "Search by building name...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Building Name",
    },
    {
      name: "status",
      type: "singleselect",
      placeholder: "Select status...",
      colSize: 4,
      label: "Status",
      options: [
        { value: "", label: "All statuses" },
        { value: "Visible", label: "👁️ Visible" },
        { value: "Hidden", label: "🚫 Hidden" },
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
      label: "Project Name",
      width: "180px",
    },
    {
      key: "buildingName",
      label: "Building Name",
      width: "150px",
    },
    {
      key: "basementFloors",
      label: "Basement Floors",
      width: "100px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "floors",
      label: "Floors",
      width: "80px",
      render: (value) => <span className="badge bg-info">{value}</span>,
    },
    {
      key: "apartments",
      label: "Apartments",
      width: "90px",
      render: (value) => <span className="badge bg-primary">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "100px",
      render: (value) => {
        const statusClass = value === "Visible" ? "bg-success" : "bg-secondary";
        const statusIcon =
          value === "Visible" ? "bi bi-eye" : "bi bi-eye-slash";
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

  // Debounce search values to optimize API calls
  const [debouncedSearchValues, setDebouncedSearchValues] =
    useState(searchValues);

  // Debounce effect for search values
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchValues(searchValues);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchValues]);

  // Load data effect with debounced search values
  useEffect(() => {
    loadBuildings();
  }, [currentPage, debouncedSearchValues]);

  const loadBuildings = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const token = localStorage.getItem("authToken");
      const expiredAt = localStorage.getItem("tokenExpiredAt");

      if (!token || !expiredAt || Date.now() >= Number(expiredAt)) {
        console.error("Authentication required");
        setBuildings([]);
        setTotalBuildings(0);
        return;
      }

      const response = await axiosInstance.get(
        "http://localhost:8080/api/buildings/search?query=",
        {
          params: {
            page: currentPage - 1, // Backend usually uses 0-based pagination
            size: 10,
            projectName: debouncedSearchValues.projectName || undefined,
            buildingName: debouncedSearchValues.buildingName || undefined,
            status: debouncedSearchValues.status || undefined,
          },
        }
      );

      // Filter buildings based on debounced search values
      let filteredBuildings = response.data.buildings || response.data || [];
      if (debouncedSearchValues.projectName) {
        filteredBuildings = filteredBuildings.filter((b) =>
          b.projectName
            .toLowerCase()
            .includes(debouncedSearchValues.projectName.toLowerCase())
        );
      }

      if (debouncedSearchValues.buildingName) {
        filteredBuildings = filteredBuildings.filter((b) =>
          b.buildingName
            .toLowerCase()
            .includes(debouncedSearchValues.buildingName.toLowerCase())
        );
      }

      if (debouncedSearchValues.status) {
        filteredBuildings = filteredBuildings.filter(
          (b) => b.status === debouncedSearchValues.status
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
        <h5 className="text-muted mb-0">Building Management</h5>
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
          Add Building
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
        emptyMessage="No buildings found"
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
