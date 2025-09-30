"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Fish,
  Calendar,
  DollarSign,
} from "lucide-react";
import formatCurrency from "@/lib/utils/numbers";

// Mock data - replace with real API calls
const mockOrderStats = {
  totalOrders: 287,
  pendingOrders: 23,
  processingOrders: 45,
  completedOrders: 198,
  cancelledOrders: 21,
  totalRevenue: 892400000,
};

const mockOrders = [
  {
    id: "ORD001",
    customerId: "CUST001",
    customerName: "Nguyễn Văn An",
    customerEmail: "nguyenvanan@email.com",
    items: [
      { name: "Koi Kohaku Premium", quantity: 1, price: 2500000 },
      { name: "Thức ăn cá Koi", quantity: 2, price: 150000 },
    ],
    totalAmount: 2800000,
    status: "completed",
    paymentStatus: "paid",
    orderDate: "2024-01-15",
    deliveryDate: "2024-01-17",
    shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
    notes: "Giao hàng buổi sáng",
  },
  {
    id: "ORD002",
    customerId: "CUST002",
    customerName: "Trần Thị Bình",
    customerEmail: "tranthib@email.com",
    items: [
      { name: "Koi Sanke", quantity: 1, price: 1800000 },
    ],
    totalAmount: 1800000,
    status: "processing",
    paymentStatus: "paid",
    orderDate: "2024-01-14",
    deliveryDate: "2024-01-18",
    shippingAddress: "456 Đường XYZ, Quận 3, TP.HCM",
    notes: "",
  },
  {
    id: "ORD003",
    customerId: "CUST003",
    customerName: "Lê Văn Cường",
    customerEmail: "levanc@email.com",
    items: [
      { name: "Koi Showa", quantity: 1, price: 3200000 },
      { name: "Bộ lọc nước", quantity: 1, price: 800000 },
    ],
    totalAmount: 4000000,
    status: "pending",
    paymentStatus: "pending",
    orderDate: "2024-01-13",
    deliveryDate: null,
    shippingAddress: "789 Đường DEF, Quận 7, TP.HCM",
    notes: "Khách hàng yêu cầu xem trước khi mua",
  },
  {
    id: "ORD004",
    customerId: "CUST004",
    customerName: "Phạm Thị Dung",
    customerEmail: "phamthid@email.com",
    items: [
      { name: "Koi Tancho", quantity: 1, price: 1500000 },
    ],
    totalAmount: 1500000,
    status: "cancelled",
    paymentStatus: "refunded",
    orderDate: "2024-01-10",
    deliveryDate: null,
    shippingAddress: "321 Đường GHI, Quận 5, TP.HCM",
    notes: "Khách hàng hủy do thay đổi ý định",
  },
];

export default function OrdersPage() {
  const [orders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "processing":
        return "Đang xử lý";
      case "pending":
        return "Chờ xử lý";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Đã thanh toán";
      case "pending":
        return "Chờ thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return "Không xác định";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quản lý đơn hàng
          </h1>
          <p className="text-muted-foreground">
            Theo dõi và quản lý các đơn hàng từ khách hàng
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Xuất báo cáo</span>
            <span className="sm:hidden">Báo cáo</span>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tạo đơn hàng</span>
                <span className="sm:hidden">Tạo</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tạo đơn hàng mới</DialogTitle>
                <DialogDescription>
                  Form tạo đơn hàng sẽ được implement sau
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{mockOrderStats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Chờ xử lý
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {mockOrderStats.pendingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Đang xử lý
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {mockOrderStats.processingOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Hoàn thành
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {mockOrderStats.completedOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Đã hủy
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-red-600">
              {mockOrderStats.cancelledOrders}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Doanh thu
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm sm:text-lg font-bold text-green-600">
              {formatCurrency(mockOrderStats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Danh sách đơn hàng</CardTitle>
              <CardDescription>
                Quản lý và theo dõi trạng thái đơn hàng
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:flex-none border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn, tên KH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border border-gray-300">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="processing">Đang xử lý</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="flex flex-col lg:flex-row lg:items-center lg:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
              >
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-bold text-base sm:text-lg">{order.id}</h3>
                      <Badge
                        className={getStatusColor(order.status)}
                        variant="secondary"
                      >
                        <div className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          <span className="hidden sm:inline">{getStatusText(order.status)}</span>
                        </div>
                      </Badge>
                      <Badge
                        className={getPaymentStatusColor(order.paymentStatus)}
                        variant="secondary"
                      >
                        <span className="hidden sm:inline">{getPaymentStatusText(order.paymentStatus)}</span>
                        <span className="sm:hidden">
                          {order.paymentStatus === "paid" ? "Đã thanh toán" : 
                           order.paymentStatus === "pending" ? "Chờ thanh toán" : "Hoàn tiền"}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{order.orderDate}</span>
                      </div>
                      {order.deliveryDate && (
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3 flex-shrink-0" />
                          <span>Giao: {order.deliveryDate}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-start gap-2 text-xs sm:text-sm mb-2">
                      <Fish className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-muted-foreground">
                          {order.items.length} sản phẩm:
                        </span>
                        <div className="font-medium line-clamp-2">
                          {order.items.map(item => `${item.name} (${item.quantity})`).join(", ")}
                        </div>
                      </div>
                    </div>

                    {order.notes && (
                      <div className="text-xs text-muted-foreground italic line-clamp-2">
                        Ghi chú: {order.notes}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between lg:justify-end gap-4">
                  <div className="text-left lg:text-right">
                    <p className="font-bold text-base sm:text-lg">{formatCurrency(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm
                    </p>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Cập nhật trạng thái
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hủy đơn hàng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Không tìm thấy đơn hàng</h3>
              <p className="text-muted-foreground">
                Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}