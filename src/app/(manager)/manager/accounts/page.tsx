"use client";

import { useState, useEffect } from "react";
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
  Plus,
  Search,
  Users,
  UserCheck,
  Shield,
  Loader2,
  Eye,
  EyeOff,
  Ban,
  CheckCircle,
  Upload,
  FileUp,
  FileDown,
  X,
} from "lucide-react";
import {
  useGetUserByRole,
  useCreateStaffAccount,
  useToggleAccountBlock,
  useImportStaffAccounts,
} from "@/hooks/useUsers";
import {
  UserSearchParams,
  CreateStaffAccountRequest,
} from "@/lib/api/services/fetchUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "@/components/common/LoadingState";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PaginationWithLinks } from "@/components/pagination";
import { useAuthStore } from "@/store/auth-store";

const PAGE_SIZE_OPTIONS = [10, 20, 50];

interface NewAccountForm {
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case Roles.Manager:
      return (
        <Badge variant="default" className="bg-purple-100 text-purple-800">
          <Shield className="mr-1 h-3 w-3" />
          Quản lý
        </Badge>
      );
    case Roles.FarmStaff:
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <UserCheck className="mr-1 h-3 w-3" />
          Nhân viên trang trại
        </Badge>
      );
    case Roles.SaleStaff:
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <UserCheck className="mr-1 h-3 w-3" />
          Nhân viên bán hàng
        </Badge>
      );
    case Roles.Customer:
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700">
          <Users className="mr-1 h-3 w-3" />
          Khách hàng
        </Badge>
      );
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getStatusBadge = (isBlocked: boolean) => {
  if (isBlocked) {
    return <Badge variant="secondary">Đã chặn</Badge>;
  }
  return (
    <Badge variant="default" className="bg-green-100 text-green-800">
      Hoạt động
    </Badge>
  );
};

