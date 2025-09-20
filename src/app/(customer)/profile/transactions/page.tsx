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
  ArrowLeft,
  Download,
  CreditCard,
  ArrowDownLeft,
  Receipt,
  Gift,
} from "lucide-react";
import Link from "next/link";

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

interface TransactionTypeConfig {
  label: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StatusConfig {
  label: string;
  color: string;
}

// Mock transaction data
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
    date: "2024-01-10",
    type: "refund",
    description: "Hoàn tiền cá Koi không phù hợp",
    amount: 15000000,
    status: "completed",
    method: "bank_transfer",
    orderId: "KOI001230",
    reference: "REF20240110001",
  },
  {
    id: "TXN001239",
    date: "2024-01-05",
    type: "reward",
    description: "Điểm thưởng khách hàng VIP",
    amount: 500000,
    status: "completed",
    method: "wallet",
    orderId: null,
    reference: "VIP20240105001",
  },
];

const transactionTypes: Record<TransactionType, TransactionTypeConfig> = {
  purchase: {
    label: "Mua hàng",
    color: "bg-blue-100 text-blue-800",
    icon: Receipt,
  },
  refund: {
    label: "Hoàn tiền",
    color: "bg-green-100 text-green-800",
    icon: ArrowDownLeft,
  },
  reward: {
    label: "Điểm thưởng",
    color: "bg-purple-100 text-purple-800",
    icon: Gift,
  },
};

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
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Math.abs(price));
  };

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

    const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionsByType = (type: TransactionType) => {
    return mockTransactions.filter((transaction) => transaction.type === type);
  };

  const getCustomerStats = () => {
    const totalSpent = mockTransactions
      .filter((t) => t.type === "purchase")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalRefunded = mockTransactions
      .filter((t) => t.type === "refund")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalRewards = mockTransactions
      .filter((t) => t.type === "reward")
      .reduce((sum, t) => sum + t.amount, 0);

    return { totalSpent, totalRefunded, totalRewards };
  };

  const customerStats = getCustomerStats();

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const TypeIcon = transactionTypes[transaction.type].icon;
    const isNegative = transaction.amount < 0;

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${transactionTypes[transaction.type].color}`}
              >
                <TypeIcon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-lg">
                  {transaction.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium">
                    {formatDate(transaction.date)}
                  </span>
                  <span>•</span>
                  <span>{paymentMethods[transaction.method]}</span>
                  {transaction.orderId && (
                    <>
                      <span>•</span>
                      <span className="font-mono">#{transaction.orderId}</span>
                    </>
                  )}
                </div>
                {transaction.reference && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Mã tham chiếu: {transaction.reference}
                  </p>
                )}
              </div>
            </div>
            <div className="text-right space-y-2">
              <p
                className={`font-bold text-xl ${isNegative ? "text-red-600" : "text-green-600"}`}
              >
                {isNegative ? "-" : "+"}
                {formatPrice(transaction.amount)}
              </p>
              <Badge
                className={`${statusConfig[transaction.status].color} font-medium`}
              >
                {statusConfig[transaction.status].label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button asChild variant="ghost" size="sm">
              <Link href="/profile">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
              <p className="text-muted-foreground">
                Theo dõi các giao dịch mua bán cá Koi của bạn
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-700">
                  Tổng chi tiêu
                </CardTitle>
                <Receipt className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">
                  {formatPrice(customerStats.totalSpent)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockTransactions.filter((t) => t.type === "purchase").length}{" "}
                  lần mua hàng
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-700">
                  Hoàn tiền
                </CardTitle>
                <ArrowDownLeft className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-700">
                  {formatPrice(customerStats.totalRefunded)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockTransactions.filter((t) => t.type === "refund").length}{" "}
                  giao dịch hoàn tiền
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-700">
                  Điểm thưởng
                </CardTitle>
                <Gift className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-700">
                  {formatPrice(customerStats.totalRewards)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockTransactions.filter((t) => t.type === "reward").length}{" "}
                  lần nhận thưởng
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                Tất cả ({mockTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="purchase">
                Mua hàng ({getTransactionsByType("purchase").length})
              </TabsTrigger>
              <TabsTrigger value="refund">
                Hoàn tiền ({getTransactionsByType("refund").length})
              </TabsTrigger>
              <TabsTrigger value="reward">
                Điểm thưởng ({getTransactionsByType("reward").length})
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm theo mã giao dịch, tên cá Koi hoặc mã đơn hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Loại giao dịch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="purchase">Mua hàng</SelectItem>
                    <SelectItem value="refund">Hoàn tiền</SelectItem>
                    <SelectItem value="reward">Điểm thưởng</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
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
                  className="hidden sm:flex bg-transparent"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải về
                </Button>
              </div>
            </div>

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
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Chưa có giao dịch nào</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Hãy mua cá Koi đầu tiên của bạn!
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="purchase" className="space-y-4">
              {getTransactionsByType("purchase").map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </TabsContent>

            <TabsContent value="refund" className="space-y-4">
              {getTransactionsByType("refund").map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </TabsContent>

            <TabsContent value="reward" className="space-y-4">
              {getTransactionsByType("reward").map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
