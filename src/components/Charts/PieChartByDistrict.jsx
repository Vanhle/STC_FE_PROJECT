import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Generate color list according to the number of elements
const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = (i * 360) / count;
    const saturation = 70 + (i % 3) * 10; // 70%, 80%, 90%
    const lightness = 50 + (i % 2) * 10; // 50%, 60%
    colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }
  return colors;
};

// Function to display percentage on the chart
const renderCustomLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PieChartByDistrict = () => {
  const [data, setData] = useState([]); // store district list and project count
  const [colors, setColors] = useState([]); // color list
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error message (if any)

  // Call API when component is mounted
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/projects/statistics/district"
        );

        // Call API to get project statistics by district.
        if (!Array.isArray(res.data)) {
          throw new Error("Returned data is invalid");
        }

        // Check if returned data is an array.
        const filteredData = res.data.filter((item) => item.count > 0);

        // Filter out districts with count = 0.
        setData(filteredData);
        setColors(generateColors(filteredData.length));
      } catch (err) {
        console.error("❌ API failed:", err);
        setError("Unable to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No data available</div>;

  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="district"
            cx="50%"
            cy="50%"
            outerRadius={100} // Increase the size of the pie chart
            label={renderCustomLabel}
            labelLine={false} // <-- this line will remove the label lines
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartByDistrict;
