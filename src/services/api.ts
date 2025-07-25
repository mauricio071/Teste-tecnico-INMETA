import axios from "axios";
import { useAuthStore } from "@/store/auth";

const api = axios.create({
  baseURL: "https://cards-marketplace-api-2fjj.onrender.com",
});

api.interceptors.request.use((config) => {
  try {
    const auth = useAuthStore();
    const token = auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Interceptor executado fora do contexto: ", error);
  }
  return config;
});

export default api;
