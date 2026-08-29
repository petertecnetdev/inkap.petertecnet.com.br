import axios from "axios";
import { apiBaseUrl } from "../config";

const APP_SLUG = "inkap";

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 20000,
  headers: {
    Accept: "application/json",
    "X-Peter-App": APP_SLUG,
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers = config.headers || {};
  config.headers["X-Peter-App"] = APP_SLUG;
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
