"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  PaginationSection,
  PAGE_SIZE_OPTIONS_DEFAULT,
} from "@/components/common/PaginationSection";
import { useGetUserByRole } from "@/hooks/useUsers";
import { Roles } from "@/lib/api/services/fetchAuth";
import { User } from "@/lib/api/services/fetchUsers";
import { getRoleLabel } from "@/lib/utils/enum";

interface StaffSelectionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStaffId: number | null;
  onSelectStaff: (staffId: number) => void;
}

export default function StaffSelectionModal({
  isOpen,
  onOpenChange,
  selectedStaffId,
  onSelectStaff,
}: StaffSelectionModalProps) {
  const [roleFilter, setRoleFilter] = useState<Roles>(Roles.FarmStaff);
  const [staffSearchTerm, setStaffSearchTerm] = useState("");
  const [staffSearchParams, setStaffSearchParams] = useState({
    role: Roles.FarmStaff,
    pageIndex: 1,
    pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
    search: "",
    isBlocked: false,
  });

  // Fetch staff from both roles (only non-blocked users)
  const { data: farmStaffData, isLoading: isLoadingFarmStaff } =
    useGetUserByRole({
      role: Roles.FarmStaff,
      pageIndex: staffSearchParams.pageIndex,
      pageSize: staffSearchParams.pageSize,
      search: staffSearchParams.search,
      isBlocked: false,
    });

  const { data: saleStaffData, isLoading: isLoadingSaleStaff } =
    useGetUserByRole({
      role: Roles.SaleStaff,
      pageIndex: staffSearchParams.pageIndex,
      pageSize: staffSearchParams.pageSize,
      search: staffSearchParams.search,
      isBlocked: false,
    });

  // Filter staff data for the selection modal based on selected role
  const filteredStaffData = [
    ...(roleFilter === Roles.FarmStaff ? farmStaffData?.data || [] : []),
    ...(roleFilter === Roles.SaleStaff ? saleStaffData?.data || [] : []),
  ];

  const staffData = {
    pageIndex: farmStaffData?.pageIndex || 1,
    totalPages: farmStaffData?.totalPages || 0,
    totalItems: filteredStaffData.length,
    hasPreviousPage: farmStaffData?.hasPreviousPage || false,
    hasNextPage: farmStaffData?.hasNextPage || false,
    data: filteredStaffData,
  };

  const isLoadingStaff = isLoadingFarmStaff || isLoadingSaleStaff;

  const handleClose = () => {
    setStaffSearchTerm("");
    setStaffSearchParams({
      role: Roles.FarmStaff,
      pageIndex: 1,
      pageSize: PAGE_SIZE_OPTIONS_DEFAULT[0],
      search: "",
      isBlocked: false,
    });
    setRoleFilter(Roles.FarmStaff);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chọn Nhân viên</DialogTitle>
          <DialogDescription>
            Chọn nhân viên để gán cho công việc
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Role Filter Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-600">
              Loại nhân viên:
            </label>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value as Roles)}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue />
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

          <Input
            placeholder="Tìm kiếm nhân viên theo tên..."
            value={staffSearchTerm}
            onChange={(e) => {
              setStaffSearchTerm(e.target.value);
              setStaffSearchParams((prev) => ({
                ...prev,
                search: e.target.value,
                pageIndex: 1,
              }));
            }}
            className="w-full"
          />

          {isLoadingStaff ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Đang tải danh sách nhân viên...
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[5%]">#</TableHead>
                    <TableHead className="w-[25%]">Tên Nhân viên</TableHead>
                    <TableHead className="w-[35%]">Email</TableHead>
                    <TableHead className="w-[20%]">Loại</TableHead>
                    <TableHead className="w-[15%]">Số điện thoại</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!staffData?.data || staffData.data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-gray-500 py-4"
                      >
                        Không tìm thấy nhân viên nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staffData.data.map((staff: User) => (
                      <TableRow
                        key={staff.id}
                        onClick={() => onSelectStaff(staff.id)}
                        className={
                          selectedStaffId === staff.id
                            ? "bg-blue-50/50 cursor-pointer"
                            : "hover:bg-gray-50 cursor-pointer"
                        }
                      >
                        <TableCell>
                          <input
                            type="radio"
                            name="staff-selection"
                            checked={selectedStaffId === staff.id}
                            onChange={() => onSelectStaff(staff.id)}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {staff.fullName}
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {staff.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRoleLabel(staff.role as Roles).colorClass}`}
                          >
                            {getRoleLabel(staff.role as Roles).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {staff.email.substring(0, 3)}...
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {staffData && staffData.totalItems > 0 && (
                <PaginationSection
                  totalItems={staffData.totalItems}
                  postsPerPage={staffSearchParams.pageSize}
                  currentPage={staffSearchParams.pageIndex}
                  setCurrentPage={(page) =>
                    setStaffSearchParams((prev) => ({
                      ...prev,
                      pageIndex: page,
                    }))
                  }
                  totalPages={staffData.totalPages}
                  setPageSize={(size) =>
                    setStaffSearchParams((prev) => ({
                      ...prev,
                      pageSize: size,
                      pageIndex: 1,
                    }))
                  }
                  hasNextPage={staffData.hasNextPage}
                  hasPreviousPage={staffData.hasPreviousPage}
                  pageSizeOptions={[5, 10, 20]}
                />
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStaffId === null || isLoadingStaff}
          >
            Chọn nhân viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
