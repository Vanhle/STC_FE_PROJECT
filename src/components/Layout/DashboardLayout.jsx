import React from "react";
import Sidebar from "../Common/Sidebar";
import Navbar from "../Common/Navbar";

const DashboardLayout = ({ children, title = "Dashboard" }) => {
  return (
    <div className="d-flex bg-light min-vh-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Navbar */}
        <Navbar title={title} />

        {/* Page Content */}
        <main className="flex-grow-1 p-4">
          <div className="container-fluid">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
