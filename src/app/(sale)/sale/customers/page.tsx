"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, Search, Phone, Mail, ShoppingCart, Eye } from "lucide-react";
import { useGetCustomers } from "@/hooks/useCustomer";
import { Customer } from "@/lib/api/services/fetchCustomer";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";
import formatCurrency from "@/lib/utils/numbers";
import { getOrderStatusLabel } from "@/lib/utils/enum";

const defaultCustomerData = {
  pageIndex: 1,
  totalPages: 0,
  totalItems: 0,
  hasPreviousPage: false,
  hasNextPage: false,
  data: [],
};

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS_DEFAULT[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const {
    data: customersData = defaultCustomerData,
    isLoading,
    error,
  } = useGetCustomers({
    pageIndex: currentPage,
    pageSize: pageSize,
    search: searchTerm,
  });

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const viewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 items-center justify-center">
        <p className="text-red-600">
          Có lỗi xảy ra khi tải danh sách khách hàng
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Quản Lý Khách Hàng
        </h1>
        <p className="text-muted-foreground">
          Xem và quản lý danh sách khách hàng
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Khách Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customersData.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              Trên {customersData.totalPages} trang
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Khách Hàng Hoạt Động
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersData.data.filter((c) => c.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(
                (customersData.data.filter((c) => c.isActive).length /
                  customersData.data.length) *
                  100,
              )}
              % tổng số
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tổng Doanh Thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                customersData.data.reduce((sum, c) => sum + c.totalSpent, 0),
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Từ {customersData.data.length} khách hàng
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Trung Bình Đơn Hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {customersData.data.length > 0
                ? formatCurrency(
                    customersData.data.reduce(
                      (sum, c) => sum + c.totalSpent,
                      0,
                    ) / customersData.data.length,
                  )
                : "0 đ"}
            </div>
            <p className="text-xs text-muted-foreground">Mỗi khách hàng</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khách Hàng</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý khách hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : customersData.data.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Không có khách hàng nào
            </div>
          ) : (
            <>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Khách Hàng</TableHead>
                      <TableHead>Liên Hệ</TableHead>
                      <TableHead className="text-right">Đơn Hàng</TableHead>
                      <TableHead className="text-right">
                        Tổng Chi Tiêu
                      </TableHead>
                      <TableHead>Trạng Thái</TableHead>
                      <TableHead className="text-right">Hành Động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customersData.data.map((customer) => (
                      <TableRow key={customer.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.fullName}</p>
                            <p className="text-sm text-muted-foreground">
                              @{customer.userName}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">{customer.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{customer.phoneNumber}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {customer.totalOrders}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(customer.totalSpent)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              customer.isActive ? "default" : "secondary"
                            }
                          >
                            {customer.isActive
                              ? "Hoạt động"
                              : "Không hoạt động"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => viewDetails(customer)}
                            title="Xem chi tiết"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <PaginationSection
                currentPage={currentPage}
                setCurrentPage={handlePageChange}
                totalPages={customersData.totalPages}
                setPageSize={handlePageSizeChange}
                pageSizeOptions={PAGE_SIZE_OPTIONS_DEFAULT}
                hasNextPage={customersData.hasNextPage}
                hasPreviousPage={customersData.hasPreviousPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Customer Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="!max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedCustomer.fullName}</DialogTitle>
                <DialogDescription>
                  Thông tin chi tiết khách hàng
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thông Tin Cơ Bản</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tên Khách Hàng
                      </p>
                      <p className="font-medium">{selectedCustomer.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Tên Đăng Nhập
                      </p>
                      <p className="font-medium">
                        @{selectedCustomer.userName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số Điện Thoại
                      </p>
                      <p className="font-medium">
                        {selectedCustomer.phoneNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Số Liên Hệ
                      </p>
                      <p className="font-medium">
                        {selectedCustomer.contactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Trạng Thái
                      </p>
                      <Badge
                        variant={
                          selectedCustomer.isActive ? "default" : "secondary"
                        }
                      >
                        {selectedCustomer.isActive
                          ? "Hoạt động"
                          : "Không hoạt động"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Thống Kê</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Tổng Đơn Hàng
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedCustomer.totalOrders}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Tổng Chi Tiêu
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(selectedCustomer.totalSpent)}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm text-muted-foreground mb-1">
                          Trung Bình/Đơn
                        </p>
                        <p className="text-2xl font-bold">
                          {selectedCustomer.totalOrders > 0
                            ? formatCurrency(
                                selectedCustomer.totalSpent /
                                  selectedCustomer.totalOrders,
                              )
                            : "0 đ"}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Recent Orders */}
                {selectedCustomer.recentOrders.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold">Đơn Hàng Gần Đây</h4>
                    <div className="space-y-2">
                      {selectedCustomer.recentOrders.map((order) => (
                        <div
                          key={order.id}
                          className="border rounded-lg p-3 space-y-2 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">{order.orderNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {formatCurrency(order.totalAmount)}
                              </p>
                              <Badge
                                className={`text-xs ${getOrderStatusLabel(order.status).colorClass}`}
                              >
                                {getOrderStatusLabel(order.status).label}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dates */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Ngày Tạo</h4>
                  <p className="text-sm">
                    {new Date(selectedCustomer.createdAt).toLocaleDateString(
                      "vi-VN",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