export default function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Get current logged-in user
  const currentUser = useAuthStore((state) => state.user);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [blockConfirmDialog, setBlockConfirmDialog] = useState<{
    isOpen: boolean;
    userId: number | null;
    isCurrentlyBlocked: boolean;
  }>({
    isOpen: false,
    userId: null,
    isCurrentlyBlocked: false,
  });
  const [newAccount, setNewAccount] = useState<NewAccountForm>({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  // Import dialog state
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isDragActive, setIsDragActive] = useState<boolean>(false);

  // Track which user is being toggled
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);

  // Hooks for creating and blocking accounts
  const createStaffMutation = useCreateStaffAccount();
  const toggleBlockMutation = useToggleAccountBlock();
  const importMutation = useImportStaffAccounts();

  // Reset to page 1 when search or filter changes (when API is called)
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, roleFilter]);

  // Build search params for hook
  const searchParams: UserSearchParams = {
    role: roleFilter === "all" ? undefined : (roleFilter as Roles),
    pageIndex: currentPage,
    pageSize: pageSize,
    search: debouncedSearchTerm || undefined,
  };

  // Fetch user data
  const { data: userData, isLoading, error } = useGetUserByRole(searchParams);

  const userList = userData?.data || [];
  const totalItems = userData?.totalItems || 0;

  // Password validation helper
  const validatePassword = (
    password: string,
  ): { isValid: boolean; message: string } => {
    if (password.length < 6) {
      return { isValid: false, message: "Mật khẩu phải có ít nhất 6 ký tự" };
    }
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Mật khẩu phải có ít nhất 1 chữ hoa" };
    }
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: "Mật khẩu phải có ít nhất 1 chữ thường",
      };
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return {
        isValid: false,
        message: "Mật khẩu phải có ít nhất 1 ký tự đặc biệt",
      };
    }
    return { isValid: true, message: "" };
  };

  // Handle close add modal and reset form
  const handleCloseAddModal = (open: boolean) => {
    setIsAddModalOpen(open);
    if (!open) {
      setNewAccount({
        fullName: "",
        userName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  };

  const handleAddAccount = async () => {
    // Validation: Only FarmStaff and SaleStaff are allowed for new staff accounts
    if (
      !newAccount.role ||
      ![Roles.FarmStaff, Roles.SaleStaff].includes(newAccount.role as Roles)
    ) {
      toast.error(
        "Chỉ có thể tạo tài khoản cho nhân viên trang trại hoặc nhân viên bán hàng",
      );
      return;
    }

    if (
      !newAccount.fullName ||
      !newAccount.userName ||
      !newAccount.email ||
      !newAccount.password
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validate password strength
    const passwordValidation = validatePassword(newAccount.password);
    if (!passwordValidation.isValid) {
      toast.error(passwordValidation.message);
      return;
    }

    if (newAccount.password !== newAccount.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    // Prepare request data
    const requestData: CreateStaffAccountRequest = {
      email: newAccount.email,
      userName: newAccount.userName,
      fullName: newAccount.fullName,
      phoneNumber: newAccount.phone,
      role: newAccount.role,
      password: newAccount.password,
    };

    try {
      // Call API to create new staff account
      await createStaffMutation.mutateAsync(requestData);

      setIsAddModalOpen(false);
      setNewAccount({
        fullName: "",
        userName: "",
        email: "",
        phone: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch {}
  };

  // Import handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        setImportFile(file);
      } else {
        toast.error("Vui lòng chọn file Excel (.xlsx)");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.name.endsWith(".xlsx")
      ) {
        setImportFile(file);
      } else {
        toast.error("Vui lòng chọn file Excel (.xlsx)");
      }
    }
  };

  const handleImportFile = async () => {
    if (!importFile) {
      toast.error("Vui lòng chọn file để import");
      return;
    }

    try {
      const result = await importMutation.mutateAsync(importFile);

      if (result?.result) {
        const { successCount, failureCount, errors } = result.result;

        // Show summary
        if (successCount > 0) {
          toast.success(
            `Import thành công: ${successCount} tài khoản đã được tạo`,
          );
        }

        if (failureCount > 0) {
          const errorMessages = errors
            .map((e) => `Hàng ${e.rowNumber} (${e.email}): ${e.errorMessage}`)
            .join("\n");

          toast.error(
            `Import thất bại: ${failureCount} tài khoản\n${errorMessages}`,
            {
              duration: 6000,
            },
          );
        }
      }

      setIsImportModalOpen(false);
      setImportFile(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Lỗi khi import file",
        {
          duration: 6000,
        },
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Quản lý tài khoản
          </h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản nhân viên, quản lý trong hệ thống
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsImportModalOpen(true)} variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import .xlsx
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tạo tài khoản mới
          </Button>
        </div>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
          <CardDescription>
            Quản lý thông tin và quyền hạn của tất cả tài khoản trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter - FIX #1: Responsive Layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value) => {
                setRoleFilter(value);
              }}
            >
              <SelectTrigger className="w-full sm:w-56 h-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                <SelectValue placeholder="Lọc theo vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value={Roles.FarmStaff}>
                  Nhân viên trang trại
                </SelectItem>
                <SelectItem value={Roles.SaleStaff}>
                  Nhân viên bán hàng
                </SelectItem>
                <SelectItem value={Roles.Customer}>Khách hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <LoadingState message="Đang tải danh sách tài khoản..." />
          ) : error ? (
            <ErrorState
              title="Lỗi khi tải dữ liệu"
              message="Không thể tải danh sách tài khoản. Vui lòng thử lại."
            />
          ) : userList.length === 0 ? (
            <EmptyState
              icon={Users}
              title="Không có tài khoản"
              description="Chưa có tài khoản nào được tạo. Hãy thêm tài khoản mới."
            />
          ) : (
            <>
              {/* Table - FIX #5: Better Scannability */}
              <div className="overflow-x-auto -mx-2">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="border-b-2">
                      <TableHead className="w-12 font-semibold">STT</TableHead>
                      <TableHead className="min-w-[150px] font-semibold">
                        Tên
                      </TableHead>
                      <TableHead className="min-w-[200px] font-semibold">
                        Email
                      </TableHead>
                      <TableHead className="min-w-[140px] font-semibold">
                        Vai trò
                      </TableHead>
                      <TableHead className="min-w-[120px] font-semibold">
                        Trạng thái
                      </TableHead>
                      <TableHead className="min-w-[180px] font-semibold text-right">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userList.map((account, index) => (
                      <TableRow
                        key={account.id}
                        className="hover:bg-muted/50 transition-colors duration-150"
                      >
                        <TableCell>
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {account.fullName}
                        </TableCell>
                        <TableCell>{account.email}</TableCell>
                        <TableCell>{getRoleBadge(account.role)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getStatusBadge(account.isBlocked)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {currentUser &&
                          account.id === parseInt(currentUser.id) ? (
                            <Badge variant="outline" className="text-xs">
                              Tài khoản hiện tại
                            </Badge>
                          ) : (
                            <Button
                              variant={account.isBlocked ? "outline" : "ghost"}
                              size="sm"
                              disabled={togglingUserId === account.id}
                              onClick={() => {
                                setBlockConfirmDialog({
                                  isOpen: true,
                                  userId: account.id,
                                  isCurrentlyBlocked: account.isBlocked,
                                });
                              }}
                              className={
                                account.isBlocked
                                  ? "text-green-600 border-green-200 hover:text-green-600 hover:bg-green-50 gap-2"
                                  : "text-red-600 hover:bg-red-50 hover:text-red-600 gap-2"
                              }
                            >
                              {togglingUserId === account.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : account.isBlocked ? (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  <span className="hidden sm:inline">
                                    Mở khóa
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Ban className="h-4 w-4" />
                                  <span className="hidden sm:inline">Chặn</span>
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="pt-4 border-t">
                  <PaginationWithLinks
                    totalCount={totalItems}
                    pageSize={pageSize}
                    page={currentPage}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add New Account Modal */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo tài khoản nhân viên mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo tài khoản nhân viên
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto p-2">
              {/* FIX #3: Real-time Validation */}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="flex items-center gap-1">
                  Tên đầy đủ
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={newAccount.fullName}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, fullName: e.target.value })
                  }
                  placeholder="Nhập tên đầy đủ"
                  className={
                    !newAccount.fullName && newAccount.fullName !== ""
                      ? "border-destructive"
                      : ""
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="userName" className="flex items-center gap-1">
                  Tên tài khoản (Username)
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="userName"
                  value={newAccount.userName}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, userName: e.target.value })
                  }
                  placeholder="Nhập tên tài khoản"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-1">
                  Email
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, email: e.target.value })
                  }
                  placeholder="Nhập email"
                />
                {newAccount.email &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAccount.email) && (
                    <p className="text-xs text-destructive mt-1">
                      Email không hợp lệ
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={newAccount.phone}
                  onChange={(e) =>
                    setNewAccount({ ...newAccount, phone: e.target.value })
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-1">
                  Vai trò
                  <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={newAccount.role}
                  onValueChange={(value) =>
                    setNewAccount({ ...newAccount, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Roles.FarmStaff}>
                      Nhân viên trang trại
                    </SelectItem>
                    <SelectItem value={Roles.SaleStaff}>
                      Nhân viên bán hàng
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-secondary-foreground font-medium text-sm flex items-center gap-1"
                >
                  Mật khẩu
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={newAccount.password}
                    onChange={(e) =>
                      setNewAccount({ ...newAccount, password: e.target.value })
                    }
                    placeholder="Nhập mật khẩu"
                    className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary pr-11 transition-all duration-200 h-10 px-3 hover:border-primary/50"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {/* Password requirements */}
                <div className="space-y-1 text-xs">
                  <p className="font-medium text-muted-foreground">
                    Yêu cầu mật khẩu:
                  </p>
                  <div className="space-y-0.5 pl-2">
                    <p
                      className={
                        newAccount.password.length >= 6
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {newAccount.password.length >= 6 ? "✓" : "○"} Ít nhất 6 ký
                      tự
                    </p>
                    <p
                      className={
                        /[A-Z]/.test(newAccount.password)
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {/[A-Z]/.test(newAccount.password) ? "✓" : "○"} Ít nhất 1
                      chữ hoa (A-Z)
                    </p>
                    <p
                      className={
                        /[a-z]/.test(newAccount.password)
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {/[a-z]/.test(newAccount.password) ? "✓" : "○"} Ít nhất 1
                      chữ thường (a-z)
                    </p>
                    <p
                      className={
                        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                          newAccount.password,
                        )
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }
                    >
                      {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                        newAccount.password,
                      )
                        ? "✓"
                        : "○"}{" "}
                      Ít nhất 1 ký tự đặc biệt (!@#$%...)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-secondary-foreground font-medium text-sm flex items-center gap-1"
                >
                  Xác nhận mật khẩu
                  <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={newAccount.confirmPassword}
                    onChange={(e) =>
                      setNewAccount({
                        ...newAccount,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Xác nhận mật khẩu"
                    className="bg-input/50 border-border/60 focus:ring-primary/30 focus:border-primary pr-11 transition-all duration-200 h-10 px-3 hover:border-primary/50"
                  />
                  {newAccount.confirmPassword &&
                    newAccount.password !== newAccount.confirmPassword && (
                      <p className="text-xs text-destructive mt-1">
                        Mật khẩu xác nhận không khớp
                      </p>
                    )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-8 w-8 hover:bg-primary/10 rounded-md transition-all duration-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => handleCloseAddModal(false)}
                disabled={createStaffMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                onClick={handleAddAccount}
                disabled={createStaffMutation.isPending}
              >
                {createStaffMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {createStaffMutation.isPending
                  ? "Đang tạo..."
                  : "Tạo tài khoản"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Block/Unblock Confirmation Dialog */}
      <Dialog
        open={blockConfirmDialog.isOpen}
        onOpenChange={(open: boolean) =>
          setBlockConfirmDialog({ ...blockConfirmDialog, isOpen: open })
        }
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              {blockConfirmDialog.isCurrentlyBlocked ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  <span>Bỏ chặn tài khoản?</span>
                </>
              ) : (
                <>
                  <Ban className="h-5 w-5 text-red-600 shrink-0" />
                  <span>Chặn tài khoản?</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed pt-2">
              {blockConfirmDialog.isCurrentlyBlocked
                ? "Bạn có chắc muốn bỏ chặn tài khoản này? Tài khoản sẽ có thể hoạt động bình thường trở lại."
                : "Bạn có chắc muốn chặn tài khoản này? Tài khoản sẽ không thể đăng nhập vào hệ thống."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-6 border-t">
            <Button
              variant="outline"
              disabled={toggleBlockMutation.isPending}
              onClick={() =>
                setBlockConfirmDialog({
                  isOpen: false,
                  userId: null,
                  isCurrentlyBlocked: false,
                })
              }
            >
              Hủy
            </Button>
            <Button
              disabled={toggleBlockMutation.isPending}
              onClick={() => {
                if (blockConfirmDialog.userId) {
                  setTogglingUserId(blockConfirmDialog.userId);
                  toggleBlockMutation.mutate(blockConfirmDialog.userId, {
                    onSuccess: () => {
                      setBlockConfirmDialog({
                        isOpen: false,
                        userId: null,
                        isCurrentlyBlocked: false,
                      });
                      setTogglingUserId(null);
                    },
                    onError: () => {
                      toast.error("Lỗi khi cập nhật trạng thái tài khoản");
                      setTogglingUserId(null);
                    },
                  });
                }
              }}
              className={
                blockConfirmDialog.isCurrentlyBlocked
                  ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                  : "bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              }
            >
              {toggleBlockMutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {blockConfirmDialog.isCurrentlyBlocked
                      ? "Đang bỏ chặn..."
                      : "Đang chặn..."}
                  </span>
                </div>
              ) : blockConfirmDialog.isCurrentlyBlocked ? (
                "Bỏ chặn"
              ) : (
                "Chặn"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileUp className="h-5 w-5" />
              Import tài khoản từ file Excel
            </DialogTitle>
            <DialogDescription>
              Tải lên file Excel (.xlsx) để import nhiều tài khoản cùng lúc
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={!importFile ? handleDragEnter : undefined}
              onDragLeave={!importFile ? handleDragLeave : undefined}
              onDragOver={!importFile ? handleDragOver : undefined}
              onDrop={!importFile ? handleDrop : undefined}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                importFile
                  ? "border-muted-foreground/25 bg-muted/30 opacity-50 cursor-not-allowed"
                  : isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 bg-muted/30"
              }`}
            >
              <FileUp
                className={`h-12 w-12 mx-auto mb-3 ${importFile ? "text-muted-foreground" : isDragActive ? "text-primary" : "text-muted-foreground"}`}
              />
              <p className="text-sm font-medium mb-2">
                {importFile
                  ? "File đã được chọn"
                  : "Kéo thả file Excel vào đây"}
              </p>
              {!importFile && (
                <>
                  <p className="text-xs text-muted-foreground mb-4">hoặc</p>
                  <label>
                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input =
                          e.currentTarget.parentElement?.querySelector(
                            "input[type='file']",
                          ) as HTMLInputElement;
                        input?.click();
                      }}
                    >
                      Chọn file từ máy
                    </Button>
                  </label>
                </>
              )}
            </div>

            {/* File Info */}
            {importFile && (
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">
                      {importFile.name}
                    </p>
                    <p className="text-xs text-green-700">
                      {(importFile.size / 1024)?.toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setImportFile(null)}
                  className="text-green-600 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setIsImportModalOpen(false);
                setImportFile(null);
              }}
              disabled={importMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              onClick={handleImportFile}
              disabled={!importFile || importMutation.isPending}
              className="gap-2"
            >
              {importMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              {importMutation.isPending ? "Đang import..." : "Import"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
