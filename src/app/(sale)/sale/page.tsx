"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Fish,
  DollarSign,
  Package,
  Clock,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Mock data - replace with real API calls
const mockStats = {
  totalRevenue: 45200000,
  revenueChange: 12.5,
  totalOrders: 156,
  ordersChange: -3.2,
  totalCustomers: 89,
  customersChange: 8.1,
  totalFish: 234,
  fishChange: 15.7,
  pendingOrders: 12,
  completedOrders: 144,
  lowStockFish: 8,
  topSellingFish: 15,
};

const mockRecentOrders = [
  {
    id: "ORD001",
    customer: "Nguyễn Văn A",
    fish: "Koi Kohaku Premium",
    amount: 2500000,
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD002",
    customer: "Trần Thị B",
    fish: "Koi Sanke",
    amount: 1800000,
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD003",
    customer: "Lê Văn C",
    fish: "Koi Showa",
    amount: 3200000,
    status: "processing",
    date: "2024-01-13",
  },
];

const mockTopFish = [
  { name: "Koi Kohaku Premium", sold: 25, revenue: 62500000 },
  { name: "Koi Sanke", sold: 18, revenue: 32400000 },
  { name: "Koi Showa", sold: 15, revenue: 48000000 },
  { name: "Koi Tancho", sold: 12, revenue: 18000000 },
];

export default function SaleDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Hoàn thành";
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
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
            Dashboard Bán Hàng
          </h1>
          <p className="text-muted-foreground">
            Tổng quan hoạt động bán hàng và thống kê
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Xem báo cáo
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Tạo đơn hàng
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Doanh thu tháng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockStats.totalRevenue)}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {mockStats.revenueChange > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span
                className={
                  mockStats.revenueChange > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(mockStats.revenueChange)}%
              </span>
              <span className="ml-1">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tổng đơn hàng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalOrders}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {mockStats.ordersChange > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span
                className={
                  mockStats.ordersChange > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(mockStats.ordersChange)}%
              </span>
              <span className="ml-1">so với tháng trước</span>
            </div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Khách hàng
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCustomers}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {mockStats.customersChange > 0 ? (
                <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span
                className={
                  mockStats.customersChange > 0 ? "text-green-600" : "text-red-600"
                }
              >
                {Math.abs(mockStats.customersChange)}%
              </span>
              <span className="ml-1">khách hàng mới</span>
            </div>
          </CardContent>
        </Card>

        {/* Fish Inventory Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cá trong kho
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Fish className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalFish}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <Package className="h-3 w-3 text-orange-600 mr-1" />
              <span className="text-orange-600">{mockStats.lowStockFish}</span>
              <span className="ml-1">cá sắp hết hàng</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="orders">Đơn hàng gần đây</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích bán hàng</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Thống kê nhanh
                </CardTitle>
                <CardDescription>
                  Thông tin tổng quan về hoạt động bán hàng
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Đơn hàng chờ xử lý</span>
                  <Badge variant="secondary">{mockStats.pendingOrders}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Đơn hàng hoàn thành</span>
                  <Badge variant="outline">{mockStats.completedOrders}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Cá bán chạy nhất</span>
                  <Badge className="bg-green-100 text-green-800">
                    {mockStats.topSellingFish}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Fish */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cá bán chạy nhất
                </CardTitle>
                <CardDescription>
                  Top sản phẩm có doanh thu cao nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopFish.map((fish, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{fish.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Đã bán: {fish.sold} con
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(fish.revenue)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Đơn hàng gần đây</CardTitle>
              <CardDescription>
                Danh sách các đơn hàng được tạo gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.customer} • {order.fish}
                        </p>
                        <p className="text-xs text-muted-foreground">{order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(order.amount)}</p>
                        <Badge
                          className={getStatusColor(order.status)}
                          variant="secondary"
                        >
                          {getStatusText(order.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  Xem tất cả đơn hàng
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích doanh thu</CardTitle>
                <CardDescription>
                  Biểu đồ doanh thu theo thời gian (Sẽ được thêm)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Biểu đồ doanh thu sẽ được thêm vào sau
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân tích khách hàng</CardTitle>
                <CardDescription>
                  Thống kê về hành vi khách hàng (Sẽ được thêm)
                </CardDescription>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                <p className="text-muted-foreground">
                  Biểu đồ khách hàng sẽ được thêm vào sau
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}