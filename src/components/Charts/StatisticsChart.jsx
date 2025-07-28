import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatisticsChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/projects/statistics/year") // edit if need prefix like /api/statistics/year
      .then((response) => {
        // Rename 'year' to 'name' so XAxis displays correctly
        const formattedData = response.data.map((item) => ({
          name: item.year.toString(),
          count: item.count,
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error("Error when calling statistics API:", error);
      });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 15, right: 15, bottom: 0, left: -30 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" barSize={40} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default StatisticsChart;
