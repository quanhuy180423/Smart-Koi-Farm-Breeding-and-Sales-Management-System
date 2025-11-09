"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";
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
import { InputNumber } from "@/components/ui/input-number";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
  Search,
  MoreHorizontal,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Fish,
  Calendar as CalendarIcon,
  DollarSign,
  Loader2,
  X,
  Truck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/numbers/formatCurrency";
import { useGetAllOrders, useUpdateOrderStatus } from "@/hooks/useOrder";
import { OrderStatus, OrderSearchParams } from "@/lib/api/services/fetchOrder";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { PaginationSection } from "@/components/common/PaginationSection";
import {
  getOrderStatusLabel,
  getOrderStatusText,
  getOrderStatusColor,
} from "@/lib/utils/enum/formatEnum";
import { Calendar } from "@/components/ui/calendar";
import { DATE_FORMATS, formatDate } from "@/lib/utils/dates";

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  // Confirm order dialog state
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [confirmNote, setConfirmNote] = useState<string>("");

  // Cancel order dialog state
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState<string>("");

  // Ship order dialog state
  const [isShipDialogOpen, setIsShipDialogOpen] = useState(false);
  const [shipNote, setShipNote] = useState<string>("");

  // Complete order dialog state
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completeNote, setCompleteNote] = useState<string>("");

  // Selected order for actions
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  // Update order status mutation
  const updateStatusMutation = useUpdateOrderStatus();

  // Check if order can be updated
  const canUpdateOrder = (status: string): boolean => {
    return (
      status === OrderStatus.PAID ||
      status === OrderStatus.CONFIRMED ||
      status === OrderStatus.SHIPPED
    );
  };

  // Get available actions for order status
  const getAvailableActions = (
    status: string,
  ): {
    canConfirm: boolean;
    canCancel: boolean;
    canShip: boolean;
    canComplete: boolean;
  } => {
    return {
      canConfirm: status === OrderStatus.PAID,
      canCancel: status === OrderStatus.PAID,
      canShip: status === OrderStatus.CONFIRMED,
      canComplete: status === OrderStatus.SHIPPED,
    };
  };

  // Handler for opening confirm dialog
  const handleOpenConfirmDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setConfirmNote("");
    setIsConfirmDialogOpen(true);
  };

  // Handler for opening cancel dialog
  const handleOpenCancelDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setIsCancelDialogOpen(true);
  };

  // Handler for confirming order (PAID -> CONFIRMED)
  const handleConfirmOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.CONFIRMED,
          note: confirmNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được xác nhận");
          setIsConfirmDialogOpen(false);
          setSelectedOrderId(null);
          setConfirmNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể xác nhận đơn hàng",
          );
        },
      },
    );
  };

  // Handler for cancelling order (PAID -> CANCELLED)
  const handleCancelOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    if (!cancelReason.trim()) {
      toast.error("Vui lòng nhập lý do hủy đơn");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.CANCELLED,
          note: cancelReason,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được hủy");
          setIsCancelDialogOpen(false);
          setSelectedOrderId(null);
          setCancelReason("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể hủy đơn hàng",
          );
        },
      },
    );
  };

  // Handler for opening ship dialog
  const handleOpenShipDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShipNote("");
    setIsShipDialogOpen(true);
  };

  // Handler for shipping order (CONFIRMED -> SHIPPED)
  const handleShipOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.SHIPPED,
          note: shipNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã được gửi đi");
          setIsShipDialogOpen(false);
          setSelectedOrderId(null);
          setShipNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error ? error.message : "Không thể gửi đơn hàng",
          );
        },
      },
    );
  };

  // Handler for opening complete dialog
  const handleOpenCompleteDialog = (orderId: number) => {
    setSelectedOrderId(orderId);
    setCompleteNote("");
    setIsCompleteDialogOpen(true);
  };

  // Handler for completing order (SHIPPED -> COMPLETED)
  const handleCompleteOrder = () => {
    if (!selectedOrderId) {
      toast.error("Không tìm thấy đơn hàng");
      return;
    }

    updateStatusMutation.mutate(
      {
        orderId: selectedOrderId,
        request: {
          status: OrderStatus.COMPLETED,
          note: completeNote || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Đơn hàng đã hoàn thành");
          setIsCompleteDialogOpen(false);
          setSelectedOrderId(null);
          setCompleteNote("");
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Không thể hoàn thành đơn hàng",
          );
        },
      },
    );
  };

  // Debounce search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Build search params
  const searchParams = useMemo<OrderSearchParams>(() => {
    return {
      search: debouncedSearchTerm || undefined,
      status:
        statusFilter && statusFilter !== "all"
          ? (statusFilter as OrderStatus)
          : undefined,
      createdFrom: startDate
        ? Math.floor(startDate.getTime() / 1000)
        : undefined,
      createdTo: endDate ? Math.floor(endDate.getTime() / 1000) : undefined,
      minTotalAmount: minPrice ? parseFloat(minPrice) : undefined,
      maxTotalAmount: maxPrice ? parseFloat(maxPrice) : undefined,
      pageIndex: currentPage,
      pageSize: pageSize,
    };
  }, [
    debouncedSearchTerm,
    statusFilter,
    startDate,
    endDate,
    minPrice,
    maxPrice,
    currentPage,
    pageSize,
  ]);

  // Fetch orders
  const { data: ordersData, isLoading } = useGetAllOrders(searchParams);

  // Calculate stats from fetched data
  const stats = useMemo(() => {
    if (!ordersData?.data) {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        processingOrders: 0,
        completedOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
      };
    }

    const orders = ordersData.data;
    const countByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalOrders: ordersData.totalItems || 0,
      pendingOrders: countByStatus[OrderStatus.CREATED] || 0,
      processingOrders:
        countByStatus[OrderStatus.CONFIRMED] ||
        countByStatus[OrderStatus.SHIPPED] ||
        0,
      completedOrders: countByStatus[OrderStatus.COMPLETED] || 0,
      cancelledOrders: countByStatus[OrderStatus.CANCELLED] || 0,
      totalRevenue: orders.reduce(
        (sum, order) => sum + (order.totalAmount || 0),
        0,
      ),
    };
  }, [ordersData]);

  // const getPaymentStatusColor = (status: string) => {
  //   switch (status) {
  //     case "paid":
  //       return "bg-green-100 text-green-800";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "refunded":
  //       return "bg-gray-100 text-gray-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  // const getPaymentStatusText = (status: string) => {
  //   switch (status) {
  //     case "paid":
  //       return "Đã thanh toán";
  //     case "pending":
  //       return "Chờ thanh toán";
  //     case "refunded":
  //       return "Đã hoàn tiền";
  //     default:
  //       return "Không xác định";
  //   }
  // };

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
            <div className="text-xl sm:text-2xl font-bold">
              {isLoading ? "-" : stats.totalOrders}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
              Chờ xác nhận
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">
              {isLoading ? "-" : stats.pendingOrders}
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
              {isLoading ? "-" : stats.processingOrders}
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
              {isLoading ? "-" : stats.completedOrders}
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
              {isLoading ? "-" : stats.cancelledOrders}
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
              {isLoading ? "-" : formatCurrency(stats.totalRevenue)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Danh sách đơn hàng</CardTitle>
                <CardDescription>
                  Quản lý và theo dõi trạng thái đơn hàng
                </CardDescription>
              </div>
            </div>

            {/* Filters Row 1 */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 border border-gray-300 rounded-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo mã đơn, tên KH..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40 border border-gray-300">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {Object.values(OrderStatus).map((o) => (
                    <SelectItem key={o} value={o}>
                      {getOrderStatusText(o)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filters Row 2 - Date and Price Range */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start border border-gray-300 flex-1 sm:flex-none"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? startDate.toLocaleDateString("vi-VN")
                      : "Từ ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date: Date) =>
                      endDate ? date > endDate : false
                    }
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start border border-gray-300 flex-1 sm:flex-none"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? endDate.toLocaleDateString("vi-VN") : "Đến ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date: Date) =>
                      startDate ? date < startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>

              <div className="relative flex-1 sm:flex-none">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <InputNumber
                  value={minPrice ? Number(minPrice) : undefined}
                  onChange={(value) => setMinPrice(value ? String(value) : "")}
                  placeholder="Từ giá"
                  className="pl-10 w-full"
                />
              </div>

              <div className="relative flex-1 sm:flex-none">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <InputNumber
                  value={maxPrice ? Number(maxPrice) : undefined}
                  onChange={(value) => setMaxPrice(value ? String(value) : "")}
                  placeholder="Đến giá"
                  className="pl-10 w-full"
                />
              </div>

              {/* Clear Filters Button */}
              {(startDate || endDate || minPrice || maxPrice) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStartDate(undefined);
                    setEndDate(undefined);
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="border border-gray-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {!isLoading && !ordersData && (
              <div className="text-center py-8">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Lỗi tải dữ liệu</h3>
                <p className="text-muted-foreground">
                  Không thể tải danh sách đơn hàng. Vui lòng thử lại.
                </p>
              </div>
            )}

            {!isLoading &&
              ordersData?.data &&
              ordersData.data.length > 0 &&
              ordersData.data.map((order) => (
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
                        <h3 className="font-bold text-base sm:text-lg">
                          {order.orderNumber}
                        </h3>
                        <Badge
                          className={getOrderStatusColor(order.status)}
                          variant="secondary"
                        >
                          <div className="flex items-center gap-1">
                            {(() => {
                              const Icon = getOrderStatusLabel(
                                order.status,
                              ).icon;
                              return <Icon className="h-4 w-4" />;
                            })()}
                            <span className="hidden sm:inline">
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </Badge>
                      </div>

                      <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{order.customerName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            {formatDate(
                              order.createdAt,
                              DATE_FORMATS.DATETIME_24H,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 text-xs sm:text-sm mb-2">
                        <Fish className="h-3 w-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-muted-foreground">
                            {order?.orderDetails?.length || 0} sản phẩm:
                          </span>
                          <div className="font-medium line-clamp-2">
                            {order?.orderDetails
                              ?.map(
                                (item) =>
                                  `${item.koiFish?.rfid || item.packetFish?.name} (${item.quantity})`,
                              )
                              .join(", ")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between lg:justify-end gap-4">
                    <div className="text-left lg:text-right">
                      <div className="space-y-1 mb-2 text-xs sm:text-sm">
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            Tạm tính:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.subtotal)}
                          </span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-muted-foreground">
                            Vận chuyển:
                          </span>
                          <span className="font-medium">
                            {formatCurrency(order.shippingFee)}
                          </span>
                        </div>
                      </div>
                      <p className="font-bold text-base sm:text-lg">
                        {formatCurrency(order.totalAmount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.orderDetails.reduce(
                          (sum, item) => sum + item.quantity,
                          0,
                        )}{" "}
                        sản phẩm
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
                        <DropdownMenuItem asChild>
                          <Link href={`/sale/orders/${order.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </DropdownMenuItem>

                        {/* Show action buttons based on status */}
                        {canUpdateOrder(order.status) && (
                          <>
                            <DropdownMenuSeparator />
                            {getAvailableActions(order.status).canConfirm && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenConfirmDialog(order.id)
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Xác nhận đơn
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleOpenCancelDialog(order.id)
                                  }
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Hủy đơn hàng
                                </DropdownMenuItem>
                              </>
                            )}
                            {getAvailableActions(order.status).canShip && (
                              <DropdownMenuItem
                                onClick={() => handleOpenShipDialog(order.id)}
                                className="text-blue-600"
                              >
                                <Truck className="mr-2 h-4 w-4" />
                                Gửi đơn hàng
                              </DropdownMenuItem>
                            )}
                            {getAvailableActions(order.status).canComplete && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleOpenCompleteDialog(order.id)
                                }
                                className="text-emerald-600"
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Hoàn thành đơn
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}

            {!isLoading &&
              (!ordersData?.data || ordersData.data.length === 0) && (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    Không tìm thấy đơn hàng
                  </h3>
                  <p className="text-muted-foreground">
                    Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc
                  </p>
                </div>
              )}
          </div>

          {/* Pagination */}
          {!isLoading && ordersData && ordersData.data.length > 0 && (
            <div className="mt-6">
              <PaginationSection
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={ordersData.totalPages || 1}
                totalItems={ordersData.totalItems || 0}
                postsPerPage={pageSize}
                setPageSize={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                hasNextPage={ordersData.hasNextPage}
                hasPreviousPage={ordersData.hasPreviousPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Order Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Xác nhận đơn hàng và chuyển sang trạng thái &quot;Đã xác
              nhận&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Sau khi xác nhận, đơn hàng sẽ chuyển sang trạng thái &quot;Đã
                xác nhận&quot; và sẵn sàng để giao hàng.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Thêm ghi chú khi xác nhận đơn hàng..."
                value={confirmNote}
                onChange={(e) => setConfirmNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={updateStatusMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xác nhận...
                </>
              ) : (
                "Xác nhận đơn hàng"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hủy đơn hàng</DialogTitle>
            <DialogDescription>
              Hủy đơn hàng và chuyển sang trạng thái &quot;Đã hủy&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-900">
                ⚠️ Sau khi hủy, không thể hoàn tác. Vui lòng chắc chắn trước khi
                tiếp tục.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block text-red-600">
                Lý do hủy đơn *
              </label>
              <Textarea
                placeholder="Nhập lý do hủy đơn hàng (bắt buộc)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="border-red-300 focus:border-red-500"
              />
              {!cancelReason.trim() && (
                <p className="text-xs text-red-600 mt-1">
                  Lý do hủy là bắt buộc
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCancelDialogOpen(false)}
            >
              Không hủy
            </Button>
            <Button
              onClick={handleCancelOrder}
              disabled={updateStatusMutation.isPending || !cancelReason.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hủy...
                </>
              ) : (
                "Xác nhận hủy đơn"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ship Order Dialog */}
      <Dialog open={isShipDialogOpen} onOpenChange={setIsShipDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Gửi đơn hàng</DialogTitle>
            <DialogDescription>
              Chuyển đơn hàng sang trạng thái &quot;Đang giao&quot;
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Sau khi gửi, đơn hàng sẽ chuyển sang trạng thái &quot;Đang
                giao&quot; và có thể được hoàn thành sau khi giao hàng.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Thêm ghi chú khi gửi đơn hàng..."
                value={shipNote}
                onChange={(e) => setShipNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsShipDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleShipOrder}
              disabled={updateStatusMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi đơn hàng"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Complete Order Dialog */}
      <Dialog
        open={isCompleteDialogOpen}
        onOpenChange={setIsCompleteDialogOpen}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Hoàn thành đơn hàng</DialogTitle>
            <DialogDescription>
              Xác nhận rằng đơn hàng đã được giao thành công
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-900">
                Sau khi hoàn thành, đơn hàng sẽ chuyển sang trạng thái
                &quot;Hoàn thành&quot; và khách hàng có thể đánh giá sản phẩm.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Ghi chú (tùy chọn)
              </label>
              <Textarea
                placeholder="Thêm ghi chú khi hoàn thành đơn hàng..."
                value={completeNote}
                onChange={(e) => setCompleteNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsCompleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCompleteOrder}
              disabled={updateStatusMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {updateStatusMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang hoàn thành...
                </>
              ) : (
                "Hoàn thành đơn hàng"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
