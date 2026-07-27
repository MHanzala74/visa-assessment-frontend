import axios from "axios";

// Render backend URL
export const BASE_URL = "https://visa-assessment-1.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach Basic Auth header automatically if credentials exist
api.interceptors.request.use((config) => {
  const raw = localStorage.getItem("pc_auth");
  if (raw) {
    const { username, password } = JSON.parse(raw);
    config.auth = { username, password };
  }
  return config;
});

export default api;
