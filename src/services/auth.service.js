import api from "./api";

// Matches your Flask Backend Routes
const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

const register = (userData) => {
  return api.post("/auth/register", userData);
};

const logout = () => {
  localStorage.removeItem("token");
};

export default {
  login,
  register,
  logout,
};
