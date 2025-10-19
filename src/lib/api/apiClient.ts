import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
// cookie helpers intentionally not imported here; auth store manages cookie lifecycle
// import { useAuthStore } from "@/lib/store/authStore";

// API error response data structure
export interface ApiErrorData {
  statusCode: number;
  isSuccess: boolean;
  message: string;
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

// API service class
export class ApiService {
  private client: AxiosInstance;
  private authToken: string | null = null;
  private onAuthError?: () => void;

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

  // Setup request/response interceptors
  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
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

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiErrorData>) => {
        // Handle authentication errors
        if (error.response?.status === 401 && this.onAuthError) {
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
            statusCode: error.response?.data.statusCode || 500,
            isSuccess: error.response?.data?.isSuccess || false,
            message: error.response?.data?.message || "",
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
