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
import { InputNumber } from "@/components/ui/input-number";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Phone,
  Mail,
  ShoppingCart,
  Eye,
  Filter,
  Users,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useGetCustomers } from "@/hooks/useCustomer";
import { Customer } from "@/lib/api/services/fetchCustomer";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";
import formatCurrency from "@/lib/utils/numbers";
import { getOrderStatusLabel } from "@/lib/utils/enum";
import { useDebounce } from "@/hooks/useDebounce";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

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
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS_DEFAULT[0]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // UI state for filter inputs (not applied yet)
  const [minTotalSpentInput, setMinTotalSpentInput] = useState<
    number | undefined
  >();
  const [maxTotalSpentInput, setMaxTotalSpentInput] = useState<
    number | undefined
  >();
  const [minTotalOrdersInput, setMinTotalOrdersInput] = useState<
    number | undefined
  >();
  const [maxTotalOrdersInput, setMaxTotalOrdersInput] = useState<
    number | undefined
  >();
  const [createdFromInput, setCreatedFromInput] = useState("");
  const [createdToInput, setCreatedToInput] = useState("");
  const [contactNumberInput, setContactNumberInput] = useState("");
  const [isActiveInput, setIsActiveInput] = useState<boolean | undefined>();

  // Applied filter state (used for API calls)
  const [minTotalSpent, setMinTotalSpent] = useState<number | undefined>();
  const [maxTotalSpent, setMaxTotalSpent] = useState<number | undefined>();
  const [minTotalOrders, setMinTotalOrders] = useState<number | undefined>();
  const [maxTotalOrders, setMaxTotalOrders] = useState<number | undefined>();
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isActive, setIsActive] = useState<boolean | undefined>();

  const {
    data: customersData = defaultCustomerData,
    isLoading,
    error,
  } = useGetCustomers({
    pageIndex: currentPage,
    pageSize: pageSize,
    search: debouncedSearchTerm,
    isActive,
    minTotalSpent,
    maxTotalSpent,
    minTotalOrders,
    maxTotalOrders,
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
    contactNumber: contactNumber || undefined,
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

  // Helper functions for date handling
  const getDateFromString = (dateString: string): Date | undefined => {
    if (!dateString) return undefined;
    const parts = dateString.split("T")[0].split("-");
    return new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
    );
  };

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleApplyFilters = () => {
    // Apply the filter inputs to the actual filters
    setMinTotalSpent(minTotalSpentInput);
    setMaxTotalSpent(maxTotalSpentInput);
    setMinTotalOrders(minTotalOrdersInput);
    setMaxTotalOrders(maxTotalOrdersInput);
    setCreatedFrom(createdFromInput);
    setCreatedTo(createdToInput);
    setContactNumber(contactNumberInput);
    setIsActive(isActiveInput);
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    // Reset both input state and applied filters
    setMinTotalSpentInput(undefined);
    setMaxTotalSpentInput(undefined);
    setMinTotalOrdersInput(undefined);
    setMaxTotalOrdersInput(undefined);
    setCreatedFromInput("");
    setCreatedToInput("");
    setContactNumberInput("");
    setIsActiveInput(undefined);

    setMinTotalSpent(undefined);
    setMaxTotalSpent(undefined);
    setMinTotalOrders(undefined);
    setMaxTotalOrders(undefined);
    setCreatedFrom("");
    setCreatedTo("");
    setContactNumber("");
    setIsActive(undefined);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <ErrorState
          title="Có lỗi xảy ra"
          message="Không thể tải danh sách khách hàng. Vui lòng thử lại."
        />
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

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách Khách Hàng</CardTitle>
          <CardDescription>
            Tìm kiếm và quản lý khách hàng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(true)}
              className="whitespace-nowrap"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {/* Table */}
          {isLoading ? (
            <LoadingState message="Đang tải danh sách khách hàng..." />
          ) : customersData.data.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Không có khách hàng nào"
              description="Chưa có khách hàng trong hệ thống. Khách hàng sẽ xuất hiện ở đây sau khi họ tạo tài khoản."
            />
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

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc Khách Hàng</DialogTitle>
            <DialogDescription>
              Lọc danh sách khách hàng theo tiêu chí
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Total Spent Range */}
            <div className="space-y-3">
              <Label>
                Tổng Chi Tiêu: {formatCurrency(minTotalSpentInput || 0)} -{" "}
                {formatCurrency(maxTotalSpentInput || 10000000)}
              </Label>
              <Slider
                min={0}
                max={10000000}
                step={100000}
                value={[
                  minTotalSpentInput || 0,
                  maxTotalSpentInput || 10000000,
                ]}
                onValueChange={(values) => {
                  setMinTotalSpentInput(values[0]);
                  setMaxTotalSpentInput(values[1]);
                }}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Tối thiểu</Label>
                  <InputNumber
                    placeholder="0"
                    value={minTotalSpentInput}
                    onChange={(v) => {
                      if (
                        v !== undefined &&
                        maxTotalSpentInput !== undefined &&
                        v <= maxTotalSpentInput
                      ) {
                        setMinTotalSpentInput(v);
                      } else if (v !== undefined) {
                        setMinTotalSpentInput(v);
                      }
                    }}
                    min={0}
                    className="border-2 border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tối đa</Label>
                  <InputNumber
                    placeholder="10000000"
                    value={maxTotalSpentInput}
                    onChange={(v) => {
                      if (
                        v !== undefined &&
                        minTotalSpentInput !== undefined &&
                        v >= minTotalSpentInput
                      ) {
                        setMaxTotalSpentInput(v);
                      } else if (v !== undefined) {
                        setMaxTotalSpentInput(v);
                      }
                    }}
                    min={0}
                    className="border-2 border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Total Orders Range */}
            <div className="space-y-3">
              <Label>
                Số Đơn Hàng: {minTotalOrdersInput || 0} -{" "}
                {maxTotalOrdersInput || 1000}
              </Label>
              <Slider
                min={0}
                max={1000}
                step={10}
                value={[minTotalOrdersInput || 0, maxTotalOrdersInput || 1000]}
                onValueChange={(values) => {
                  setMinTotalOrdersInput(values[0]);
                  setMaxTotalOrdersInput(values[1]);
                }}
                className="w-full"
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Tối thiểu</Label>
                  <InputNumber
                    placeholder="0"
                    value={minTotalOrdersInput}
                    onChange={(v) => {
                      if (
                        v !== undefined &&
                        maxTotalOrdersInput !== undefined &&
                        v <= maxTotalOrdersInput
                      ) {
                        setMinTotalOrdersInput(v);
                      } else if (v !== undefined) {
                        setMinTotalOrdersInput(v);
                      }
                    }}
                    min={0}
                    className="border-2 border-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Tối đa</Label>
                  <InputNumber
                    placeholder="1000"
                    value={maxTotalOrdersInput}
                    onChange={(v) => {
                      if (
                        v !== undefined &&
                        minTotalOrdersInput !== undefined &&
                        v >= minTotalOrdersInput
                      ) {
                        setMaxTotalOrdersInput(v);
                      } else if (v !== undefined) {
                        setMaxTotalOrdersInput(v);
                      }
                    }}
                    min={0}
                    className="border-2 border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày Tạo - Từ</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-2 border-gray-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {createdFromInput
                        ? format(
                            getDateFromString(createdFromInput)!,
                            "dd MMM yyyy",
                            { locale: vi },
                          )
                        : "Chọn ngày..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={getDateFromString(createdFromInput)}
                      onSelect={(date) => {
                        if (date) {
                          setCreatedFromInput(formatDateToString(date));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Ngày Tạo - Đến</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-2 border-gray-300"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {createdToInput
                        ? format(
                            getDateFromString(createdToInput)!,
                            "dd MMM yyyy",
                            { locale: vi },
                          )
                        : "Chọn ngày..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={getDateFromString(createdToInput)}
                      onSelect={(date) => {
                        if (date) {
                          setCreatedToInput(formatDateToString(date));
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label>Số Liên Hệ</Label>
              <Input
                placeholder="Ví dụ: 0987654321"
                value={contactNumberInput}
                onChange={(e) => setContactNumberInput(e.target.value)}
                className="border-2 border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Trạng Thái</Label>
              <div className="flex gap-2">
                <Button
                  variant={isActiveInput === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsActiveInput(undefined)}
                  className="flex-1"
                >
                  Tất cả
                </Button>
                <Button
                  variant={isActiveInput === true ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsActiveInput(true)}
                  className="flex-1"
                >
                  Hoạt động
                </Button>
                <Button
                  variant={isActiveInput === false ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsActiveInput(false)}
                  className="flex-1"
                >
                  Không hoạt động
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 flex justify-between sm:justify-between">
            <Button variant="outline" onClick={handleResetFilters}>
              Đặt lại
            </Button>
            <Button onClick={handleApplyFilters}>Áp dụng bộ lọc</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
