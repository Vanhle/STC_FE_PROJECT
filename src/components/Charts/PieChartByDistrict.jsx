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

// Tạo danh sách màu theo số lượng phần tử
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

// Hàm hiển thị phần trăm trên biểu đồ
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
  const [data, setData] = useState([]); // lưu danh sách quận và số lượng dự án
  const [colors, setColors] = useState([]); // danh sách màu
  const [loading, setLoading] = useState(true); // trạng thái đang tải
  const [error, setError] = useState(null); // thông báo lỗi (nếu có)

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          "/api/projects/statistics/district"
        );

        // Gọi API để lấy dữ liệu thống kê số dự án theo quận.
        if (!Array.isArray(res.data)) {
          throw new Error("Dữ liệu trả về không hợp lệ");
        }

        // Kiểm tra dữ liệu trả về có đúng là mảng không.
        const filteredData = res.data.filter((item) => item.count > 0);

        // Lọc bỏ các quận có count = 0.
        setData(filteredData);
        setColors(generateColors(filteredData.length));
      } catch (err) {
        console.error("❌ API thất bại:", err);
        setError("Không thể tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (data.length === 0) return <div>Không có dữ liệu</div>;

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
            outerRadius={100} // Tăng kích thước biểu đồ tròn
            label={renderCustomLabel}
            labelLine={false} // <-- dòng này sẽ loại bỏ tua rua
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
