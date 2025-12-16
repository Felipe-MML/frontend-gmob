import axios from "axios";

const api = axios.create({
  baseURL: "https://gmob-backend.onrender.com/api",
});

// Intercepta requisições e injeta o token
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepta respostas para capturar 401 (token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.reload(); // ou: window.location.href = "/login"
    }
    return Promise.reject(error);
  }
);

export default api;
