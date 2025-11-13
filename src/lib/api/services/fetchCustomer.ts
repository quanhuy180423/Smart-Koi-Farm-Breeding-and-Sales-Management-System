import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse } from "../apiClient";

export interface RecentOrder {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: string;
  totalAmount: number;
}

export interface Customer {
  id: number;
  applicationUserId: number;
  userName: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  contactNumber: string;
  totalOrders: number;
  totalSpent: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  recentOrders: RecentOrder[];
}

export interface CustomerPagedResponse {
  pageIndex: number;
  totalPages: number;
  totalItems: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  datas: Customer[];
}

export interface CustomerSearchParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  isActive?: boolean;
}

const baseUrl = "/api/Customer";

export const customerService = {
  getCustomers: async (
    params: CustomerSearchParams,
  ): Promise<BaseResponse<CustomerPagedResponse>> => {
    const filter = toRequestParams({
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search,
      isActive: params.isActive,
    });
    const response = await apiService.get<BaseResponse<CustomerPagedResponse>>(
      baseUrl,
      filter,
    );
    return response.data;
  },
};

export default customerService;
