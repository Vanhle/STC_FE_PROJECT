import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";

const ApartmentManagement = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({
    buildingName: "",
    apartmentName: "",
    totalAreaFrom: "",
    totalAreaTo: "",
    priceFrom: "",
    priceTo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [apartments, setApartments] = useState([]);
  const [totalApartments, setTotalApartments] = useState(0);

  const searchFields = [
    {
      name: "buildingName",
      placeholder: "Search by building name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Building Name",
    },
    {
      name: "apartmentName",
      placeholder: "Search by apartment name...",
      colSize: 6,
      icon: "bi bi-search",
      label: "Apartment Name",
    },
    {
      name: "totalAreaFrom",
      placeholder: "From (m²)",
      colSize: 3,
      type: "number",
      label: "Area From",
    },
    {
      name: "totalAreaTo",
      placeholder: "To (m²)",
      colSize: 3,
      type: "number",
      label: "Area To",
    },
    {
      name: "priceFrom",
      placeholder: "From (billion)",
      colSize: 3,
      type: "number",
      label: "Price From",
    },
    {
      name: "priceTo",
      placeholder: "To (billion)",
      colSize: 3,
      type: "number",
      label: "Price To",
    },
  ];

  // value table (key is the name of the column returned by json)
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
      key: "buildingName",
      label: "Building Name",
      width: "180px",
    },
    {
      key: "name",
      label: "Apartment Name",
      width: "160px",
    },
    {
      key: "atFloor",
      label: "Floor",
      width: "55px",
      render: (value) => <span className="badge bg-secondary">{value}</span>,
    },
    {
      key: "totalArea",
      label: "Area",
      width: "80px",
      render: (value) => (
        <span className="badge bg-info">{value?.toFixed(1)}m²</span>
      ),
    },
    {
      key: "price",
      label: "Price",
      width: "100px",
      render: (value) => (
        <span className="fw-semibold text-success">
          {(value / 1000000000)?.toFixed(2)} billion
        </span>
      ),
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
      loadApartments();
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];

    // Always filter active = 1
    conditions.push("active==1");

    if (searchValues.buildingName) {
      conditions.push(`building.name=="*${searchValues.buildingName}*"`);
    }
    if (searchValues.apartmentName) {
      conditions.push(`name=="*${searchValues.apartmentName}*"`);
    }
    if (searchValues.totalAreaFrom) {
      conditions.push(`totalArea>=${searchValues.totalAreaFrom}`);
    }
    if (searchValues.totalAreaTo) {
      conditions.push(`totalArea<=${searchValues.totalAreaTo}`);
    }
    if (searchValues.priceFrom) {
      conditions.push(`price>=${searchValues.priceFrom}`);
    }
    if (searchValues.priceTo) {
      conditions.push(`price<=${searchValues.priceTo}`);
    }

    return conditions.join(";");
  };

  const loadApartments = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        console.error("Authentication required");
        setApartments([]);
        setTotalApartments(0);
        return;
      }

      const response = await axiosInstance.get("/api/apartments/search?", {
        params: {
          page: currentPage - 1,
          size: 10,
          query: generateQuery(),
        },
      });

      if (response.data) {
        setApartments(response.data.content);
        setTotalApartments(response.data.totalElements);
      } else {
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

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchValues({
      buildingName: "",
      apartmentName: "",
      totalAreaFrom: "",
      totalAreaTo: "",
      priceFrom: "",
      priceTo: "",
      active: "",
    });
    setCurrentPage(1);
  };

  const handleView = (apartment) => {
    navigate(`/dashboard/apartments/view/${apartment.id}`);
  };

  const handleDeactive = async (item) => {
    if (confirm(`Are you sure you want to deactive "${item.name}"?`)) {
      try {
        await axiosInstance.delete(`/api/apartments/deactivate/${item.id}`);
        alert("Deactive successful!");
        loadApartments();
      } catch (err) {
        alert("Deactive failed.");
        console.error(err);
      }
    }
  };

  const handleMoveToTrash = async (item) => {
    if (confirm(`Are you sure you want to move "${item.name}" to trash?`)) {
      try {
        await axiosInstance.delete(`/api/apartments/moveToTrash/${item.id}`);
        alert("Move to trash successful!");
        loadApartments();
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
    navigate("/dashboard/apartments/create");
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view
          apartment data.
          <a href="/login" className="alert-link ms-2">
            Log in now
          </a>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">Apartment Management</h5>
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
          Add Apartment
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
        data={apartments}
        onView={handleView}
        onMoveToTrash={(row) => handleMoveToTrash(row)}
        onDeactive={(row) => handleDeactive(row)}
        isLoading={isLoading}
        emptyMessage={
          !isAuthenticated()
            ? "Please log in to view apartment data"
            : "No apartments match the search criteria"
        }
      />

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
