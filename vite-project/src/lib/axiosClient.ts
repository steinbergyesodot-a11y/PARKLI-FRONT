import axios from "axios";

const backendBaseUrl =
  import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:4000";

const api = axios.create({
  baseURL: backendBaseUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export const getApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${backendBaseUrl}${normalizedPath}`;
};

export default api;