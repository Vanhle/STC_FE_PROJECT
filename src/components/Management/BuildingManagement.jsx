import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";

const BuildingManagement = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({
    projectName: "",
    buildingName: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [buildings, setBuildings] = useState([]);
  const [totalBuildings, setTotalBuildings] = useState(0);

  const searchFields = [
    {
      name: "projectName",
      placeholder: "Search by project name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Project Name",
    },
    {
      name: "buildingName",
      placeholder: "Search by building name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Building Name",
    },
  ];

  //bảng giá trị ( key là tên cột json trả về)
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
      key: "projectName",
      label: "Project Name",
      width: "100px",
      render: (value) => <span className="fw-semibold">{value}</span>,
    },
    {
      key: "name",
      label: "Building Name",
      width: "150px",
      render: (value) => <span className="fw-semibold">{value}</span>,
    },
    {
      key: "numberOfBasements",
      label: "Number of Basements",
      width: "100px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "numberOfLivingFloors",
      label: "Number of Living Floors",
      width: "80px",
      render: (value) => <span className="badge bg-info">{value}</span>,
    },
    {
      key: "active",
      label: "Status",
      width: "90px",
      render: () => (
        <span
          className="badge bg-success d-flex align-items-center gap-1"
          style={{ width: "fit-content" }}
        >
          <i className="bi bi-eye" style={{ fontSize: "12px" }}></i>
          Active
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (isAuthenticated()) {
      loadBuildings();
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 1
    conditions.push("active==1");

    if (searchValues.projectName) {
      conditions.push(`project.name=="*${searchValues.projectName}*"`);
    }

    if (searchValues.buildingName) {
      conditions.push(`name=="*${searchValues.buildingName}*"`);
    }
    return conditions.join(";");
  };

  const loadBuildings = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        console.error("Authentication required");
        setBuildings([]);
        setTotalBuildings(0);
        return;
      }

      const response = await axiosInstance.get(
        "/api/buildings/search?",
        {
          params: {
            page: currentPage - 1,
            size: 10,
            query: generateQuery(),
          },
        }
      );

      if (response.data) {
        setBuildings(response.data.content);
        setTotalBuildings(response.data.totalElements);
      } else {
        setBuildings([]);
        setTotalBuildings(0);
      }
    } catch (error) {
      console.error("Error loading buildings:", error);
      setBuildings([]);
      setTotalBuildings(0);
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

  const handleSearch = () => {
    setCurrentPage(1);
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
    navigate(`/dashboard/buildings/view/${building.id}`);
  };

  const handleDeactive = async (item) => {
    if (confirm(`Are you sure you want to deactive "${item.name}"?`)) {
      try {
        await axiosInstance.delete(`/api/buildings/deactivate/${item.id}`);
        alert("Deactive successful!");
        loadBuildings();
      } catch (err) {
        alert("Deactive failed.");
        console.error(err);
      }
    }
  };

  const handleMoveToTrash = async (item) => {
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      try {
        await axiosInstance.delete(`/api/buildings/moveToTrash/${item.id}`);
        alert("Move to trash successful!");
        loadBuildings();
      } catch (err) {
        alert("Move to trash failed.");
        console.error(err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleAdd = () => {
    navigate("/dashboard/buildings/create");
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view
          building data.
          <a href="/login" className="alert-link ms-2">
            Log in now
          </a>
        </div>
      )}

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

      <SearchForm
        fields={searchFields}
        values={searchValues}
        onFieldChange={handleSearchFieldChange}
        onSearch={handleSearch}
        onReset={handleReset}
        isLoading={isLoading}
      />

      <DataTable
        columns={tableColumns}
        data={buildings}
        onView={handleView}
        onMoveToTrash={(row) => handleMoveToTrash(row)}
        onDeactive={(row) => handleDeactive(row)}
        isLoading={isLoading}
        emptyMessage={
          !isAuthenticated()
            ? "Please log in to view building data"
            : "No buildings match the search criteria"
        }
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalBuildings / 10)}
        totalItems={totalBuildings}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default BuildingManagement;
