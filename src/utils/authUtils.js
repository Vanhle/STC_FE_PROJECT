// hàm kiểm tra token

export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  const expiredAt = localStorage.getItem("tokenExpiredAt");
  return token && expiredAt && Date.now() < Number(expiredAt);
};
