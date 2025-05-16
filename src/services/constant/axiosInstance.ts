import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { BASE_URL } from "./apiConfig";

// ========================
// Type Definitions
// ========================
export interface ApiResponse<T = unknown> {
  user: T;
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  status: number;
  message: string;
  isNetworkError?: boolean;
}

// ========================
// Token Helpers
// ========================
const getToken = (): string | null => localStorage.getItem("token");
const removeToken = (): void => localStorage.removeItem("token");

// ========================
// Create Axios Instance
// ========================
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ========================
// Request Interceptor
// ========================
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Optional: add request time for debugging
    (config as any).metadata = { startTime: new Date() };
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ========================
// Response Interceptor
// ========================
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Optional: measure duration
    const config = response.config as any;
    if (config.metadata?.startTime) {
      const duration =
        new Date().getTime() - config.metadata.startTime.getTime();
      console.log(
        `[${response.config.method?.toUpperCase()}] ${
          response.config.url
        } - ${duration}ms`
      );
    }

    return response;
  },
  (error: AxiosError) => {
    console.error("API Error:", error);

    // Handle 401: Unauthorized
    if (error.response?.status === 401) {
      removeToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject({
      status: error.response?.status ?? 500,
      message:
        error.response?.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? error.response.data.message
          : error.message || "Unknown error",
      isNetworkError: !error.response,
    } as ApiError);
  }
);

export const apiMethods = {
  get: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> => axiosInstance.get(url, config),

  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    axiosInstance.post(url, data, config),

  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    axiosInstance.put(url, data, config),

  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    axiosInstance.patch(url, data, config),

  delete: <T = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    axiosInstance.delete(url, config),

  upload: <T = unknown>(
    url: string,
    formData: FormData,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponse<T>>> =>
    axiosInstance.post(url, formData, {
      ...config,
      headers: {
        ...(config?.headers || {}),
        "Content-Type": "multipart/form-data",
      },
    }),

  download: (
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<Blob>> =>
    axiosInstance.get(url, {
      ...config,
      responseType: "blob",
    }),
};

export default axiosInstance;
