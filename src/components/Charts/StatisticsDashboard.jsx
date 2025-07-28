import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import PieChartByDistrict from "./PieChartByDistrict";
import StatisticsChart from "./StatisticsChart";
import StatisticsCards from "./StatisticsCards";
import { isAuthenticated } from "../../utils/authUtils";

const StatisticsDashboard = () => {
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
        <h5 className="text-muted mb-0">Statistics Dashboard</h5>
        <button
          className="btn btn-outline-primary btn-sm d-flex align-items-center"
          onClick={() => window.location.reload()}
          style={{
            borderRadius: "8px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600",
            fontSize: "14px",
            padding: "8px 16px",
          }}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards />

      {/* Charts Section */}
      <div className="row g-4">
        {/* Statistics by Year */}
        <div className="col-xl-8 col-lg-7">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-gradient-success text-white border-0">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title mb-0 fw-bold fs-6">
                    <i className="bi bi-bar-chart-line me-2"></i>
                    Project Trend by Year
                  </h6>
                  <small className="opacity-75">Bar chart</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <StatisticsChart />
            </div>
          </div>
        </div>

        {/* Distribution by District */}
        <div className="col-xl-4 col-lg-5">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-gradient-primary text-white border-0">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="card-title mb-0 fw-bold fs-6">
                    <i className="bi bi-pie-chart-fill me-2"></i>
                    Distribution by District
                  </h6>
                  <small className="opacity-75">Area-based pie chart</small>
                </div>
              </div>
            </div>
            <div className="card-body p-4">
              <PieChartByDistrict />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light border-0">
              <h6 className="card-title mb-0 text-dark fs-6">
                <i className="bi bi-lightbulb me-2 text-warning"></i>
                Analysis and Insights
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary bg-opacity-10 rounded p-2 me-3">
                      <i className="bi bi-trend-up text-primary"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold text-dark mb-1 small">
                        Growth Trend
                      </h6>
                      <p className="text-muted small mb-0">
                        The chart shows the project development trend over the
                        years, helping to forecast and plan for the next period.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-start">
                    <div className="bg-success bg-opacity-10 rounded p-2 me-3">
                      <i className="bi bi-geo-alt text-success"></i>
                    </div>
                    <div>
                      <h6 className="fw-semibold text-dark mb-1 small">
                        Geographical Distribution
                      </h6>
                      <p className="text-muted small mb-0">
                        Analyze project density by district to identify
                        potential areas and investment opportunities.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StatisticsDashboard;
