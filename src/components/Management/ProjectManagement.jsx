import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";
import { Link, useNavigate } from "react-router-dom";

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({
    name: "",
    district: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [districts, setDistricts] = useState([]);

  const searchFields = [
    {
      name: "name",
      placeholder: "Search by project name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Project Name",
    },
    {
      name: "district",
      type: "singleselect",
      placeholder: "Select district...",
      colSize: 6,
      label: "District",
      options: districts,
      clearable: true,
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
      key: "name",
      label: "Project Name",
      width: "100px",
    },
    {
      key: "address",
      label: "Address",
      width: "300px",
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
      loadProjects();
      loadDistricts();
    }
  }, [currentPage, searchValues]);

  const loadDistricts = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/projects/statistics/district"
      );
      if (response.data && Array.isArray(response.data)) {
        // Chuyển đổi từ format API thành format cho combobox
        const districtOptions = response.data.map((item) => ({
          value: item.district,
          label: `${item.district}`,
        }));
        setDistricts(districtOptions);
      }
    } catch (error) {
      console.error("Error loading districts:", error);
      setDistricts([]);
    }
  };

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 1
    conditions.push("active==1");

    if (searchValues.name) {
      conditions.push(`name=="*${searchValues.name}*"`);
    }

    if (searchValues.district) {
      conditions.push(`address=="*${searchValues.district}*"`);
    }

    return conditions.join(";");
  };

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        console.error("Authentication required");
        setProjects([]);
        setTotalProjects(0);
        return;
      }

      const response = await axiosInstance.get("/api/projects/search?", {
        params: {
          page: currentPage - 1,
          size: 10,
          query: generateQuery(),
        },
      });

      if (response.data) {
        setProjects(response.data.content);
        setTotalProjects(response.data.totalElements);
      } else {
        setProjects([]);
        setTotalProjects(0);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setProjects([]);
      setTotalProjects(0);
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
      name: "",
      district: "",
    });
    setCurrentPage(1);
  };

  const handleView = (project) => {
    navigate(`/dashboard/projects/view/${project.id}`);
  };

  const handleDeactive = async (item) => {
    if (confirm(`Are you sure you want to deactive "${item.name}"?`)) {
      try {
        await axiosInstance.delete(`/api/projects/deactivate/${item.id}`);
        alert("Deactive successful!");
        loadProjects();
      } catch (err) {
        alert("Deactive failed.");
        console.error(err);
      }
    }
  };

  const handleMoveToTrash = async (item) => {
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      try {
        await axiosInstance.delete(`/api/projects/moveToTrash/${item.id}`);
        alert("Move to trash successful!");
        loadProjects();
      } catch (err) {
        alert("Move to trash failed.");
        console.error(err);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view
          project data.
          <a href="/login" className="alert-link ms-2">
            Log in now
          </a>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Project Management</h5>
        <Link
          to="/dashboard/projects/create"
          className="btn btn-primary"
          style={{
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 16px",
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add Project
        </Link>
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
        data={projects}
        onView={handleView}
        onDeactive={(row) => handleDeactive(row)}
        onMoveToTrash={(row) => handleMoveToTrash(row)}
        isLoading={isLoading}
        emptyMessage={
          !isAuthenticated()
            ? "Please log in to view project data"
            : "No projects found"
        }
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalProjects / 10)}
        totalItems={totalProjects}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default ProjectManagement;
