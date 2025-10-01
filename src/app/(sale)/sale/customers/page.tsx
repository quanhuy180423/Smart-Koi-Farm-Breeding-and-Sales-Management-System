"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Star,
} from "lucide-react";
import formatCurrency from "@/lib/utils/numbers";

// Mock data - replace with real API calls
const mockCustomerStats = {
  totalCustomers: 156,
  newCustomers: 23,
  activeCustomers: 134,
  vipCustomers: 18,
};

const mockCustomers = [
  {
    id: "CUST001",
    name: "Nguyễn Văn An",
    email: "nguyenvanan@email.com",
    phone: "0901234567",
    address: "123 Đường ABC, Quận 1, TP.HCM",
    totalOrders: 12,
    totalSpent: 45600000,
    lastOrder: "2024-01-15",
    status: "active",
    tier: "vip",
    joinDate: "2023-06-15",
  },
  {
    id: "CUST002",
    name: "Trần Thị Bình",
    email: "tranthib@email.com",
    phone: "0987654321",
    address: "456 Đường XYZ, Quận 3, TP.HCM",
    totalOrders: 8,
    totalSpent: 28400000,
    lastOrder: "2024-01-12",
    status: "active",
    tier: "regular",
    joinDate: "2023-09-20",
  },
  {
    id: "CUST003",
    name: "Lê Văn Cường",
    email: "levanc@email.com",
    phone: "0912345678",
    address: "789 Đường DEF, Quận 7, TP.HCM",
    totalOrders: 25,
    totalSpent: 89200000,
    lastOrder: "2024-01-10",
    status: "active",
    tier: "vip",
    joinDate: "2023-03-10",
  },
  {
    id: "CUST004",
    name: "Phạm Thị Dung",
    email: "phamthid@email.com",
    phone: "0923456789",
    address: "321 Đường GHI, Quận 5, TP.HCM",
    totalOrders: 3,
    totalSpent: 12800000,
    lastOrder: "2023-12-28",
    status: "inactive",
    tier: "new",
    joinDate: "2023-12-01",
  },
];

export default function CustomersPage() {
  const [customers] = useState(mockCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm),
    );
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "vip":
        return "bg-purple-100 text-purple-800";
      case "regular":
        return "bg-blue-100 text-blue-800";
      case "new":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTierText = (tier: string) => {
    switch (tier) {
      case "vip":
        return "VIP";
      case "regular":
        return "Thường";
      case "new":
        return "Mới";
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
            Quản lý khách hàng
          </h1>
          <p className="text-muted-foreground">
            Quản lý thông tin và theo dõi hoạt động của khách hàng
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
                <UserPlus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Thêm khách hàng</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm khách hàng mới</DialogTitle>
                <DialogDescription>
                  Form thêm khách hàng sẽ được implement sau
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng khách hàng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomerStats.totalCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Khách hàng mới
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <UserPlus className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomerStats.newCustomers}
            </div>
            <p className="text-xs text-muted-foreground">Trong tháng này</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Khách hàng hoạt động
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomerStats.activeCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              Mua hàng trong 30 ngày
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Khách hàng VIP
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Star className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCustomerStats.vipCustomers}
            </div>
            <p className="text-xs text-muted-foreground">
              Chi tiêu {">"} 50 triệu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Danh sách khách hàng</CardTitle>
              <CardDescription>
                Tìm kiếm và quản lý khách hàng của bạn
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1 sm:flex-none border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, email hoặc SĐT..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors gap-4"
              >
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-medium text-sm sm:text-base">
                        {customer.name}
                      </h3>
                      <Badge
                        className={getTierColor(customer.tier)}
                        variant="secondary"
                      >
                        {getTierText(customer.tier)}
                      </Badge>
                      <Badge
                        className={getStatusColor(customer.status)}
                        variant="secondary"
                      >
                        {customer.status === "active"
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </div>
                    <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="h-3 w-3 flex-shrink-0" />
                        <span>{customer.totalOrders} đơn</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-sm sm:text-base">
                      {formatCurrency(customer.totalSpent)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lần cuối: {customer.lastOrder}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 flex-shrink-0"
                      >
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
                        Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa khách hàng
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Không tìm thấy khách hàng
              </h3>
              <p className="text-muted-foreground">
                Thử thay đổi từ khóa tìm kiếm hoặc thêm khách hàng mới
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
