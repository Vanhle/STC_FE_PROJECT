import axios from "axios";

// Base URL của API backend
const BASE_URL = "http://localhost:8080";

// Tạo instance axios
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 giây
});

// Interceptor cho request: tự động thêm accessToken nếu còn hạn
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const expiredAt = localStorage.getItem("tokenExpiredAt");
    // Nếu có token và còn hạn thì thêm vào header
    if (token && expiredAt && Date.now() < Number(expiredAt)) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
