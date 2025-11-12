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

const userUrl = "/api/Users";
const accountUrl = "/api/Accounts";

export const usersService = {
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
