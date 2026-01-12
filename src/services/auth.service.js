import api from "./api";

// Matches your Flask Backend Routes
// NOTE: All routes must include /api prefix since baseURL is http://127.0.0.1:5000
const login = (email, password) => {
  return api.post("/api/auth/login", { email, password });
};

const register = (userData) => {
  return api.post("/api/auth/register", userData);
};

const logout = () => {
  localStorage.removeItem("token");
};

export default {
  login,
  register,
  logout,
};
