import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookie, setCookie } from "cookies-next";
import { LoginResponse, RenewTokenRequest } from "./services/fetchAuth";
import { useAuthStore } from "@/store/auth-store";
import { redirect } from "next/navigation";

// API error response data structure
export interface ApiErrorData {
  statusCode: number;
  isSuccess: boolean;
  message: string;
  result: string;
}

// Error interface
export interface ApiError {
  status?: number;
  message: string;
  error?: ApiErrorData;
}

// Response wrapper
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
}

// Request parameters object
export interface RequestParams {
  [key: string]: string | number | boolean | undefined | null | string[];
}

// Basic Response from Backend
export interface BaseResponse<T> {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result: T;
}

export interface PagedResponse<T> {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T[];
}

export interface PagingRequest {
  pageIndex: number;
  pageSize: number;
}

export interface FailedRequestQueueItem {
  resolve: (value: AxiosResponse<unknown>) => void;
  reject: (reason?: ApiError) => void;
  config: AxiosRequestConfig;
}

// API service class
export class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private onAuthError?: () => void;

  private isRefreshing = false;
  private failedQueue: FailedRequestQueueItem[] = [];

  constructor(baseURL: string, timeout = 10000, onAuthError?: () => void) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
      timeout,
    });

    // Khởi tạo token từ cookie khi tạo instance
    if (typeof window !== "undefined") {
      const token = getCookie("auth-token")?.toString();
      if (token) {
        this.authToken = token;
      }
    }

    this.onAuthError = onAuthError;
    this.setupInterceptors();
  }

  // Set auth token
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Get current auth token
  getAuthToken(): string | null {
    return this.authToken;
  }

  // Process failed request queue
  private processQueue(error: ApiError | null): void {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        this.client(prom.config)
          .then(prom.resolve)
          .catch((err: AxiosError<ApiErrorData>) => {
            const apiError: ApiError = {
              status: err.response?.status,
              message:
                err.response?.data?.message ||
                err.message ||
                "Unknown error occurred during request retry",
              error: {
                statusCode: err.response?.data?.statusCode || 500,
                isSuccess: err.response?.data?.isSuccess || false,
                message: err.response?.data?.message || "",
                result: err.response?.data?.result || "",
              },
            };
            prom.reject(apiError);
          });
      }
    });
    this.failedQueue = [];
  }

  // Refresh access token using refresh token
  private async refreshAccessToken(): Promise<string | null> {
    const refreshToken = getCookie("refresh-token")?.toString() || "";
    const accessToken = getCookie("auth-token")?.toString() || "";

    if (!refreshToken) {
      console.warn("⚠️ No refresh token available");
      return null;
    }

    const request: RenewTokenRequest = { accessToken, refreshToken };

    try {
      const refreshResponse = await axios.post<BaseResponse<LoginResponse>>(
        `${this.client.defaults.baseURL}api/Accounts/renew-token`,
        request,
        { headers: { "Content-Type": "application/json" } },
      );

      if (
        refreshResponse.data.isSuccess &&
        refreshResponse.data.result?.accessToken
      ) {
        const newAccessToken = refreshResponse.data.result.accessToken;
        const newRefreshToken = refreshResponse.data.result.refreshToken;

        // Update token in multiple places
        setCookie("auth-token", newAccessToken);
        this.authToken = newAccessToken;

        if (newRefreshToken) {
          setCookie("refresh-token", newRefreshToken);
        }

        useAuthStore.getState().setToken(newAccessToken);

        return newAccessToken;
      }
    } catch {
      redirect("/login");
    }

    return null;
  }

  // Setup request/response interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Auto-sync token from cookie if not set
        if (!this.authToken && typeof window !== "undefined") {
          const cookieToken = getCookie("auth-token")?.toString();
          if (cookieToken) {
            this.authToken = cookieToken;
          }
        }

        // Add auth header if token exists
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        // Handle FormData automatically
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor with token refresh logic
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorData>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthError = error.response?.status === 401;

        // Handle 401 errors with token refresh
        if (isAuthError && !originalRequest._retry) {
          originalRequest._retry = true;

          // Queue requests if already refreshing
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                config: originalRequest,
                resolve,
                reject: (reason) => reject(reason),
              });
            });
          }

          this.isRefreshing = true;

          // Attempt to refresh token
          const newAccessToken = await this.refreshAccessToken();

          if (newAccessToken) {
            // Token refresh successful
            this.processQueue(null);
            this.isRefreshing = false;

            // Retry original request with new token
            return this.client(originalRequest);
          } else {
            // Token refresh failed
            const apiError: ApiError = {
              status: 401,
              message: "Authentication failed. Please log in again.",
            };
            this.processQueue(apiError);
            this.isRefreshing = false;

            if (this.onAuthError) {
              this.onAuthError();
            }

            return Promise.reject(apiError);
          }
        }

        // Handle auth error after retry
        if (isAuthError && originalRequest._retry && this.onAuthError) {
          this.onAuthError();
        }

        // Standardize error format
        const apiError: ApiError = {
          status: error.response?.status,
          message:
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred",
          error: {
            statusCode: error.response?.data?.statusCode || 500,
            isSuccess: error.response?.data?.isSuccess || false,
            message: error.response?.data?.message || "",
            result: error.response?.data?.result || "",
          },
        };

        return Promise.reject(apiError);
      },
    );
  }

  // Process parameters for GET requests
  private createParams(params?: RequestParams): URLSearchParams | undefined {
    if (!params) return undefined;

    const urlParams = new URLSearchParams();

    // Sort parameters with priority: ward > city > others
    const orderedKeys = Object.keys(params).sort((a, b) => {
      if (a === "ward" && b !== "ward") return -1;
      if (b === "ward" && a !== "ward") return 1;
      if (a === "city" && b !== "city") return -1;
      if (b === "city" && a !== "city") return 1;
      return a.localeCompare(b);
    });

    orderedKeys.forEach((key) => {
      const value = params[key];
      if (value === undefined || value === null) return;

      if (Array.isArray(value)) {
        value.forEach((item) => urlParams.append(key, String(item)));
      } else {
        urlParams.append(key, String(value));
      }
    });

    return urlParams;
  }

  // Generic request method
  private async request<T>(
    config: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.client(config);

    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, string>,
    };
  }

  // GET request
  async get<T>(url: string, params?: RequestParams): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url,
      params: this.createParams(params),
    });
  }

  // GET blob (for file downloads)
  async getBlob(url: string, params?: RequestParams): Promise<Blob> {
    const response = await this.client.get(url, {
      params: this.createParams(params),
      responseType: "blob",
    });
    return response.data;
  }

  // POST request
  async post<T, D = Record<string, unknown> | FormData>(
    url: string,
    data?: D,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data,
    });
  }

  // PUT request
  async put<T, D = Record<string, unknown> | FormData>(
    url: string,
    data?: D,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
    });
  }

  // DELETE request
  async delete<T>(
    url: string,
    params?: RequestParams,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
      params: this.createParams(params),
    });
  }

  // PATCH request
  async patch<T, D = Record<string, unknown> | FormData>(
    url: string,
    data?: D,
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PATCH",
      url,
      data,
    });
  }

  // Upload file(s) with progress tracking
  async upload<T>(
    url: string,
    files: File | File[],
    fieldName = "file",
    additionalData?: Record<string, string | number | boolean>,
    onProgress?: (percentage: number) => void,
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();

    // Add file(s)
    if (Array.isArray(files)) {
      files.forEach((file) => formData.append(fieldName, file));
    } else {
      formData.append(fieldName, files);
    }

    // Add additional data
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
    }

    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentage = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 100),
            );
            onProgress(percentage);
          }
        : undefined,
    });
  }
}

// Create and export the default API service instance
const apiService = new ApiService(
  process.env.NEXT_PUBLIC_API_URL_BACKEND || "",
  600000,
  () => {
    // Handle 401 errors by dispatching logout event
    if (typeof window !== "undefined") {
      console.warn("🚪 Auth error - dispatching logout event");
      window.dispatchEvent(new Event("logout"));
    }
  },
);

export default apiService;
