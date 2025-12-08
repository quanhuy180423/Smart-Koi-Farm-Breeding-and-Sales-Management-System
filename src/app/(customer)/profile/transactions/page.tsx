"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Receipt, Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { formatDate, DATE_FORMATS } from "@/lib/utils/dates";
import CustomerLayout from "@/components/customer/CustomerLayout";
import { useGetPaymentTransactions } from "@/hooks/usePaymentTransaction";
import {
  PaymentTransactionStatus,
  PaymentTransactionSearchParams,
  PaymentTransaction,
} from "@/lib/api/services/fetchPaymentTransaction";
import { PaymentMethod } from "@/lib/api/services/fetchOrderPayment";

interface StatusConfig {
  label: string;
  color: string;
}

const statusConfig: Record<string, StatusConfig> = {
  Pending: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  Success: { label: "Thành công", color: "bg-green-100 text-green-800" },
  Failed: { label: "Thất bại", color: "bg-red-100 text-red-800" },
  Cancelled: { label: "Đã hủy", color: "bg-gray-100 text-gray-800" },
};

const getPaymentMethodLabel = (method: string): string => {
  const methodMap: Record<string, string> = {
    VnPay: "VnPay",
    PayOS: "PayOS",
  };
  return methodMap[method] || method;
};

const getStatusConfig = (status: string): StatusConfig => {
  return (
    statusConfig[status] || {
      label: status,
      color: "bg-gray-100 text-gray-800",
    }
  );
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pageIndex, setPageIndex] = useState(1);
  const pageSize = 10;

  const [searchParams, setSearchParams] =
    useState<PaymentTransactionSearchParams>({
      pageIndex,
      pageSize,
      search: undefined,
      paymentMethod: undefined,
      status: undefined,
    });

  // Update search params when filters change
  useEffect(() => {
    const params: PaymentTransactionSearchParams = {
      pageIndex: 1,
      pageSize,
      search: searchTerm || undefined,
    };

    if (methodFilter !== "all") {
      params.paymentMethod = methodFilter as PaymentMethod;
    }

    if (statusFilter !== "all") {
      params.status = statusFilter as PaymentTransactionStatus;
    }

    setSearchParams(params);
    setPageIndex(1);
  }, [searchTerm, methodFilter, statusFilter]);

  const { data: pagedResponse, isLoading } =
    useGetPaymentTransactions(searchParams);

  const transactions = pagedResponse?.data || [];

  const TransactionCard = ({
    transaction,
  }: {
    transaction: PaymentTransaction;
  }) => {
    const statusConfigItem = getStatusConfig(transaction.status);
    const methodLabel = getPaymentMethodLabel(transaction.paymentMethod);

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex items-start gap-3 md:gap-4 flex-1">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-800 shrink-0">
                <Receipt className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-lg leading-tight">
                  {transaction.description}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs md:text-sm text-muted-foreground">
                  <span className="font-medium">
                    {formatDate(
                      transaction.createdAt,
                      DATE_FORMATS.DATETIME_24H,
                    )}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span>{methodLabel}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center md:flex-col md:items-end md:text-right md:space-y-2">
              <Badge
                className={`${statusConfigItem.color} font-medium text-xs md:order-2`}
              >
                {statusConfigItem.label}
              </Badge>
              <p className="font-bold text-lg md:text-xl text-red-600 md:order-1">
                -{formatCurrency(Math.abs(transaction.amount))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <CustomerLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Lịch sử chi tiêu</h1>
            <p className="text-muted-foreground">
              Theo dõi các giao dịch mua hàng của bạn
            </p>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {isLoading ? null : (
          <>
            {/* Desktop Search and Filter */}
            <div className="hidden md:block mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm theo mã giao dịch, tên cá Koi hoặc mã đơn hàng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-[180px] rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                      <SelectValue placeholder="Phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value={PaymentMethod.VNPAY}>VnPay</SelectItem>
                      <SelectItem value={PaymentMethod.PAYOS}>PayOS</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Success}>
                        Thành công
                      </SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Pending}>
                        Đang xử lý
                      </SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Failed}>
                        Thất bại
                      </SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Cancelled}>
                        Đã hủy
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}

        {isLoading ? null : (
          <>
            {/* Desktop View */}
            <div className="hidden md:block space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Không tìm thấy giao dịch nào
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Thử thay đổi bộ lọc tìm kiếm
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {isLoading ? null : (
          <>
            {/* Mobile View */}
            <div className="md:hidden space-y-6">
              {/* Search and Filter */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm giao dịch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Select value={methodFilter} onValueChange={setMethodFilter}>
                    <SelectTrigger className="w-full rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                      <SelectValue placeholder="Phương thức" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value={PaymentMethod.VNPAY}>VnPay</SelectItem>
                      <SelectItem value={PaymentMethod.PAYOS}>PayOS</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Success}>
                        Thành công
                      </SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Pending}>
                        Đang xử lý
                      </SelectItem>
                      <SelectItem value={PaymentTransactionStatus.Failed}>
                        Thất bại
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* All Transactions */}
              <div className="space-y-4">
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TransactionCard
                      key={transaction.id}
                      transaction={transaction}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Không tìm thấy giao dịch nào
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Thử thay đổi bộ lọc tìm kiếm
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
