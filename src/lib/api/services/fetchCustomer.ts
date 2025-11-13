import toRequestParams from "@/lib/utils/params";
import apiService, { BaseResponse, PagedResponse } from "../apiClient";

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
  ): Promise<BaseResponse<PagedResponse<Customer>>> => {
    const filter = toRequestParams({
      pageIndex: params.pageIndex || 1,
      pageSize: params.pageSize || 10,
      search: params.search,
      isActive: params.isActive,
    });
    const response = await apiService.get<
      BaseResponse<PagedResponse<Customer>>
    >(baseUrl, filter);
    return response.data;
  },
};

export default customerService;
