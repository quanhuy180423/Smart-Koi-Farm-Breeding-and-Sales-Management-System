"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Users,
  Edit,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Shield
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface Account {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: AccountRole;
  status: AccountStatus;
  joinDate: string;
  totalOrders: number;
  totalSpent: string;
}

interface NewAccountForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
}

type AccountRole = "Quản lý" | "Nhân viên" | "Khách hàng";
type AccountStatus = "active" | "suspended" | "deleted";

const accountData: Account[] = [
  {
    id: "ACC001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@gmail.com",
    phone: "0901234567",
    role: "Khách hàng",
    status: "active",
    joinDate: "2024-01-15",
    totalOrders: 5,
    totalSpent: "50,000,000",
  },
  {
    id: "ACC002", 
    name: "Trần Thị B",
    email: "tranthib@gmail.com",
    phone: "0912345678",
    role: "Nhân viên",
    status: "active",
    joinDate: "2023-08-20",
    totalOrders: 0,
    totalSpent: "0",
  },
  {
    id: "ACC003",
    name: "Lê Văn C",
    email: "levanc@gmail.com", 
    phone: "0923456789",
    role: "Khách hàng",
    status: "suspended",
    joinDate: "2024-02-10",
    totalOrders: 2,
    totalSpent: "15,000,000",
  },
  {
    id: "ACC004",
    name: "Phạm Thị D",
    email: "phamthid@gmail.com",
    phone: "0934567890",
    role: "Quản lý",
    status: "active", 
    joinDate: "2023-05-01",
    totalOrders: 0,
    totalSpent: "0",
  },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Quản lý":
      return <Badge variant="default" className="bg-purple-100 text-purple-800">
        <Shield className="mr-1 h-3 w-3" />
        Quản lý
      </Badge>;
    case "Nhân viên":
      return <Badge variant="default" className="bg-blue-100 text-blue-800">
        <UserCheck className="mr-1 h-3 w-3" />
        Nhân viên
      </Badge>;
    case "Khách hàng":
      return <Badge variant="outline" className="bg-gray-50 text-gray-700">
        <Users className="mr-1 h-3 w-3" />
        Khách hàng
      </Badge>;
    default:
      return <Badge variant="outline">{role}</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge variant="default" className="bg-green-100 text-green-800">Hoạt động</Badge>;
    case "suspended":
      return <Badge variant="destructive">Tạm khóa</Badge>;
    case "deleted":
      return <Badge variant="secondary">Đã xóa</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function AccountManagement() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [newAccount, setNewAccount] = useState<NewAccountForm>({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  const filteredAccounts = accountData.filter((account) => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || account.role === roleFilter;
    const matchesStatus = statusFilter === "all" || account.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
    setIsDetailModalOpen(true);
  };

  const handleAddAccount = () => {
    console.log("Adding new account:", newAccount);
    setIsAddModalOpen(false);
    setNewAccount({
      name: "",
      email: "",
      phone: "",
      role: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  const handleUpdateAccount = () => {
    console.log("Updating account:", editingAccount);
    setIsEditModalOpen(false);
    setEditingAccount(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tài khoản</h1>
          <p className="text-muted-foreground">
            Quản lý tài khoản khách hàng, nhân viên và quản lý trong hệ thống
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo tài khoản mới
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng tài khoản</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accountData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Khách hàng</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData.filter(a => a.role === "Khách hàng").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhân viên</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData.filter(a => a.role === "Nhân viên").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tài khoản khóa</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {accountData.filter(a => a.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
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
          <div className="border rounded-lg p-4 mb-6 bg-muted/10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-2 border-gray-400 pl-10"
                />
              </div>

              {/* Role Filter */}
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="Quản lý">Quản lý</SelectItem>
                  <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                  <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2 w-full border-gray-400">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="suspended">Tạm khóa</SelectItem>
                  <SelectItem value="deleted">Đã xóa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Đơn hàng</TableHead>
                <TableHead>Tổng chi tiêu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account, index) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>{account.phone}</TableCell>
                  <TableCell>{getRoleBadge(account.role)}</TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>{account.joinDate}</TableCell>
                  <TableCell>{account.totalOrders}</TableCell>
                  <TableCell>{account.totalSpent} VNĐ</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDetails(account)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditAccount(account)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedAccount && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">{selectedAccount.name}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {selectedAccount.role} • {selectedAccount.email}
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-muted-foreground">Thông tin cá nhân</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">{selectedAccount.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Số điện thoại:</span>
                      <span className="font-medium">{selectedAccount.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vai trò:</span>
                      {getRoleBadge(selectedAccount.role)}
                    </div>
                    <div className="flex justify-between">
                      <span>Trạng thái:</span>
                      {getStatusBadge(selectedAccount.status)}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-muted-foreground">Hoạt động</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span>Ngày tham gia:</span>
                      <span className="font-medium">{selectedAccount.joinDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng đơn hàng:</span>
                      <span className="font-medium">{selectedAccount.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tổng chi tiêu:</span>
                      <span className="font-medium">{selectedAccount.totalSpent} VNĐ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Add New Account Modal */}
      {isAddModalOpen && (
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">Tạo tài khoản mới</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Nhập thông tin chi tiết cho tài khoản mới trong hệ thống.
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Họ tên</Label>
                  <Input
                    id="name"
                    value={newAccount.name}
                    onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                    placeholder="Nhập họ tên (vd: Nguyễn Văn A)"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium text-gray-700">Vai trò</Label>
                  <Select value={newAccount.role} onValueChange={(value) => setNewAccount({...newAccount, role: value})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                      <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAccount.email}
                    onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                    placeholder="example@gmail.com"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={newAccount.phone}
                    onChange={(e) => setNewAccount({...newAccount, phone: e.target.value})}
                    placeholder="0901234567"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAccount.password}
                    onChange={(e) => setNewAccount({...newAccount, password: e.target.value})}
                    placeholder="Nhập mật khẩu"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Xác nhận mật khẩu</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newAccount.confirmPassword}
                    onChange={(e) => setNewAccount({...newAccount, confirmPassword: e.target.value})}
                    placeholder="Nhập lại mật khẩu"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleAddAccount}>
                  Tạo tài khoản
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Account Modal */}
      {isEditModalOpen && editingAccount && (
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader className="flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-semibold">Chỉnh sửa tài khoản</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Cập nhật thông tin cho tài khoản {editingAccount.name}.
                </DialogDescription>
              </div>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-sm font-medium text-gray-700">Họ tên</Label>
                  <Input
                    id="edit-name"
                    value={editingAccount.name}
                    onChange={(e) => setEditingAccount({...editingAccount, name: e.target.value})}
                    placeholder="Nhập họ tên"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-role" className="text-sm font-medium text-gray-700">Vai trò</Label>
                  <Select value={editingAccount.role} onValueChange={(value) => setEditingAccount({...editingAccount, role: value as AccountRole})}>
                    <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Quản lý">Quản lý</SelectItem>
                      <SelectItem value="Nhân viên">Nhân viên</SelectItem>
                      <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingAccount.email}
                    onChange={(e) => setEditingAccount({...editingAccount, email: e.target.value})}
                    placeholder="example@gmail.com"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone" className="text-sm font-medium text-gray-700">Số điện thoại</Label>
                  <Input
                    id="edit-phone"
                    value={editingAccount.phone}
                    onChange={(e) => setEditingAccount({...editingAccount, phone: e.target.value})}
                    placeholder="0901234567"
                    className="border-2 border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-status" className="text-sm font-medium text-gray-700">Trạng thái</Label>
                <Select value={editingAccount.status} onValueChange={(value) => setEditingAccount({...editingAccount, status: value as AccountStatus})}>
                  <SelectTrigger className="border-2 border-gray-300 focus:border-blue-500 w-full">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                    <SelectItem value="deleted">Đã xóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateAccount}>
                  Cập nhật
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}