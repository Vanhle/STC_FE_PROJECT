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
      .get("/api/projects/statistics/year") // sửa lại nếu cần prefix như /api/statistics/year
      .then((response) => {
        // Đổi tên 'year' thành 'name' để XAxis hiển thị đúng
        const formattedData = response.data.map((item) => ({
          name: item.year.toString(),
          count: item.count,
        }));
        setData(formattedData);
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API thống kê:", error);
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
