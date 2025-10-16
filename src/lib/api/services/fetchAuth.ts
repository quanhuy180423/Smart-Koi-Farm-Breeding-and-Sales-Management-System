import apiService from "../apiClient";

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
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result?: {
    id: string;
    userName: string;
    emailAddress: string;
    phoneNumBer: string;
  };
}

export interface LoginRequest {
  // backend expects a single field for either username or email
  userNameOrEmail?: string;
  password?: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result?: {
    token?: string;
    refreshToken?: string;
  };
}

export interface SignOutRequest {
  refreshToken: string;
}

export interface SignOutResponse {
  statusCode: string;
  isSuccess: boolean;
  message: string;
  result?: {
    isSuccess: boolean;
    message?: string;
  };
}

export const fetchAuth = {
  // Register new user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
      const response = await apiService.post<RegisterResponse, RegisterRequest>(
        "/api/Accounts/sign-up",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiService.post<LoginResponse, LoginRequest>(
        "/api/Accounts/authen",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  // Sign out (invalidate refresh token)
  signOut: async (data: SignOutRequest): Promise<SignOutResponse> => {
    try {
      const response = await apiService.post<SignOutResponse, SignOutRequest>(
        "/api/Accounts/sign-out",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default fetchAuth;
