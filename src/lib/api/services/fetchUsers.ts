import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse } from "../apiClient";
import { Roles } from "./fetchAuth";

export interface User {
  id: number;
  fullName: string;
  role: string;
  isBlocked: boolean;
  email: string;
}

export interface UserPagedResponse {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  datas: User[];
}

export interface UserSearchParams {
  role?: Roles;
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  isBlocked?: boolean;
}

export interface CreateStaffAccountRequest {
  email: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  password: string;
}

export interface CreateStaffAccountResponse {
  id: number;
  email: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  tempPassword: string;
}

export interface BlockAccountRequest {
  userId: number;
}

export interface ImportedAccount {
  id: number;
  email: string;
  userName: string;
  fullName: string;
  phoneNumber: string;
  role: string;
  tempPassword: string;
}

export interface ImportError {
  rowNumber: number;
  email: string;
  errorMessage: string;
}

export interface ImportAccountsResponse {
  totalRows: number;
  successCount: number;
  failureCount: number;
  successfulAccounts: ImportedAccount[];
  errors: ImportError[];
}

export interface UserDetails {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  avatarURL: string;
  address: string;
  role: Roles;
}

export interface UpdateProfileRequest {
  fullName: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  avatarURL: string;
  address: string;
}

export interface UpdateProfileResponse {
  id: number;
  fullName: string;
  role: string;
  isBlocked: boolean;
  email: string;
}

const userUrl = "/api/Users";
const accountUrl = "/api/Accounts";
const userDetailsUrl = "/api/UserDetails";

export const usersService = {
  getUserDetails: async (): Promise<BaseResponse<UserDetails>> => {
    const response = await apiService.get<BaseResponse<UserDetails>>(
      `${userDetailsUrl}/get-me`,
    );
    return response.data;
  },

  updateProfile: async (
    data: UpdateProfileRequest,
  ): Promise<BaseResponse<UpdateProfileResponse>> => {
    const response = await apiService.put<BaseResponse<UpdateProfileResponse>>(
      `${userUrl}/profile`,
      data as unknown as Record<string, unknown>,
    );
    return response.data;
  },

  getUserByRole: async (
    params: UserSearchParams,
  ): Promise<BaseResponse<UserPagedResponse>> => {
    const filter = toRequestParams({
      role: params.role,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search || undefined,
    });

    const response = await apiService.get<BaseResponse<UserPagedResponse>>(
      `${userUrl}/by-role`,
      filter,
    );
    return response.data;
  },

  createStaffAccount: async (
    data: CreateStaffAccountRequest,
  ): Promise<BaseResponse<CreateStaffAccountResponse>> => {
    const response = await apiService.post<
      BaseResponse<CreateStaffAccountResponse>
    >(`${accountUrl}/staff`, data as unknown as Record<string, unknown>);
    return response.data;
  },

  toggleBlockAccount: async (
    userId: number,
  ): Promise<BaseResponse<boolean>> => {
    const response = await apiService.put<BaseResponse<boolean>>(
      `${accountUrl}/${userId}/toggle-block`,
      {},
    );
    return response.data;
  },

  importStaffAccounts: async (
    file: File,
  ): Promise<BaseResponse<ImportAccountsResponse>> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiService.post<
      BaseResponse<ImportAccountsResponse>
    >(
      `${accountUrl}/staff/import`,
      formData as unknown as Record<string, unknown>,
    );
    return response.data;
  },
};

export default usersService;
