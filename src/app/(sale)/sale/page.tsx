"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  Users,
  ShoppingCart,
  Fish,
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  BarChart3,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetSalesDashboardStatistics,
  useGetSalesDashboardQuickInfo,
  useGetBestSellers,
  useGetSalesAnalysis,
} from "@/hooks/useSalesDashboard";
import { SalesAnalysisRange } from "@/lib/api/services/fetchSalesDashboard";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";

export default function SaleDashboard() {
  const [analysisRange, setAnalysisRange] = useState<SalesAnalysisRange>(
    SalesAnalysisRange.LAST_30_DAYS,
  );

  const { data: stats, isLoading } = useGetSalesDashboardStatistics();
  const { data: quickInfo, isLoading: isQuickInfoLoading } =
    useGetSalesDashboardQuickInfo();
  const { data: bestSellers, isLoading: isBestSellersLoading } =
    useGetBestSellers(5);
  const { data: salesAnalysis, isLoading: isSalesAnalysisLoading } =
    useGetSalesAnalysis(analysisRange);

  // Transform API data for chart
  const chartData = salesAnalysis
    ? salesAnalysis.labels.map((label, index) => ({
        name: label,
        revenue: salesAnalysis.revenueData[index] || 0,
        orders: salesAnalysis.ordersData[index] || 0,
      }))
    : [];

  // Format bar label for revenue
  const formatRevenueLabel = (value: unknown): string => {
    if (typeof value !== "number") return "";
    if (value === 0) return "";
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Format line label for orders
  const formatOrdersLabel = (value: unknown): string => {
    return typeof value === "number" ? value.toString() : "";
  };

  // Format YAxis tick for revenue
  const formatYAxisTick = (value: number): string => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  // Custom tooltip content
  const CustomTooltip = (props: unknown) => {
    const tooltipProps = props as {
      active?: boolean;
      payload?: Array<{
        name: string;
        value: number;
        color?: string;
      }>;
      label?: string;
    };

    const { active, payload, label } = tooltipProps;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}:{" "}
              {entry.name === "Doanh thu"
                ? new Intl.NumberFormat("vi-VN").format(entry.value)
                : entry.name === "Số đơn hàng"
                  ? Math.round(entry.value)
                  : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? formatCurrency(stats.monthlyRevenue.current) : "N/A"}
                </div>
                {stats && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {stats.monthlyRevenue.changePercent > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stats.monthlyRevenue.changePercent > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(stats.monthlyRevenue.changePercent)}%
                    </span>
                    <span className="ml-1">so với tháng trước</span>
                  </div>
                )}
              </>
            )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? stats.totalOrders.current : "N/A"}
                </div>
                {stats && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {stats.totalOrders.changePercent > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stats.totalOrders.changePercent > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(stats.totalOrders.changePercent)}%
                    </span>
                    <span className="ml-1">so với tháng trước</span>
                  </div>
                )}
              </>
            )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? stats.customerCount.current : "N/A"}
                </div>
                {stats && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    {stats.customerCount.newCustomerPercent > 0 ? (
                      <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span
                      className={
                        stats.customerCount.newCustomerPercent > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {Math.abs(stats.customerCount.newCustomerPercent)}%
                    </span>
                    <span className="ml-1">khách hàng mới</span>
                  </div>
                )}
              </>
            )}
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
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats ? stats.fishInStock.current : "N/A"}
                </div>
                {stats && (
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Package className="h-3 w-3 text-orange-600 mr-1" />
                    <span className="text-orange-600">
                      {stats.fishInStock.lowStockCount}
                    </span>
                    <span className="ml-1">cá sắp hết hàng</span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
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
                {isQuickInfoLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : quickInfo ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">
                        Đơn hàng chờ xử lý
                      </span>
                      <Badge variant="secondary">
                        {quickInfo.pendingOrders}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">
                        Đơn hàng hoàn thành
                      </span>
                      <Badge variant="outline">
                        {quickInfo.completedOrders}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">
                        Cá bán chạy nhất
                      </span>
                      <Badge className="bg-green-100 text-green-800">
                        {quickInfo.bestSellingItemsCount}
                      </Badge>
                    </div>
                    {quickInfo.alerts && quickInfo.alerts.length > 0 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-xs text-blue-800">
                          <strong>Thông báo:</strong>{" "}
                          {quickInfo.alerts.join("; ")}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">
                    Không thể tải dữ liệu
                  </div>
                )}
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
                  {isBestSellersLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : bestSellers && bestSellers.length > 0 ? (
                    bestSellers.map((fish, index) => (
                      <div
                        key={fish.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{fish.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Đã bán: {fish.soldCount} gói
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {formatCurrency(fish.totalRevenue)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      Không có dữ liệu
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Biểu đồ phân tích
                  </CardTitle>
                  <CardDescription>
                    Biểu đồ doanh thu và số đơn hàng theo thời gian
                  </CardDescription>
                </div>
                <Select
                  value={analysisRange}
                  onValueChange={(value) =>
                    setAnalysisRange(value as SalesAnalysisRange)
                  }
                >
                  <SelectTrigger className="w-40 bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SalesAnalysisRange.LAST_30_DAYS}>
                      30 ngày qua
                    </SelectItem>
                    <SelectItem value={SalesAnalysisRange.LAST_12_MONTHS}>
                      12 tháng qua
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {isSalesAnalysisLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      style={{ fontSize: "12px" }}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#3b82f6"
                      style={{ fontSize: "12px" }}
                      tickFormatter={formatYAxisTick}
                      label={{
                        value: "Doanh thu (VND)",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#ef4444"
                      style={{ fontSize: "12px" }}
                      allowDecimals={false}
                      label={{
                        value: "Số đơn hàng",
                        angle: 90,
                        position: "insideRight",
                      }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      fill="#3b82f6"
                      name="Doanh thu"
                      radius={[8, 8, 0, 0]}
                      label={{
                        position: "top",
                        formatter: formatRevenueLabel,
                        fontSize: 11,
                        fill: "#6b7280",
                      }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="orders"
                      stroke="#ef4444"
                      name="Số đơn hàng"
                      strokeWidth={2}
                      dot={{ fill: "#ef4444", r: 4 }}
                      activeDot={{ r: 6 }}
                      label={{
                        position: "top",
                        formatter: formatOrdersLabel,
                        fontSize: 11,
                        fill: "#6b7280",
                      }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Không có dữ liệu
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
