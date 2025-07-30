import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import SearchForm from "../Common/SearchForm";
import DataTable from "../Common/DataTable";
import Pagination from "../Common/Pagination";
import axiosInstance from "../../api/axiosInstance";
import { isAuthenticated } from "../../utils/authUtils";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchValues, setSearchValues] = useState({
    username: "",
    email: "",
    is_active: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const searchFields = [
    {
      name: "username",
      placeholder: "Search by username...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Username",
    },
    {
      name: "email",
      placeholder: "Search by email...",
      colSize: 4,
      icon: "bi bi-search",
      label: "Email",
    },
    {
      name: "is_active",
      type: "singleselect",
      placeholder: "Select status...",
      colSize: 4,
      label: "Status",
      options: [
        { value: "", label: "All" },
        { value: "1", label: "Active" },
        { value: "0", label: "Inactive" },
      ],
      clearable: true,
    },
  ];

  const tableColumns = [
    {
      key: "username",
      label: "Username",
      width: "120px",
    },
    {
      key: "email",
      label: "Email",
      width: "200px",
    },
    {
      key: "isActive",
      label: "Status",
      width: "90px",
      render: (value) => (
        <span
          className={`badge d-flex align-items-center gap-1 ${value === true || value === 1 || value === "1" ? "bg-success" : "bg-secondary"}`}
          style={{ width: "fit-content" }}
        >
          <i className={`bi ${value === true || value === 1 || value === "1" ? "bi-check-circle" : "bi-x-circle"}`} style={{ fontSize: "12px" }}></i>
          {value === true || value === 1 || value === "1" ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  useEffect(() => {
    if (isAuthenticated()) {
      loadUsers();
    }
  }, [currentPage, searchValues]);

  const generateQuery = () => {
    const conditions = [];
    if (searchValues.email) {
      conditions.push(`email==${searchValues.email}`); // thêm toán tử tìm gần đúng
    }
    if (searchValues.is_active !== "") {
      const isActive = searchValues.is_active === "1" ? "true" : "false";
      conditions.push(`isActive==${isActive}`);
    }
    return conditions.join(";");
  };  

  const hasFilter = () => {
    return (
      searchValues.username.trim() !== "" ||
      searchValues.email.trim() !== "" ||
      searchValues.is_active !== ""
    );
  };

  // Lấy danh sách user (có filter hoặc không)
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      if (!isAuthenticated()) {
        setUsers([]);
        setTotalUsers(0);
        return;
      }
      let response;
      const queryStr = generateQuery();
      if (hasFilter()) {
        // Có filter, dùng search
        response = await axiosInstance.get("/api/users/search", {
          params: {
            query: queryStr,
            page: currentPage - 1,
            size: 10,
          },
        });
      } else {
        // Không filter, lấy tất cả
        response = await axiosInstance.get("/api/users", {
          params: {
            page: currentPage - 1,
            size: 10,
          },
        });
      }
      // Map dữ liệu trả về dạng mảng (Spring trả về List<User>), cần tạo content/totalElements thủ công nếu cần
      let data = response.data;
      let content = Array.isArray(data) ? data : data.content || [];
      let total = Array.isArray(data) ? data.length : data.totalElements || 0;
      setUsers(content.map(u => ({
        ...u,
        isActive: u.isActive !== undefined ? u.isActive : u.is_active
      })));
      setTotalUsers(total);
      console.log("API search response:", response.data);
      console.log("Query gửi lên:", queryStr);
    } catch (error) {
      setUsers([]);
      setTotalUsers(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchFieldChange = (fieldName, value) => {
    setCurrentPage(1);
    setSearchValues((prev) => ({
      ...DataTableprev,
      [fieldName]: value,
    }));
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchValues({
      username: "",
      email: "",
      is_active: "",
    });
    setCurrentPage(1);
  };

  const handleView = (user) => {
    navigate(`/dashboard/users/view/${user.id}`);
  };

  const handleDeactive = async (user) => {
    if (window.confirm(`Are you sure you want to deactivate "${user.username}"?`)) {
      try {
        await axiosInstance.put(`/api/users/update/${user.id}`, {
          isActive: false,
          email: `[DEACTIVED] ${user.email}`
        });
        alert("User deactivated successfully!");
        loadUsers();
      } catch (err) {
        alert("Deactivation failed.");
        console.error(err);
      }
    }
  };  

  const handleMoveToTrash = async (user) => {
    if (window.confirm(`Are you sure you want to move "${user.username}" to trash?`)) {
      try {
        await axiosInstance.delete(`/api/users/delete/${user.id}`);
        alert("User moved to trash successfully!");
        loadUsers();
      } catch (err) {
        alert("Move to trash failed.");
        console.error(err);
      }
    }
  };

  const handleAdd = () => {
    navigate("/dashboard/users/create");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardLayout>
      {!isAuthenticated() && (
        <div className="alert alert-danger mb-4" role="alert">
          <i className="bi bi-shield-exclamation me-2"></i>
          <strong>Authentication Required:</strong> Please log in to view user data.
          <a href="/login" className="alert-link ms-2">Log in now</a>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="text-muted mb-0">User Management</h5>
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
          Add User
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
        data={users}
        onView={handleView}
        isLoading={isLoading}
        emptyMessage={
          !isAuthenticated()
            ? "Please log in to view user data"
            : "No users match the search criteria"
        }
      />

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(totalUsers / 10)}
        totalItems={totalUsers}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />
    </DashboardLayout>
  );
};

export default UserManagement;