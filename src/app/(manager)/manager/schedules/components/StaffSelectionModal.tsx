"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { PaginationWithLinks } from "@/components/pagination";
import { useGetUserByRole } from "@/hooks/useUsers";

const PAGE_SIZE_OPTIONS = [6, 12, 18];
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  // Fetch staff from both roles (only non-blocked users)
  const { data: farmStaffData, isLoading: isLoadingFarmStaff } =
    useGetUserByRole({
      role: Roles.FarmStaff,
      pageIndex: currentPage,
      pageSize: pageSize,
      search: staffSearchTerm,
      isBlocked: false,
    });

  const { data: saleStaffData, isLoading: isLoadingSaleStaff } =
    useGetUserByRole({
      role: Roles.SaleStaff,
      pageIndex: currentPage,
      pageSize: pageSize,
      search: staffSearchTerm,
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
    setCurrentPage(1);
    setPageSize(PAGE_SIZE_OPTIONS[0]);
    setRoleFilter(Roles.FarmStaff);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-[600px] sm:w-[1000px] flex flex-col">
        <SheetHeader className="sticky top-0 bg-white z-10 pb-4 border-b">
          <SheetTitle>Chọn Nhân viên</SheetTitle>
          <SheetDescription>
            Chọn nhân viên để gán cho công việc
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto space-y-4">
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
              setCurrentPage(1); // Reset to first page when searching
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {!staffData?.data || staffData.data.length === 0 ? (
                  <div className="col-span-full text-center text-gray-500 py-8">
                    Không tìm thấy nhân viên nào.
                  </div>
                ) : (
                  staffData.data.map((staff: User) => (
                    <div
                      key={staff.id}
                      onClick={() => onSelectStaff(staff.id)}
                      className={`
                        relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                        ${
                          selectedStaffId === staff.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex">
                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {staff.fullName}
                              </h4>
                              {selectedStaffId === staff.id && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate mb-2">
                              {staff.email}
                            </p>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={`text-xs ${getRoleLabel(staff.role as Roles).colorClass}`}
                        >
                          {getRoleLabel(staff.role as Roles).label}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {staffData && staffData.totalItems > 0 && (
                <PaginationWithLinks
                  totalCount={staffData.totalItems}
                  pageSize={pageSize}
                  page={currentPage}
                  onPageChange={setCurrentPage}
                  onPageSizeChange={(newSize) => {
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                />
              )}
            </>
          )}
        </div>

        <SheetFooter className="sticky bottom-0 bg-white border-t pt-4 mt-auto">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStaffId === null || isLoadingStaff}
            className="flex-1"
          >
            Chọn nhân viên
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
