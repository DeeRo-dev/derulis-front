import axios from "axios";
import { clearSession, getToken } from "./auth-storage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* El backend devuelve 401 tanto por sesión vencida como por credenciales
   inválidas en /auth/login. Si tratamos ambos casos igual, un error de
   contraseña recarga la página y el usuario nunca ve el mensaje. */
const isAuthEndpoint = (url?: string) => Boolean(url?.includes("/auth/"));

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401 && !isAuthEndpoint(url)) {
      clearSession();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export function getApiStatus(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "response" in error) {
    return (error as { response?: { status?: number } }).response?.status;
  }
  return undefined;
}

export const isNotFound = (error: unknown) => getApiStatus(error) === 404;

/** Extrae el mensaje que manda Nest, que puede venir como string o array. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const message = (
      error as { response?: { data?: { message?: string | string[] } } }
    ).response?.data?.message;

    if (Array.isArray(message)) return message[0] ?? fallback;
    if (typeof message === "string") return message;
  }
  return fallback;
}
