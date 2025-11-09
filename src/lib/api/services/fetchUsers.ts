import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse } from "../apiClient";

export interface StaffUser {
  id: number;
  fullName: string;
  role: string;
  isDeleted: boolean;
  email: string;
}

export interface StaffPagedResponse {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  datas: StaffUser[];
}

export interface StaffSearchParams {
  role: string;
  pageIndex?: number;
  pageSize?: number;
  search?: string;
}

const baseUrl = "/api/Users";

export const usersService = {
  getStaffByRole: async (
    params: StaffSearchParams,
  ): Promise<BaseResponse<StaffPagedResponse>> => {
    const filter = toRequestParams({
      role: params.role,
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search || undefined,
    });

    const response = await apiService.get<BaseResponse<StaffPagedResponse>>(
      `${baseUrl}/by-role`,
      filter,
    );
    return response.data;
  },
};

export default usersService;
