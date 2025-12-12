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
  createdAt: string;
  updatedAt: string | null;
  recentOrders: RecentOrder[];
}

export interface CustomerSearchParams {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  minTotalSpent?: number;
  maxTotalSpent?: number;
  minTotalOrders?: number;
  maxTotalOrders?: number;
  createdFrom?: string;
  createdTo?: string;
  contactNumber?: string;
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
      minTotalSpent: params.minTotalSpent,
      maxTotalSpent: params.maxTotalSpent,
      minTotalOrders: params.minTotalOrders,
      maxTotalOrders: params.maxTotalOrders,
      createdFrom: params.createdFrom,
      createdTo: params.createdTo,
      contactNumber: params.contactNumber,
    });
    const response = await apiService.get<
      BaseResponse<PagedResponse<Customer>>
    >(baseUrl, filter);
    return response.data;
  },
};

export default customerService;
