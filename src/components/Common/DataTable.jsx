import React from "react";
import Button from "./Button";

const DataTable = ({
  columns = [],
  data = [],
  onView,
  onEdit,
  onDelete,
  isLoading = false,
  emptyMessage = "Không có dữ liệu",
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
                    // Handle select all functionality
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
                Action
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
                  <i className="bi bi-inbox display-6 text-muted d-block mb-3"></i>
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
                      <Button
                        variant="dark"
                        size="sm"
                        onClick={() => onView && onView(row)}
                        className="px-3"
                      >
                        View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onEdit && onEdit(row)}
                        className="px-3"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete && onDelete(row)}
                        className="px-3"
                      >
                        Delete
                      </Button>
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

export default DataTable;
