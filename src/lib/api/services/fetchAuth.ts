import apiService, { BaseResponse } from "../apiClient";

export enum Roles {
  Manager = "Manager",
  FarmStaff = "FarmStaff",
  SaleStaff = "SaleStaff",
  Customer = "Customer",
}

export interface RegisterRequest {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phoneNumber: string;
  role: Roles;
}

export interface RegisterResponse {
  id: string;
  userName: string;
  emailAddress: string;
  phoneNumBer: string;
}

export interface LogginGoogleRequest {
  idToken: string;
}

export interface LoginRequest {
  // backend expects a single field for either username or email
  userNameOrEmail?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
}

export interface SignOutRequest {
  refreshToken: string;
}

export interface Response {
  isSuccess: boolean;
  message?: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmedNewPassword: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

const baseUrl = "/api/Accounts";

export const fetchAuth = {
  // Register new user
  register: async (
    data: RegisterRequest,
  ): Promise<BaseResponse<RegisterResponse>> => {
    try {
      const response = await apiService.post<
        BaseResponse<RegisterResponse>,
        RegisterRequest
      >(`${baseUrl}/sign-up`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Login
  login: async (data: LoginRequest): Promise<BaseResponse<LoginResponse>> => {
    try {
      const response = await apiService.post<
        BaseResponse<LoginResponse>,
        LoginRequest
      >(`${baseUrl}/authen`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Sign out (invalidate refresh token)
  signOut: async (data: SignOutRequest): Promise<BaseResponse<Response>> => {
    try {
      const response = await apiService.post<
        BaseResponse<Response>,
        SignOutRequest
      >(`${baseUrl}/sign-out`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Google sign-in using idToken (backend will validate token and return normal login response)
  authenGoogle: async (
    data: LogginGoogleRequest,
  ): Promise<BaseResponse<LoginResponse>> => {
    try {
      const response = await apiService.post<
        BaseResponse<LoginResponse>,
        LogginGoogleRequest
      >(`${baseUrl}/authen-google`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Forgot password - sends reset link if email exists
  forgotPassword: async (data: ForgotPasswordRequest) => {
    try {
      const response = await apiService.post<
        BaseResponse<Response>,
        ForgotPasswordRequest
      >(`"${baseUrl}/forgot-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Reset password - called from the link user receives by email
  resetPassword: async (data: ResetPasswordRequest) => {
    try {
      const response = await apiService.post<
        BaseResponse<Response>,
        ResetPasswordRequest
      >(`"${baseUrl}/reset-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default fetchAuth;
