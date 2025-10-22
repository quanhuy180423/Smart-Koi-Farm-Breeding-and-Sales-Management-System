import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { getCookie, setCookie } from "cookies-next";
import { LoginResponse, RenewTokenRequest } from "./services/fetchAuth";
import { useAuthStore } from "@/store/auth-store";
// cookie helpers intentionally not imported here; auth store manages cookie lifecycle
// import { useAuthStore } from "@/lib/store/authStore";

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

    this.onAuthError = onAuthError;
    this.setupInterceptors();
  }

  // Set auth token
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Phương thức xử lý hàng đợi các request thất bại
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

  private async refreshAccessToken(): Promise<string | null> {
    // **Ghi chú:** Cần lấy refreshToken từ cookie/storage tại đây
    const refreshToken = getCookie("refresh-token")?.toString() || "";
    const accessToken = getCookie("auth-token")?.toString() || "";
    if (!refreshToken) return null;

    const request: RenewTokenRequest = {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    try {
      const refreshResponse = await axios.post<BaseResponse<LoginResponse>>(
        `${this.client.defaults.baseURL}/api/Accounts/renew-token`,
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (
        refreshResponse.data.isSuccess &&
        refreshResponse.data.result?.accessToken
      ) {
        const newAccessToken = refreshResponse.data.result.accessToken;
        const newRefreshToken = refreshResponse.data.result.refreshToken;

        this.setAuthToken(newAccessToken);

        this.client.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;

        setCookie("auth-token", newAccessToken);
        if (newRefreshToken) setCookie("refresh-token", newRefreshToken);
        useAuthStore.getState().setToken(newAccessToken);

        return newAccessToken;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
    return null;
  }

  // Setup request/response interceptors
  // private setupInterceptors(): void {
  //   // Request interceptor
  //   this.client.interceptors.request.use(
  //     (config) => {
  //       // Add auth header if token exists
  //       if (this.authToken) {
  //         config.headers.Authorization = `Bearer ${this.authToken}`;
  //       }

  //       // Handle FormData automatically
  //       if (config.data instanceof FormData) {
  //         delete config.headers["Content-Type"];
  //       }

  //       return config;
  //     },
  //     (error) => Promise.reject(error)
  //   );

  //   // Response interceptor
  //   this.client.interceptors.response.use(
  //     (response) => response,
  //     (error: AxiosError<ApiErrorData>) => {
  //       // Handle authentication errors
  //       if (error.response?.status === 401 && this.onAuthError) {
  //         this.onAuthError();
  //       }

  //       // Standardize error format
  //       const apiError: ApiError = {
  //         status: error.response?.status,
  //         message:
  //           error.response?.data?.message ||
  //           error.message ||
  //           "Unknown error occurred",
  //         error: {
  //           statusCode: error.response?.data.statusCode || 500,
  //           isSuccess: error.response?.data?.isSuccess || false,
  //           message: error.response?.data?.message || "",
  //           result: error.response?.data?.result || "",
  //         },
  //       };

  //       return Promise.reject(apiError);
  //     }
  //   );
  // }
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }

        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError<ApiErrorData>) => {
        const originalRequest = error.config as AxiosRequestConfig & {
          _retry?: boolean;
        };

        const isAuthError = error.response?.status === 401;

        if (isAuthError && !originalRequest._retry) {
          originalRequest._retry = true;

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

          const newPromise = new Promise((resolve, reject) => {
            this.failedQueue.push({
              config: originalRequest,
              resolve,
              reject: (reason) => reject(reason),
            });
          });

          const newAccessToken = await this.refreshAccessToken();

          if (newAccessToken) {
            this.processQueue(null);
          } else {
            const apiError: ApiError = {
              status: 401,
              message: "Authentication failed. Please log in again.",
            };
            this.processQueue(apiError);
            if (this.onAuthError) {
              this.onAuthError();
            }
          }

          this.isRefreshing = false;
          return newPromise;
        }

        if (isAuthError && this.onAuthError) {
          if (originalRequest._retry) {
            this.onAuthError();
          }
        }

        const apiError: ApiError = {
          status: error.response?.status,
          message:
            error.response?.data?.message ||
            error.message ||
            "Unknown error occurred",
          error: {
            statusCode: error.response?.data.statusCode || 500,
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
    // Handle FormData in config.data
    if (config.data instanceof FormData) {
      // FormData will be handled by the interceptor which removes Content-Type
      // to let the browser set the correct boundary
    }

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

  // Upload file(s)
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
    // Handle 401 errors by clearing auth state
    if (typeof window !== "undefined") {
      // Dispatch logout event for other components to handle.
      // Do NOT delete auth cookies here — leave cookie removal to the auth store's signOut/logout
      // so the app can call backend sign-out and perform cleanup in a single place.
      window.dispatchEvent(new Event("logout"));
    }
  },
);

export default apiService;
