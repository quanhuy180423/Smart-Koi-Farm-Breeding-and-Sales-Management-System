import toRequestParams from "@/lib/utils/params";
import apiService, {
  BaseResponse,
  PagedResponse,
  PagingRequest,
} from "../apiClient";
import { PaymentMethod } from "./fetchOrderPayment";

export enum PaymentTransactionStatus {
  Pending = "Pending",
  Success = "Success",
  Failed = "Failed",
  Cancelled = "Cancelled",
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  paymentMethod: PaymentMethod;
  orderId: string;
  actualOrderId: number;
  amount: number;
  description: string;
  transactionId: string | null;
  status: PaymentTransactionStatus | string;
  paymentUrl: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface PaymentTransactionSearchParams extends PagingRequest {
  search?: string;
  paymentMethod?: PaymentMethod | string;
  status?: PaymentTransactionStatus | string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

const baseUrl = "/api/PaymentTransaction";

const paymentTransactionService = {
  getPaymentTransactions: async (
    request: PaymentTransactionSearchParams,
  ): Promise<BaseResponse<PagedResponse<PaymentTransaction>>> => {
    const filter = toRequestParams(request);
    const response = await apiService.get<
      BaseResponse<PagedResponse<PaymentTransaction>>
    >(`${baseUrl}/me`, { ...filter });
    return response.data;
  },
};

export default paymentTransactionService;
