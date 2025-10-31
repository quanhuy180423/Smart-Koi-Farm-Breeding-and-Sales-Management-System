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

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  confirmedNewPassword: string;
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface RenewTokenRequest {
  accessToken: string;
  refreshToken: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
}

const baseUrl = "/api/Accounts";

export const fetchAuth = {
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
  signOut: async (data: SignOutRequest): Promise<BaseResponse<string>> => {
    try {
      const response = await apiService.post<
        BaseResponse<string>,
        SignOutRequest
      >(`${baseUrl}/sign-out`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
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
  forgotPassword: async (data: ForgotPasswordRequest) => {
    try {
      const response = await apiService.post<
        BaseResponse<string>,
        ForgotPasswordRequest
      >(`${baseUrl}/forgot-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (data: ResetPasswordRequest) => {
    try {
      const response = await apiService.post<
        BaseResponse<string>,
        ResetPasswordRequest
      >(`${baseUrl}/reset-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  renewToken: async (
    data: RenewTokenRequest,
  ): Promise<BaseResponse<LoginResponse>> => {
    try {
      const response = await apiService.post<
        BaseResponse<LoginResponse>,
        RenewTokenRequest
      >(`${baseUrl}/renew-token`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  changePassword: async (
    data: ChangePasswordRequest,
  ): Promise<BaseResponse<LoginResponse>> => {
    try {
      const response = await apiService.post<
        BaseResponse<LoginResponse>,
        ChangePasswordRequest
      >(`${baseUrl}/change-password`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default fetchAuth;
