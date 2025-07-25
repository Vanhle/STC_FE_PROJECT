import React from "react";
import Sidebar from "../Common/Sidebar";
import Navbar from "../Common/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="bg-light min-vh-100" style={{ position: "relative" }}>
      {/* Fixed Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          zIndex: 1000,
        }}
      >
        <Sidebar />
      </div>

      {/* Fixed Top Navbar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          left: "250px", // Adjust based on sidebar width
          zIndex: 999,
        }}
      >
        <Navbar />
      </div>

      {/* Main Content with proper margins */}
      <main
        style={{
          marginLeft: "250px", // Sidebar width (matches Sidebar.jsx)
          marginTop: "80px", // Navbar height (py-3 + content)
          padding: "1.5rem",
          minHeight: "calc(100vh - 80px)",
          overflowY: "auto",
        }}
      >
        <div className="container-fluid">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
