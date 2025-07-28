import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

const StatisticsCards = () => {
  const [stats, setStats] = useState({
    projectCount: 0,
    buildingCount: 0,
    districtCount: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStats((prev) => ({ ...prev, loading: true }));

        // Call 3 APIs simultaneously
        const [projectRes, buildingRes, districtRes] = await Promise.all([
          axiosInstance.get("/api/projects/project-count"),
          axiosInstance.get("/api/buildings/building-count"),
          axiosInstance.get("/api/projects/district-count"),
        ]);

        setStats({
          projectCount: projectRes.data.count || projectRes.data || 0,
          buildingCount: buildingRes.data.count || buildingRes.data || 0,
          districtCount: districtRes.data.count || districtRes.data || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error("❌ Error loading statistics:", error);
        setStats((prev) => ({
          ...prev,
          loading: false,
          error: "Unable to load statistics data",
        }));
      }
    };

    fetchStatistics();
  }, []);

  if (stats.loading) {
    return (
      <div className="row mb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="col-12 col-sm-6 col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <div className="spinner-border text-primary mb-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h6 className="text-muted">Loading...</h6>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="alert alert-warning mb-4" role="alert">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {stats.error}
      </div>
    );
  }

  const cardData = [
    {
      title: "Total Projects",
      count: stats.projectCount,
      icon: "bi bi-diagram-3",
      color: "primary",
      bgColor: "bg-primary",
      description: "Current number of projects",
    },
    {
      title: "Total Buildings",
      count: stats.buildingCount,
      icon: "bi bi-building",
      color: "success",
      bgColor: "bg-success",
      description: "Number of buildings constructed",
    },
    {
      title: "Districts",
      count: stats.districtCount,
      icon: "bi bi-geo-alt",
      color: "info",
      bgColor: "bg-info",
      description: "Geographical coverage",
    },
  ];

  const cardGradients = [
    // Blue gradient
    "linear-gradient(135deg, rgb(255,255,255) 0%, rgb(245, 255, 165) 100%)",
    // Green gradient
    "linear-gradient(135deg, rgb(255,255,255) 0%, rgb(206, 253, 224) 100%)",
    // Purple gradient
    "linear-gradient(135deg, rgb(255,255,255) 0%, rgb(230, 215, 255) 100%)",
  ];

  return (
    <div className="row mb-4">
      {cardData.map((card, index) => (
        <div key={index} className="col-12 col-sm-6 col-md-4 mb-3">
          <div
            className="card border-0 shadow-sm hover-shadow transition-all"
            style={{
              background: cardGradients[index],
            }}
          >
            <div className="card-body p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div
                  className={`rounded-circle ${card.bgColor} p-2 d-flex align-items-center justify-content-center`}
                  style={{ width: "30px", height: "30px" }}
                >
                  <i
                    className={`${card.icon} text-white`}
                    style={{ fontSize: "16px" }}
                  ></i>
                </div>
                <div className="text-end">
                  <h3
                    className={`fw-bold text-${card.color} mb-0`}
                    style={{ fontSize: "24px" }}
                  >
                    {card.count.toLocaleString()}
                    {card.suffix || ""}
                  </h3>
                </div>
              </div>

              <div>
                <h6 className="fw-semibold text-dark mb-1 small">
                  {card.title}
                </h6>
                <p className="text-muted small mb-0">{card.description}</p>
              </div>

              {/* Progress bar for visual effect */}
              <div className="mt-2">
                <div className="progress" style={{ height: "3px" }}>
                  <div
                    className={`progress-bar ${card.bgColor}`}
                    style={{
                      width: `${Math.min(
                        100,
                        (card.count /
                          Math.max(...cardData.map((c) => c.count))) *
                          100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
