"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  CreditCard,
  Receipt,
  Gift,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import CustomerLayout from "@/components/customer/CustomerLayout";

// Type definitions
interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  description: string;
  amount: number;
  status: TransactionStatus;
  method: PaymentMethod;
  orderId: string | null;
  reference: string;
}

type TransactionType = "purchase" | "refund" | "reward";
type TransactionStatus = "completed" | "pending" | "failed";
type PaymentMethod = "bank_transfer" | "cod" | "wallet" | "credit_card";

interface StatusConfig {
  label: string;
  color: string;
}

// Mock transaction data - chỉ giao dịch chi tiêu
const mockTransactions: Transaction[] = [
  {
    id: "TXN001234",
    date: "2024-01-28",
    type: "purchase",
    description: "Mua cá Koi Kohaku 35cm",
    amount: -8000000,
    status: "completed",
    method: "bank_transfer",
    orderId: "KOI001237",
    reference: "VCB20240128001",
  },
  {
    id: "TXN001235",
    date: "2024-01-25",
    type: "purchase",
    description: "Mua cá Koi Sanke 40cm + phụ kiện",
    amount: -12000000,
    status: "completed",
    method: "cod",
    orderId: "KOI001236",
    reference: "COD20240125001",
  },
  {
    id: "TXN001236",
    date: "2024-01-20",
    type: "purchase",
    description: "Mua cặp cá Koi Showa cao cấp",
    amount: -35000000,
    status: "completed",
    method: "bank_transfer",
    orderId: "KOI001235",
    reference: "VCB20240120001",
  },
  {
    id: "TXN001237",
    date: "2024-01-15",
    type: "purchase",
    description: "Mua cá Koi Tancho + thức ăn",
    amount: -25000000,
    status: "completed",
    method: "cod",
    orderId: "KOI001234",
    reference: "COD20240115001",
  },
  {
    id: "TXN001238",
    date: "2024-01-12",
    type: "purchase",
    description: "Mua cá Koi Shusui + hệ thống lọc",
    amount: -18000000,
    status: "completed",
    method: "bank_transfer",
    orderId: "KOI001233",
    reference: "VCB20240112001",
  },
  {
    id: "TXN001239",
    date: "2024-01-05",
    type: "purchase",
    description: "Mua thức ăn cao cấp cho cá Koi",
    amount: -2500000,
    status: "completed",
    method: "cod",
    orderId: "KOI001232",
    reference: "COD20240105001",
  },
];



const paymentMethods: Record<PaymentMethod, string> = {
  bank_transfer: "Chuyển khoản",
  cod: "Thanh toán khi nhận",
  wallet: "Ví điện tử",
  credit_card: "Thẻ tín dụng",
};

const statusConfig: Record<TransactionStatus, StatusConfig> = {
  completed: { label: "Thành công", color: "bg-green-100 text-green-800" },
  pending: { label: "Đang xử lý", color: "bg-yellow-100 text-yellow-800" },
  failed: { label: "Thất bại", color: "bg-red-100 text-red-800" },
};

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const filteredTransactions = mockTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (transaction.orderId &&
        transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesMethod = methodFilter === "all" || transaction.method === methodFilter;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const getCustomerStats = () => {
    const totalSpent = mockTransactions
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { totalSpent };
  };

  const customerStats = getCustomerStats();

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex items-start gap-3 md:gap-4 flex-1">
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-blue-100 text-blue-800 flex-shrink-0"
              >
                <Receipt className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-lg leading-tight">
                  {transaction.description}
                </p>
                <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 text-xs md:text-sm text-muted-foreground">
                  <span className="font-medium">
                    {formatDate(transaction.date)}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span>{paymentMethods[transaction.method]}</span>
                  {transaction.orderId && (
                    <>
                      <span className="hidden md:inline">•</span>
                      <span className="font-mono text-primary">#{transaction.orderId}</span>
                    </>
                  )}
                </div>
                {transaction.reference && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Mã: {transaction.reference}
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center md:flex-col md:items-end md:text-right md:space-y-2">
              <Badge
                className={`${statusConfig[transaction.status].color} font-medium text-xs md:order-2`}
              >
                {statusConfig[transaction.status].label}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            <Card className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-blue-700">
                  Tổng chi tiêu
                </CardTitle>
                <Receipt className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-blue-700">
                  {formatCurrency(customerStats.totalSpent)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockTransactions.length} giao dịch
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-green-700">
                  Chi tiêu trung bình
                </CardTitle>
                <CreditCard className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-green-700">
                  {formatCurrency(Math.round(customerStats.totalSpent / mockTransactions.length))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mỗi lần mua hàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs md:text-sm font-medium text-purple-700">
                  Giao dịch lớn nhất
                </CardTitle>
                <Gift className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg md:text-2xl font-bold text-purple-700">
                  {formatCurrency(Math.max(...mockTransactions.map(t => Math.abs(t.amount))))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Giá trị cao nhất
                </p>
              </CardContent>
            </Card>
          </div>

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
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="cod">Thanh toán khi nhận</SelectItem>
                  <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Thành công</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="hidden lg:flex bg-transparent rounded-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Tải về
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">
                Tất cả ({mockTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="bank_transfer">
                Chuyển khoản ({mockTransactions.filter(t => t.method === "bank_transfer").length})
              </TabsTrigger>
              <TabsTrigger value="cod">
                Thanh toán khi nhận ({mockTransactions.filter(t => t.method === "cod").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Thử thay đổi bộ lọc tìm kiếm
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="bank_transfer" className="space-y-4">
              {filteredTransactions.filter(t => t.method === "bank_transfer").length > 0 ? (
                filteredTransactions.filter(t => t.method === "bank_transfer").map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy giao dịch chuyển khoản nào</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="cod" className="space-y-4">
              {filteredTransactions.filter(t => t.method === "cod").length > 0 ? (
                filteredTransactions.filter(t => t.method === "cod").map((transaction) => (
                  <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Không tìm thấy giao dịch COD nào</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

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
                  <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                  <SelectItem value="cod">COD</SelectItem>
                  <SelectItem value="credit_card">Thẻ tín dụng</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full rounded-xl border-2 border-border hover:border-primary/50 focus:border-primary transition-colors">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="completed">Thành công</SelectItem>
                  <SelectItem value="pending">Đang xử lý</SelectItem>
                  <SelectItem value="failed">Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* All Transactions */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Không tìm thấy giao dịch nào</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Thử thay đổi bộ lọc tìm kiếm
                </p>
              </div>
            )}
          </div>
        </div>



      </div>
    </CustomerLayout>
  );
}
