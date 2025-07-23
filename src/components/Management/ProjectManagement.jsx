import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";
import { Link } from "react-router-dom";

const ProjectManagement = () => {
  const [searchValues, setSearchValues] = useState({
    name: "",
    active: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);

  const searchFields = [
    {
      name: "name",
      placeholder: "Search by project name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Project Name",
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
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 1
    conditions.push("active==1");

    if (searchValues.name) {
      conditions.push(`name=="*${searchValues.name}*"`);
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

      const response = await axiosInstance.get(
        "http://localhost:8080/api/projects/search?",
        {
          params: {
            page: currentPage - 1,
            size: 10,
            query: generateQuery(),
          },
        }
      );

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
      status: "",
    });
    setCurrentPage(1);
  };

  const handleView = (project) => {
    console.log("View project:", project);
  };

  const handleEdit = (project) => {
    console.log("Edit project:", project);
  };

  const handleDelete = (project) => {
    console.log("Delete project:", project);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {(!localStorage.getItem("authToken") ||
        !localStorage.getItem("tokenExpiredAt") ||
        Date.now() >= Number(localStorage.getItem("tokenExpiredAt"))) && (
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
        onEdit={handleEdit}
        onDelete={handleDelete}
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
